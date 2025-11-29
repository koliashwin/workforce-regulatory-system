from config.db import get_db_connection

def register_institute(data):

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # store company details int DB
        cursor.execute(
            "INSERT INTO institutes (name, address, contact_no, email) VALUES(%s, %s, %s, %s)",
            (data.name, data.address, data.contact_no, data.email)
        )
        conn.commit()

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
        FROM users u, candidates c, employees e, companies co
        WHERE u.user_id = c.user_id and u.user_id = e.user_id 
            and co.company_id = e.company_id and c.institute_id = %s
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
