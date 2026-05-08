from config.db import get_db_connection
from services.dipsutes import raise_dispute
from services.audit import log_action

def view_candidate_profile(user_id: int):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary= True)

    try:
        # personal info
        user_query = """
            SELECT 
                name, email, contact_no, dob 
            FROM users 
            WHERE user_id = %s
        """
        cursor.execute(user_query, (user_id,))
        user_info = cursor.fetchone()

        if not user_info:
            return {"success": False, "error": "Candidate not found"}

        # academic info
        academic_query = """
            SELECT 
                c.candidate_id,
                c.course,
                c.passout_year,
                c.skills,
                i.name as institute_name,
                i.email as institute_email,
                i.contact_no as institute_contact,
                i.verification_status as institue_legal_status,
                c.future_plan
            FROM candidates c , institutes i
            Where c.institute_id = i.institute_id and c.user_id = %s
        """
        cursor.execute(academic_query, (user_id,))
        academic_history = cursor.fetchall()
        
        # employment history
        employment_query = """
            SELECT 
                e.emp_id, co.company_id, co.name, co.cin, 
                eh.joining_date, eh.exit_date, eh.status
            FROM employees e, companies co, employee_history eh
            WHERE e.company_id = co.company_id and e.emp_id = eh.emp_id and e.user_id = %s
            ORDER BY eh.history_id DESC
        """
        cursor.execute(employment_query, (user_id,))
        empolyment_history = cursor.fetchall()

        # dispute history
        dispute_query = """
            SELECT
                *
            FROM disputes
            WHERE raised_by_type='candidate' AND raised_by_id= %s
                OR raised_against_type='candidate' AND raised_against_id= %s
            ORDER BY created_on DESC;
        """
        cursor.execute(dispute_query, (user_id, user_id))
        dispute_history = cursor.fetchall()

        result = {
            "personal_info" : user_info,
            "acdemic_info" : academic_history,
            "employment_history" : empolyment_history,
            "dispute_history" : dispute_history
        }
        
        return {"success": True, "data": result}

    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    
    finally:
        cursor.close()
        conn.close()


def confirm_exit(data):
    # check for exit_date in DB
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # fetch company_id based on emp_id
        cursor.execute(
            "SELECT emp_id FROM employees where company_id = %s and user_id = %s", (data.company_id, data.user_id)
        )
        record = cursor.fetchone()

        if not record :
            return {"success": False, "error": "Employee not found"}
        
        emp_id = record['emp_id']

        # fetch exit_date based on emp_id and company_id
        cursor.execute(
            "SELECT exit_date FROM employee_history WHERE emp_id = %s and company_id = %s",
            (emp_id, data.company_id)
        )

        result = cursor.fetchone()

        if result :
            if result['exit_date'] == data.date:
                cursor.execute(
                    "UPDATE employee_history SET status = 'Safe Exit' WHERE emp_id = %s and company_id = %s",
                    (emp_id, data.company_id)
                )
                conn.commit()

                # audit log for employee exit confirmation
                log_action(
                    action="CANDIDATE_EXIT_CONFIRMED",
                    performed_by="employee",
                    performed_by_id=emp_id,
                    target_type="company",
                    target_id=data.company_id,
                    description=f"Employee {emp_id} confirmed exit from company {data.company_id}",
                    metadata={"exit_date": str(data.date), "company_id": data.company_id}
                )

                return {"success": True , "message": "Employee Exits Safely"}
            
            # raise a dispute on exit date mismatch
            dispute = raise_dispute(
                raised_by_type="candidate",
                raised_by_id= data.user_id,
                raised_against_type="company",
                raised_against_id= data.company_id,
                topic= "Exit Date mismatch"
            )
            return {"success": False , "error": "Exit date didn't match", "dispute": dispute} 
        
        return {"success": False, "error": "Company hasn't initiated the Exit process."}

    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    
    finally:
        cursor.close()
        conn.close()


def confirm_joining(data):
    # check for joining_date in DB
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # fetch company_id based on emp_id
        cursor.execute(
            "SELECT emp_id FROM employees where company_id = %s and user_id = %s", (data.company_id, data.user_id)
        )
        record = cursor.fetchone()

        if not record :
            return {"success": False, "error": "Employee not found"}
        
        emp_id = record['emp_id']

        # fetch joining_date based on emp_id and company_id
        cursor.execute(
            "SELECT joining_date FROM employee_history WHERE emp_id = %s and company_id = %s",
            (emp_id, data.company_id)
        )

        result = cursor.fetchone()

        print('joining date from DB : ',result['joining_date'], 'User Input : ', data.date)
        if result : 
            if result['joining_date'] == data.date:
                cursor.execute(
                    "UPDATE employee_history SET status = 'Joined Safely' WHERE emp_id = %s and company_id = %s",
                    (emp_id, data.company_id)
                )
                conn.commit()

                # audit log for successfull joining
                log_action(
                    action="CANDIDATE_JOINING_CONFIRMED",
                    performed_by="employee",
                    performed_by_id=emp_id,
                    target_type="company",
                    target_id=data.company_id,
                    description=f"Employee {emp_id} confirmed joining the company {data.company_id}",
                    metadata={"joining_date": str(data.date), "company_id": data.company_id}
                )

                return {"success": True , "message": "Employee joines Safely"} 
            
            # logic to raise the dispute goes here
            dispute = raise_dispute(
                raised_by_type="candidate",
                raised_by_id= data.user_id,
                raised_against_type="company",
                raised_against_id= data.company_id,
                topic= "Joining Date mismatch"
            )
            return {"success": False , "error": "Joining date didn't match", "dispute": dispute} 
        
        return {"success": False, "error": "Company hasn't initiated the onboarding process."}

    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    
    finally:
        cursor.close()
        conn.close()


