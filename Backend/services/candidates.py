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


