from config.db import get_db_connection
from services.dipsutes import raise_dispute
from services.audit import log_action
from services.notifications import notify


JOINING_RECEIVED_DOCS = [
    'offer_letter', 'appointment_letter', 'salary_breakdown',
    'nda_agreement', 'id_card_issued'
]
JOINING_SUBMITTED_DOCS = [
    'aadhaar_submitted', 'pan_submitted', 'form_11_submitted',
    'bank_details_submitted', 'photos_submitted',
    'education_docs_submitted', 'prev_exp_docs_submitted'
]
EXIT_RECEIVED_DOCS = [
    'experience_letter', 'relieving_letter', 'fnf_settlement',
    'salary_slip_last3', 'pf_contribution_letter',
    'no_dues_certificate', 'form_16'
]
EXIT_SUBMITTED_DOCS = [
    'resignation_email', 'company_id_returned',
    'company_assets_returned', 'nda_compliance'
]

def _missing_received_docs(data, doc_list):
    return [doc for doc in doc_list if not getattr(data, doc, False)]

def _get_company_user_id(cursor, company_id):
    """Resolve the user_id that owns a company account."""
    cursor.execute("SELECT user_id FROM companies WHERE company_id = %s", (company_id,))
    row = cursor.fetchone()
    return row['user_id'] if row else None


# ── Step 1: Company initiates joining ────────────────────────────────────────

def initiate_joining(data, company_id: int):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT user_id FROM users WHERE email = %s", (data.user_email,))
        user = cursor.fetchone()
        if not user:
            return {"success": False, "error": "Candidate not found with that email"}

        user_id = user['user_id']

        cursor.execute(
            "SELECT emp_id FROM employees WHERE company_id = %s AND user_id = %s",
            (company_id, user_id)
        )
        if cursor.fetchone():
            return {"success": False, "error": "This candidate is already onboarded at your company"}

        cursor.execute(
            "INSERT INTO employees (company_id, user_id, designation) VALUES (%s, %s, %s)",
            (company_id, user_id, data.designation)
        )
        emp_id = cursor.lastrowid

        cursor.execute(
            """INSERT INTO employee_history
               (company_id, emp_id, joining_date, joining_date_company, status)
               VALUES (%s, %s, %s, %s, 'joining initiated')""",
            (company_id, emp_id, data.joining_date, data.joining_date)
        )
        history_id = cursor.lastrowid
        conn.commit()

        log_action("JOINING_INITIATED", "company", company_id, "employee_history", history_id,
                   f"Company {company_id} initiated joining for user {user_id}",
                   {"joining_date": str(data.joining_date), "emp_id": emp_id})

        # ── Notify candidate ──────────────────────────────────────
        notify(
            user_id=user_id,
            type="JOINING_INITIATED",
            title="Your joining has been initiated",
            message=f"A company has set your joining date as {data.joining_date} "
                    f"for the role of {data.designation}. Please confirm your joining date."
        )

        return {"success": True, "emp_id": emp_id, "history_id": history_id}

    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    finally:
        cursor.close()
        conn.close()


# ── Step 2: Candidate confirms joining date ───────────────────────────────────

def confirm_joining(data, user_id: int):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            "SELECT emp_id FROM employees WHERE company_id = %s AND user_id = %s",
            (data.company_id, user_id)
        )
        emp = cursor.fetchone()
        if not emp:
            return {"success": False, "error": "No employment record found for this company"}

        emp_id = emp['emp_id']

        cursor.execute(
            """SELECT history_id, joining_date_company, status FROM employee_history
               WHERE emp_id = %s AND company_id = %s ORDER BY history_id DESC LIMIT 1""",
            (emp_id, data.company_id)
        )
        history = cursor.fetchone()

        if not history:
            return {"success": False, "error": "Company has not initiated the joining process yet"}
        if history['status'] != 'joining initiated':
            return {"success": False, "error": f"Cannot confirm joining — current status is '{history['status']}'"}

        history_id = history['history_id']
        company_user_id = _get_company_user_id(cursor, data.company_id)

        cursor.execute(
            "UPDATE employee_history SET joining_date_candidate = %s WHERE history_id = %s",
            (data.joining_date, history_id)
        )

        if history['joining_date_company'] == data.joining_date:
            cursor.execute(
                "UPDATE employee_history SET status = 'joining confirmed' WHERE history_id = %s",
                (history_id,)
            )
            conn.commit()

            log_action("JOINING_CONFIRMED", "candidate", user_id, "employee_history", history_id,
                       f"Candidate {user_id} confirmed joining date {data.joining_date}",
                       {"company_id": data.company_id, "joining_date": str(data.joining_date)})

            # ── Notify candidate + company ────────────────────────
            notify(user_id, "JOINING_CONFIRMED", "Joining date confirmed",
                   f"Your joining date of {data.joining_date} has been confirmed. "
                   f"Please complete your document verification to finish the joining process.")
            if company_user_id:
                notify(company_user_id, "JOINING_CONFIRMED",
                       "Candidate confirmed joining date",
                       f"The candidate has confirmed their joining date of {data.joining_date}. "
                       f"Joining status is now confirmed.")

            return {"success": True, "message": "Joining date confirmed. Please complete document verification."}

        # ── Mismatch ──────────────────────────────────────────────
        cursor.execute(
            "UPDATE employee_history SET status = 'joining date mismatch' WHERE history_id = %s",
            (history_id,)
        )
        conn.commit()

        dispute = raise_dispute(
            raised_by_type="candidate", raised_by_id=user_id,
            raised_against_type="company", raised_against_id=data.company_id,
            topic="Joining date mismatch",
            description=(f"Candidate submitted joining date: {data.joining_date}. "
                         f"Company submitted: {history['joining_date_company']}.")
        )

        log_action("JOINING_DATE_MISMATCH", "system", None, "employee_history", history_id,
                   f"Joining date mismatch for emp {emp_id}",
                   {"company_date": str(history['joining_date_company']),
                    "candidate_date": str(data.joining_date),
                    "dispute_id": dispute.get('dispute_id')})

        # ── Notify both parties ───────────────────────────────────
        notify(user_id, "DISPUTE_RAISED", "Dispute raised — joining date mismatch",
               f"Your joining date ({data.joining_date}) doesn't match the company's record "
               f"({history['joining_date_company']}). Dispute #{dispute.get('dispute_id')} has been raised.")
        if company_user_id:
            notify(company_user_id, "DISPUTE_RAISED", "Dispute raised — joining date mismatch",
                   f"A candidate disputed their joining date. "
                   f"They submitted {data.joining_date}, your record shows {history['joining_date_company']}. "
                   f"Dispute #{dispute.get('dispute_id')} has been raised.")

        return {
            "success": False,
            "error": "Joining date does not match company records. A dispute has been raised.",
            "company_date": str(history['joining_date_company']),
            "your_date": str(data.joining_date),
            "dispute_id": dispute.get('dispute_id')
        }

    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    finally:
        cursor.close()
        conn.close()


# ── Step 3: Candidate submits joining documents ───────────────────────────────

def submit_joining_documents(data, user_id: int):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            "SELECT emp_id FROM employees WHERE company_id = %s AND user_id = %s",
            (data.company_id, user_id)
        )
        emp = cursor.fetchone()
        if not emp:
            return {"success": False, "error": "Employment record not found"}

        emp_id = emp['emp_id']

        cursor.execute(
            """SELECT history_id, status FROM employee_history
               WHERE emp_id = %s AND company_id = %s ORDER BY history_id DESC LIMIT 1""",
            (emp_id, data.company_id)
        )
        history = cursor.fetchone()

        if not history:
            return {"success": False, "error": "No employment history found"}
        if history['status'] != 'joining confirmed':
            return {"success": False, "error": f"Cannot submit documents — current status is '{history['status']}'"}

        history_id = history['history_id']
        company_user_id = _get_company_user_id(cursor, data.company_id)

        cursor.execute(
            """INSERT INTO joining_documents (
                history_id, emp_id, submitted_by,
                offer_letter, appointment_letter, salary_breakdown,
                nda_agreement, id_card_issued,
                aadhaar_submitted, pan_submitted, form_11_submitted,
                bank_details_submitted, photos_submitted,
                education_docs_submitted, prev_exp_docs_submitted, notes
            ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
            (history_id, emp_id, user_id,
             data.offer_letter, data.appointment_letter, data.salary_breakdown,
             data.nda_agreement, data.id_card_issued,
             data.aadhaar_submitted, data.pan_submitted, data.form_11_submitted,
             data.bank_details_submitted, data.photos_submitted,
             data.education_docs_submitted, data.prev_exp_docs_submitted,
             data.notes)
        )

        missing = _missing_received_docs(data, JOINING_RECEIVED_DOCS)

        if not missing:
            cursor.execute(
                "UPDATE employee_history SET status = 'joining completed' WHERE history_id = %s",
                (history_id,)
            )
            conn.commit()

            log_action("JOINING_COMPLETED", "candidate", user_id, "employee_history", history_id,
                       f"Candidate {user_id} completed joining", {"company_id": data.company_id})

            # ── Notify both ───────────────────────────────────────
            notify(user_id, "JOINING_COMPLETED", "Joining process complete",
                   "You have confirmed all joining documents. Your employment record is now live and verified.")
            if company_user_id:
                notify(company_user_id, "JOINING_COMPLETED",
                       "Employee joining process complete",
                       "The candidate has verified all joining documents. Their employment record is now active.")

            return {"success": True, "message": "Joining process complete. All documents verified."}

        # ── Missing docs ──────────────────────────────────────────
        cursor.execute(
            "UPDATE employee_history SET status = 'joining documents incomplete' WHERE history_id = %s",
            (history_id,)
        )
        conn.commit()

        dispute = raise_dispute(
            raised_by_type="candidate", raised_by_id=user_id,
            raised_against_type="company", raised_against_id=data.company_id,
            topic="Joining documents incomplete",
            description=f"Candidate has not received: {', '.join(missing)}"
        )

        log_action("JOINING_DOCUMENTS_INCOMPLETE", "system", None, "employee_history", history_id,
                   f"Missing joining docs for emp {emp_id}: {missing}",
                   {"missing_docs": missing, "dispute_id": dispute.get('dispute_id')})

        notify(user_id, "DISPUTE_RAISED", "Dispute raised — joining documents missing",
               f"You reported missing documents: {', '.join(missing)}. "
               f"Dispute #{dispute.get('dispute_id')} has been raised automatically.")
        if company_user_id:
            notify(company_user_id, "DISPUTE_RAISED", "Dispute raised — joining documents missing",
                   f"A candidate reported not receiving these joining documents: {', '.join(missing)}. "
                   f"Dispute #{dispute.get('dispute_id')} has been raised.")

        return {
            "success": False,
            "error": "Some documents are missing. A dispute has been raised.",
            "missing_documents": missing,
            "dispute_id": dispute.get('dispute_id')
        }

    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    finally:
        cursor.close()
        conn.close()


# ── Step 4: Company initiates exit ───────────────────────────────────────────

def initiate_exit(data, company_id: int):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT user_id FROM users WHERE email = %s", (data.user_email,))
        user = cursor.fetchone()
        if not user:
            return {"success": False, "error": "User not found"}

        user_id = user['user_id']

        cursor.execute(
            "SELECT emp_id FROM employees WHERE company_id = %s AND user_id = %s",
            (company_id, user_id)
        )
        emp = cursor.fetchone()
        if not emp:
            return {"success": False, "error": "Employee not found at this company"}

        emp_id = emp['emp_id']

        cursor.execute(
            """SELECT history_id, status FROM employee_history
               WHERE emp_id = %s AND company_id = %s ORDER BY history_id DESC LIMIT 1""",
            (emp_id, company_id)
        )
        history = cursor.fetchone()

        if not history:
            return {"success": False, "error": "No employment history found"}
        if history['status'] != 'joining completed':
            return {"success": False, "error": f"Cannot initiate exit — joining not completed. Status: '{history['status']}'"}

        cursor.execute(
            """UPDATE employee_history
               SET exit_date = %s, exit_date_company = %s, status = 'exit initiated'
               WHERE history_id = %s""",
            (data.exit_date, data.exit_date, history['history_id'])
        )
        conn.commit()

        log_action("EXIT_INITIATED", "company", company_id, "employee_history", history['history_id'],
                   f"Company {company_id} initiated exit for emp {emp_id}",
                   {"exit_date": str(data.exit_date)})

        # ── Notify candidate ──────────────────────────────────────
        notify(user_id, "EXIT_INITIATED", "Your exit has been initiated",
               f"Your employer has set your last working day as {data.exit_date}. "
               f"Please confirm your exit date.")

        return {"success": True, "message": "Exit initiated. Candidate must confirm their exit date."}

    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    finally:
        cursor.close()
        conn.close()


# ── Step 5: Candidate confirms exit date ─────────────────────────────────────

def confirm_exit(data, user_id: int):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            "SELECT emp_id FROM employees WHERE company_id = %s AND user_id = %s",
            (data.company_id, user_id)
        )
        emp = cursor.fetchone()
        if not emp:
            return {"success": False, "error": "Employment record not found"}

        emp_id = emp['emp_id']

        cursor.execute(
            """SELECT history_id, exit_date_company, status FROM employee_history
               WHERE emp_id = %s AND company_id = %s ORDER BY history_id DESC LIMIT 1""",
            (emp_id, data.company_id)
        )
        history = cursor.fetchone()

        if not history:
            return {"success": False, "error": "No employment history found"}
        if history['status'] != 'exit initiated':
            return {"success": False, "error": f"Cannot confirm exit — current status is '{history['status']}'"}

        history_id = history['history_id']
        company_user_id = _get_company_user_id(cursor, data.company_id)

        cursor.execute(
            "UPDATE employee_history SET exit_date_candidate = %s WHERE history_id = %s",
            (data.exit_date, history_id)
        )

        if history['exit_date_company'] == data.exit_date:
            cursor.execute(
                "UPDATE employee_history SET status = 'exit confirmed' WHERE history_id = %s",
                (history_id,)
            )
            conn.commit()

            log_action("EXIT_CONFIRMED", "candidate", user_id, "employee_history", history_id,
                       f"Candidate {user_id} confirmed exit date {data.exit_date}",
                       {"company_id": data.company_id, "exit_date": str(data.exit_date)})

            notify(user_id, "EXIT_CONFIRMED", "Exit date confirmed",
                   f"Your exit date of {data.exit_date} has been confirmed. "
                   f"Please verify your exit documents to complete the process.")
            if company_user_id:
                notify(company_user_id, "EXIT_CONFIRMED", "Employee confirmed exit date",
                       f"The employee has confirmed their exit date of {data.exit_date}.")

            return {"success": True, "message": "Exit date confirmed. Please verify your exit documents."}

        # ── Mismatch ──────────────────────────────────────────────
        cursor.execute(
            "UPDATE employee_history SET status = 'exit date mismatch' WHERE history_id = %s",
            (history_id,)
        )
        conn.commit()

        dispute = raise_dispute(
            raised_by_type="candidate", raised_by_id=user_id,
            raised_against_type="company", raised_against_id=data.company_id,
            topic="Exit date mismatch",
            description=(f"Candidate submitted exit date: {data.exit_date}. "
                         f"Company submitted: {history['exit_date_company']}.")
        )

        log_action("EXIT_DATE_MISMATCH", "system", None, "employee_history", history_id,
                   f"Exit date mismatch for emp {emp_id}",
                   {"company_date": str(history['exit_date_company']),
                    "candidate_date": str(data.exit_date),
                    "dispute_id": dispute.get('dispute_id')})

        notify(user_id, "DISPUTE_RAISED", "Dispute raised — exit date mismatch",
               f"Your exit date ({data.exit_date}) doesn't match the company's record "
               f"({history['exit_date_company']}). Dispute #{dispute.get('dispute_id')} has been raised.")
        if company_user_id:
            notify(company_user_id, "DISPUTE_RAISED", "Dispute raised — exit date mismatch",
                   f"A candidate disputed their exit date. "
                   f"They submitted {data.exit_date}, your record shows {history['exit_date_company']}. "
                   f"Dispute #{dispute.get('dispute_id')} has been raised.")

        return {
            "success": False,
            "error": "Exit date does not match company records. A dispute has been raised.",
            "company_date": str(history['exit_date_company']),
            "your_date": str(data.exit_date),
            "dispute_id": dispute.get('dispute_id')
        }

    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    finally:
        cursor.close()
        conn.close()


# ── Step 6: Candidate submits exit documents ──────────────────────────────────

def submit_exit_documents(data, user_id: int):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            "SELECT emp_id FROM employees WHERE company_id = %s AND user_id = %s",
            (data.company_id, user_id)
        )
        emp = cursor.fetchone()
        if not emp:
            return {"success": False, "error": "Employment record not found"}

        emp_id = emp['emp_id']

        cursor.execute(
            """SELECT history_id, status FROM employee_history
               WHERE emp_id = %s AND company_id = %s ORDER BY history_id DESC LIMIT 1""",
            (emp_id, data.company_id)
        )
        history = cursor.fetchone()

        if not history:
            return {"success": False, "error": "No employment history found"}
        if history['status'] != 'exit confirmed':
            return {"success": False, "error": f"Cannot submit exit documents — current status is '{history['status']}'"}

        history_id = history['history_id']
        company_user_id = _get_company_user_id(cursor, data.company_id)

        cursor.execute(
            """INSERT INTO exit_documents (
                history_id, emp_id, submitted_by,
                experience_letter, relieving_letter, fnf_settlement,
                salary_slip_last3, pf_contribution_letter,
                no_dues_certificate, form_16,
                resignation_email, company_id_returned,
                company_assets_returned, nda_compliance, notes
            ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
            (history_id, emp_id, user_id,
             data.experience_letter, data.relieving_letter, data.fnf_settlement,
             data.salary_slip_last3, data.pf_contribution_letter,
             data.no_dues_certificate, data.form_16,
             data.resignation_email, data.company_id_returned,
             data.company_assets_returned, data.nda_compliance,
             data.notes)
        )

        missing = _missing_received_docs(data, EXIT_RECEIVED_DOCS)

        if not missing:
            cursor.execute(
                "UPDATE employee_history SET status = 'exit completed' WHERE history_id = %s",
                (history_id,)
            )
            conn.commit()

            log_action("EXIT_COMPLETED", "candidate", user_id, "employee_history", history_id,
                       f"Candidate {user_id} completed exit", {"company_id": data.company_id})

            notify(user_id, "EXIT_COMPLETED", "Exit process complete",
                   "Your exit has been fully verified. This employment record is now closed and tamper-proof.")
            if company_user_id:
                notify(company_user_id, "EXIT_COMPLETED", "Employee exit process complete",
                       "The employee has verified all exit documents. Their employment record is now closed.")

            return {"success": True, "message": "Exit process complete. Employment record is now fully verified."}

        # ── Missing exit docs ─────────────────────────────────────
        cursor.execute(
            "UPDATE employee_history SET status = 'exit documents incomplete' WHERE history_id = %s",
            (history_id,)
        )
        conn.commit()

        dispute = raise_dispute(
            raised_by_type="candidate", raised_by_id=user_id,
            raised_against_type="company", raised_against_id=data.company_id,
            topic="Exit documents incomplete",
            description=f"Candidate has not received: {', '.join(missing)}"
        )

        log_action("EXIT_DOCUMENTS_INCOMPLETE", "system", None, "employee_history", history_id,
                   f"Missing exit docs for emp {emp_id}: {missing}",
                   {"missing_docs": missing, "dispute_id": dispute.get('dispute_id')})

        notify(user_id, "DISPUTE_RAISED", "Dispute raised — exit documents missing",
               f"You reported missing exit documents: {', '.join(missing)}. "
               f"Dispute #{dispute.get('dispute_id')} has been raised.")
        if company_user_id:
            notify(company_user_id, "DISPUTE_RAISED", "Dispute raised — exit documents missing",
                   f"A candidate reported not receiving these exit documents: {', '.join(missing)}. "
                   f"Dispute #{dispute.get('dispute_id')} has been raised.")

        return {
            "success": False,
            "error": "Some exit documents are missing. A dispute has been raised.",
            "missing_documents": missing,
            "dispute_id": dispute.get('dispute_id')
        }

    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    finally:
        cursor.close()
        conn.close()
