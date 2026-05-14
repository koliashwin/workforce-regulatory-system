from datetime import date
from config.db import get_db_connection
from services.audit import log_action
from utils.password import hash_password

def all_candidates_list(institute_id: int):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        query = """
        SELECT 
            u.user_id AS user_id,
            u.role_code AS role_code,
            u.name AS user_name,
            u.email AS user_email,
            c.candidate_id AS candidate_id,
            c.course AS course,
            c.passout_year AS passout_year,
            c.skills AS skills,
            i.institute_id AS institute_id,
            i.name AS institute_name,
            i.email AS institute_email
        FROM users u, candidates c, institutes i
        WHERE u.user_id = c.user_id and i.institute_id = c.institute_id
            and i.institute_id = %s
        """
        cursor.execute(query, (institute_id,))
        results = cursor.fetchall()
        # print("DB REsults :", results)
        if not results:
            return {'success': True, 'data': []}
        return {'success': True, 'data': results}
    
    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    
    finally:
        cursor.close()
        conn.close()


def clg_onboard_candidate(data):
    '''
    function description goes here
    '''
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # cursor.execute("SELECT institute_id FROM institutes WHERE email = %s", (data.institute_email,))
        # result = cursor.fetchone()

        # if not result:
        #     return {"success": False, "error": "College not found"}
        
        # institute_id = result['institute_id']

        cursor.execute(
            "insert into users (role_code, email, password_hash, name, contact_no, dob) VALUES (100, %s, %s, %s, %s, %s)",
            (data.email, hash_password("Abced@12345"), data.name, data.contact_no, data.dob)
        )

        user_id = cursor.lastrowid

        cursor.execute(
            "INSERT INTO candidates (institute_id, user_id, course, passout_year, skills) VALUES (%s, %s, %s, %s, %s)",
            (data.institute_id, user_id, data.course, data.passout_year, data.skills)
        )
        candidate_id = cursor.lastrowid
        conn.commit()

        # audit log for onboarding candidates on portal
        log_action(
            action="CANDIDATE_ONBOARDED",
            performed_by="institutes",
            performed_by_id=data.institute_id,
            target_type="candidates",
            target_id=candidate_id,
            description=f"Candidate {candidate_id} Onboarded on the platform by Institute {data.institute_id}",
            metadata={"institute_id": data.institute_id, "candidate_id": candidate_id}
        )

        return {"success": True, "user_id":user_id, "candidate_id": cursor.lastrowid}
    
    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    
    finally:
        cursor.close()
        conn.close()

def register_institute(data):

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # create a user for company
        cursor.execute(
            "INSERT INTO users (role_code, email, password_hash, name, contact_no, dob) VALUES (200, %s, %s, %s, %s, %s)",
            (data.email, hash_password("Abced@12345"), data.user_name, data.contact_no, date.today())
        )
        user_id = cursor.lastrowid

        # store company details int DB
        cursor.execute(
            "INSERT INTO institutes (name, institute_code, user_id, address, contact_no, email) VALUES(%s, %s, %s, %s, %s, %s)",
            (data.name, data.cin, user_id, data.address, data.contact_no, data.email)
        )
        institute_id = cursor.lastrowid
        conn.commit()

        # audit log for registering institute
        log_action(
            action="INSTITUTE_REGISTRED_ON_PORTAL",
            performed_by="system",
            target_type="institutes",
            target_id=institute_id,
            description=f"Institute {institute_id} Registred on Platform",
            metadata={"institute_id": institute_id}
        )
        return {"success": True, "institute_id": cursor.lastrowid}
    
    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    
    finally:
        cursor.close()
        conn.close()

def all_institutes_list():

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # returive the data from DB
        query = """SELECT * FROM institutes"""

        cursor.execute(query)
        results = cursor.fetchall()
        
        # return empty list or fetched records
        if not results:
            return {'success': True, 'data':[]}
        return {'success': True, 'data':results}
    
    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    
    finally:
        cursor.close()
        conn.close()

def view_institute_profile(institute_id: int):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        institute_query ='''
        SELECT * FROM institutes WHERE institute_id = %s
        '''
        cursor.execute(institute_query, (institute_id,))
        institute_info = cursor.fetchone()

        if not institute_info:
            return {"success": False, "error": "Company not found"}

        students_query ='''
        SELECT 
            u.user_id, c.candidate_id, e.emp_id, co.company_id,
            u.name as student_name, u.email as student_contact,
            u.contact_no as student_contact, c.course, c.passout_year,
            c.skills, c.future_plan, co.name as company_name, e.designation
        FROM candidates c
        LEFT JOIN users u ON u.user_id = c.user_id
        LEFT JOIN employees e ON e.user_id = u.user_id
        LEFT JOIN companies co ON co.company_id = e.company_id

        WHERE c.institute_id = %s
        '''
        cursor.execute(students_query, (institute_id,))
        institute_students = cursor.fetchall()

        dispute_query = '''
        SELECT
            *
        FROM disputes
        WHERE raised_by_type='institute' AND raised_by_id= %s
            OR raised_against_type='institute' AND raised_against_id= %s
        ORDER BY created_on DESC;
        '''
        cursor.execute(dispute_query, (institute_id, institute_id))
        dispute_history = cursor.fetchall()

        result = {
            "institute_info": institute_info,
            "institute_students": institute_students,
            "dispute_history" : dispute_history
        }
        
        return {"success": True, "data": result}

    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    
    finally:
        cursor.close()
        conn.close()
