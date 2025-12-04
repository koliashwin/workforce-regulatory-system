from config.db import get_db_connection

def all_institute_list():

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

def all_company_list():

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # returive the data from DB
        query = """SELECT * FROM companies"""

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

def all_employee_list():

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        query = '''
        SELECT 
            u.name as user_name,
            u.email as user_email,
            u.contact_no as user_contact,
            c.name as company_name,
            c.cin,
            e.designation as emp_designation,
            eh.joining_date,
            eh.exit_date,
            eh.status as employment_status
        FROM employees e, users u, companies c, employee_history eh
        where e.user_id = u.user_id and e.company_id = c.company_id and eh.emp_id = e.emp_id
        '''
        cursor.execute(query)
        results = cursor.fetchall()

        if not results:
            return {'success': True, 'data': []}
        return {'success': True, 'data': results}

    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    
    finally:
        cursor.close()
        conn.close()


def all_candidates_list():
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
        """
        cursor.execute(query)
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
