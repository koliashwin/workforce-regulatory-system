from config.db import get_db_connection
from services.dipsutes import raise_dispute, check_duplicate_dispute
from services.audit import log_action


# ── Document completeness helpers ────────────────────────────────────────────

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

def _missing_received_docs(data, doc_list: list) -> list:
    """Returns list of received documents the candidate has NOT checked."""
    return [doc for doc in doc_list if not getattr(data, doc, False)]


# ── Joining: Step 1 — Company initiates ──────────────────────────────────────

def initiate_joining(data, company_id: int):
    """
    Company sets the joining date for a candidate.
    Creates employee + employee_history records.
    Status → 'joining initiated'
    """
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # Resolve user from email
        cursor.execute(
            "SELECT user_id FROM users WHERE email = %s", (data.user_email,)
        )
        user = cursor.fetchone()
        if not user:
            return {"success": False, "error": "Candidate not found with that email"}

        user_id = user['user_id']

        # Prevent duplicate onboarding
        cursor.execute(
            "SELECT emp_id FROM employees WHERE company_id = %s AND user_id = %s",
            (company_id, user_id)
        )
        if cursor.fetchone():
            return {"success": False, "error": "This candidate is already onboarded at your company"}

        # Create employee record
        cursor.execute(
            "INSERT INTO employees (company_id, user_id, designation) VALUES (%s, %s, %s)",
            (company_id, user_id, data.designation)
        )
        emp_id = cursor.lastrowid

        # Create history record with company joining date
        cursor.execute(
            """INSERT INTO employee_history
               (company_id, emp_id, joining_date, joining_date_company, status)
               VALUES (%s, %s, %s, %s, 'joining initiated')""",
            (company_id, emp_id, data.joining_date, data.joining_date)
        )
        history_id = cursor.lastrowid
        conn.commit()

        log_action(
            action="JOINING_INITIATED",
            performed_by="company",
            performed_by_id=company_id,
            target_type="employee_history",
            target_id=history_id,
            description=f"Company {company_id} initiated joining for user {user_id}",
            metadata={"joining_date": str(data.joining_date), "emp_id": emp_id}
        )

        return {"success": True, "emp_id": emp_id, "history_id": history_id}

    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    finally:
        cursor.close()
        conn.close()


# ── Joining: Step 2 — Candidate confirms date ────────────────────────────────

def confirm_joining(data, user_id: int):
    """
    Candidate confirms or disputes the joining date set by company.
    Match   → status = 'joining confirmed'
    Mismatch → status = 'joining date mismatch' + auto dispute
    """
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # Get employee + history record
        cursor.execute(
            "SELECT emp_id FROM employees WHERE company_id = %s AND user_id = %s",
            (data.company_id, user_id)
        )
        emp = cursor.fetchone()
        if not emp:
            return {"success": False, "error": "No employment record found for this company"}

        emp_id = emp['emp_id']

        cursor.execute(
            """SELECT history_id, joining_date_company, status
               FROM employee_history
               WHERE emp_id = %s AND company_id = %s
               ORDER BY history_id DESC LIMIT 1""",
            (emp_id, data.company_id)
        )
        history = cursor.fetchone()

        if not history:
            return {"success": False, "error": "Company has not initiated the joining process yet"}

        if history['status'] != 'joining initiated':
            return {"success": False, "error": f"Cannot confirm joining — current status is '{history['status']}'"}

        history_id = history['history_id']

        # Store candidate's submitted date
        cursor.execute(
            "UPDATE employee_history SET joining_date_candidate = %s WHERE history_id = %s",
            (data.joining_date, history_id)
        )

        # Compare dates
        if history['joining_date_company'] == data.joining_date:
            cursor.execute(
                "UPDATE employee_history SET status = 'joining confirmed' WHERE history_id = %s",
                (history_id,)
            )
            conn.commit()

            log_action(
                action="JOINING_CONFIRMED",
                performed_by="candidate",
                performed_by_id=user_id,
                target_type="employee_history",
                target_id=history_id,
                description=f"Candidate {user_id} confirmed joining date {data.joining_date}",
                metadata={"company_id": data.company_id, "joining_date": str(data.joining_date)}
            )

            return {"success": True, "message": "Joining date confirmed. Please complete document verification."}

        # ── Mismatch ──────────────────────────────────────────────────────────
        cursor.execute(
            "UPDATE employee_history SET status = 'joining date mismatch' WHERE history_id = %s",
            (history_id,)
        )
        conn.commit()

        # Auto-raise dispute (with duplicate check)
        dispute = raise_dispute(
            raised_by_type="candidate",
            raised_by_id=user_id,
            raised_against_type="company",
            raised_against_id=data.company_id,
            topic="Joining date mismatch",
            description=(
                f"Candidate submitted joining date: {data.joining_date}. "
                f"Company submitted: {history['joining_date_company']}."
            )
        )

        log_action(
            action="JOINING_DATE_MISMATCH",
            performed_by="system",
            target_type="employee_history",
            target_id=history_id,
            description=f"Joining date mismatch for emp {emp_id}",
            metadata={
                "company_date": str(history['joining_date_company']),
                "candidate_date": str(data.joining_date),
                "dispute_id": dispute.get('dispute_id')
            }
        )

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


# ── Joining: Step 3 — Candidate submits document checklist ───────────────────

def submit_joining_documents(data, user_id: int):
    """
    Candidate marks which joining documents were received and submitted.
    All received docs checked → status = 'joining completed'
    Any received doc missing → status = 'joining documents incomplete' + auto dispute
    """
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
               WHERE emp_id = %s AND company_id = %s
               ORDER BY history_id DESC LIMIT 1""",
            (emp_id, data.company_id)
        )
        history = cursor.fetchone()

        if not history:
            return {"success": False, "error": "No employment history found"}

        if history['status'] != 'joining confirmed':
            return {"success": False, "error": f"Cannot submit documents — current status is '{history['status']}'"}

        history_id = history['history_id']

        # Save document checklist
        cursor.execute(
            """INSERT INTO joining_documents (
                history_id, emp_id, submitted_by,
                offer_letter, appointment_letter, salary_breakdown,
                nda_agreement, id_card_issued,
                aadhaar_submitted, pan_submitted, form_11_submitted,
                bank_details_submitted, photos_submitted,
                education_docs_submitted, prev_exp_docs_submitted, notes
            ) VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s, %s, %s, %s
            )""",
            (
                history_id, emp_id, user_id,
                data.offer_letter, data.appointment_letter, data.salary_breakdown,
                data.nda_agreement, data.id_card_issued,
                data.aadhaar_submitted, data.pan_submitted, data.form_11_submitted,
                data.bank_details_submitted, data.photos_submitted,
                data.education_docs_submitted, data.prev_exp_docs_submitted,
                data.notes
            )
        )

        # Check for missing received documents
        missing = _missing_received_docs(data, JOINING_RECEIVED_DOCS)

        if not missing:
            cursor.execute(
                "UPDATE employee_history SET status = 'joining completed' WHERE history_id = %s",
                (history_id,)
            )
            conn.commit()

            log_action(
                action="JOINING_COMPLETED",
                performed_by="candidate",
                performed_by_id=user_id,
                target_type="employee_history",
                target_id=history_id,
                description=f"Candidate {user_id} completed joining — all documents verified",
                metadata={"company_id": data.company_id}
            )

            return {"success": True, "message": "Joining process complete. All documents verified."}

        # ── Missing received documents → dispute ──────────────────────────────
        cursor.execute(
            "UPDATE employee_history SET status = 'joining documents incomplete' WHERE history_id = %s",
            (history_id,)
        )
        conn.commit()

        dispute = raise_dispute(
            raised_by_type="candidate",
            raised_by_id=user_id,
            raised_against_type="company",
            raised_against_id=data.company_id,
            topic="Joining documents incomplete",
            description=f"Candidate has not received: {', '.join(missing)}"
        )

        log_action(
            action="JOINING_DOCUMENTS_INCOMPLETE",
            performed_by="system",
            target_type="employee_history",
            target_id=history_id,
            description=f"Missing joining docs for emp {emp_id}: {missing}",
            metadata={"missing_docs": missing, "dispute_id": dispute.get('dispute_id')}
        )

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


# ── Exit: Step 1 — Company initiates exit ────────────────────────────────────

def initiate_exit(data, company_id: int):
    """
    Company sets the exit date for an employee.
    Status → 'exit initiated'
    """
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT user_id FROM users WHERE email = %s", (data.user_email,)
        )
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
               WHERE emp_id = %s AND company_id = %s
               ORDER BY history_id DESC LIMIT 1""",
            (emp_id, company_id)
        )
        history = cursor.fetchone()

        if not history:
            return {"success": False, "error": "No employment history found"}

        if history['status'] != 'joining completed':
            return {"success": False, "error": f"Cannot initiate exit — joining process not completed. Current status: '{history['status']}'"}

        cursor.execute(
            """UPDATE employee_history
               SET exit_date = %s, exit_date_company = %s, status = 'exit initiated'
               WHERE history_id = %s""",
            (data.exit_date, data.exit_date, history['history_id'])
        )
        conn.commit()

        log_action(
            action="EXIT_INITIATED",
            performed_by="company",
            performed_by_id=company_id,
            target_type="employee_history",
            target_id=history['history_id'],
            description=f"Company {company_id} initiated exit for emp {emp_id}",
            metadata={"exit_date": str(data.exit_date)}
        )

        return {"success": True, "message": "Exit initiated. Candidate must confirm their exit date."}

    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    finally:
        cursor.close()
        conn.close()


# ── Exit: Step 2 — Candidate confirms exit date ──────────────────────────────

def confirm_exit(data, user_id: int):
    """
    Candidate confirms or disputes the exit date set by company.
    Match    → status = 'exit confirmed'
    Mismatch → status = 'exit date mismatch' + auto dispute
    """
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
            """SELECT history_id, exit_date_company, status
               FROM employee_history
               WHERE emp_id = %s AND company_id = %s
               ORDER BY history_id DESC LIMIT 1""",
            (emp_id, data.company_id)
        )
        history = cursor.fetchone()

        if not history:
            return {"success": False, "error": "No employment history found"}

        if history['status'] != 'exit initiated':
            return {"success": False, "error": f"Cannot confirm exit — current status is '{history['status']}'"}

        history_id = history['history_id']

        # Store candidate's exit date
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

            log_action(
                action="EXIT_CONFIRMED",
                performed_by="candidate",
                performed_by_id=user_id,
                target_type="employee_history",
                target_id=history_id,
                description=f"Candidate {user_id} confirmed exit date {data.exit_date}",
                metadata={"company_id": data.company_id, "exit_date": str(data.exit_date)}
            )

            return {"success": True, "message": "Exit date confirmed. Please verify your exit documents."}

        # ── Mismatch ──────────────────────────────────────────────────────────
        cursor.execute(
            "UPDATE employee_history SET status = 'exit date mismatch' WHERE history_id = %s",
            (history_id,)
        )
        conn.commit()

        dispute = raise_dispute(
            raised_by_type="candidate",
            raised_by_id=user_id,
            raised_against_type="company",
            raised_against_id=data.company_id,
            topic="Exit date mismatch",
            description=(
                f"Candidate submitted exit date: {data.exit_date}. "
                f"Company submitted: {history['exit_date_company']}."
            )
        )

        log_action(
            action="EXIT_DATE_MISMATCH",
            performed_by="system",
            target_type="employee_history",
            target_id=history_id,
            description=f"Exit date mismatch for emp {emp_id}",
            metadata={
                "company_date": str(history['exit_date_company']),
                "candidate_date": str(data.exit_date),
                "dispute_id": dispute.get('dispute_id')
            }
        )

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


# ── Exit: Step 3 — Candidate submits exit document checklist ─────────────────

def submit_exit_documents(data, user_id: int):
    """
    Candidate marks which exit documents were received and submitted.
    All received docs checked → status = 'exit completed'
    Any received doc missing  → status = 'exit documents incomplete' + auto dispute
    """
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
               WHERE emp_id = %s AND company_id = %s
               ORDER BY history_id DESC LIMIT 1""",
            (emp_id, data.company_id)
        )
        history = cursor.fetchone()

        if not history:
            return {"success": False, "error": "No employment history found"}

        if history['status'] != 'exit confirmed':
            return {"success": False, "error": f"Cannot submit exit documents — current status is '{history['status']}'"}

        history_id = history['history_id']

        cursor.execute(
            """INSERT INTO exit_documents (
                history_id, emp_id, submitted_by,
                experience_letter, relieving_letter, fnf_settlement,
                salary_slip_last3, pf_contribution_letter,
                no_dues_certificate, form_16,
                resignation_email, company_id_returned,
                company_assets_returned, nda_compliance, notes
            ) VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s, %s, %s
            )""",
            (
                history_id, emp_id, user_id,
                data.experience_letter, data.relieving_letter, data.fnf_settlement,
                data.salary_slip_last3, data.pf_contribution_letter,
                data.no_dues_certificate, data.form_16,
                data.resignation_email, data.company_id_returned,
                data.company_assets_returned, data.nda_compliance,
                data.notes
            )
        )

        missing = _missing_received_docs(data, EXIT_RECEIVED_DOCS)

        if not missing:
            cursor.execute(
                "UPDATE employee_history SET status = 'exit completed' WHERE history_id = %s",
                (history_id,)
            )
            conn.commit()

            log_action(
                action="EXIT_COMPLETED",
                performed_by="candidate",
                performed_by_id=user_id,
                target_type="employee_history",
                target_id=history_id,
                description=f"Candidate {user_id} completed exit — all documents verified",
                metadata={"company_id": data.company_id}
            )

            return {"success": True, "message": "Exit process complete. Employment record is now fully verified."}

        # ── Missing exit docs → dispute ───────────────────────────────────────
        cursor.execute(
            "UPDATE employee_history SET status = 'exit documents incomplete' WHERE history_id = %s",
            (history_id,)
        )
        conn.commit()

        dispute = raise_dispute(
            raised_by_type="candidate",
            raised_by_id=user_id,
            raised_against_type="company",
            raised_against_id=data.company_id,
            topic="Exit documents incomplete",
            description=f"Candidate has not received: {', '.join(missing)}"
        )

        log_action(
            action="EXIT_DOCUMENTS_INCOMPLETE",
            performed_by="system",
            target_type="employee_history",
            target_id=history_id,
            description=f"Missing exit docs for emp {emp_id}: {missing}",
            metadata={"missing_docs": missing, "dispute_id": dispute.get('dispute_id')}
        )

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
