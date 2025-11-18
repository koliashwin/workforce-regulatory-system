from config.db import get_db_connection
from services.dipsutes import raise_dispute

def clg_onboard_candidate(data):
    '''
    function description goes here
    '''
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("SELECT institute_id FROM institutes WHERE email = %s", (data.institute_email,))
        result = cursor.fetchone()

        if not result:
            return {"success": False, "error": "College not found"}
        
        institute_id = result['institute_id']

        cursor.execute(
            "insert into users (role_id, email, name, contact_no, dob) VALUES (%s, %s, %s, %s, %s)",
            (data.role_id, data.email, data.name, data.contact_no, data.dob)
        )

        user_id = cursor.lastrowid

        cursor.execute(
            "INSERT INTO candidates (institute_id, user_id, course, passout_year, skills) VALUES (%s, %s, %s, %s, %s)",
            (institute_id, user_id, data.course, data.passout_year, data.skills)
        )
        conn.commit()

        return {"success": True, "user_id":user_id, "institute_id": institute_id, "candidate_id": cursor.lastrowid}
    
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
            u.role_id AS role_id,
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


def view_candidate_profile(user_email: str):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary= True)

    try:

        query = '''
        SELECT 
            u.user_id AS user_id,
            u.role_id AS role_id,
            u.name AS user_name,
            u.email AS user_email,
            c.candidate_id AS candidate_id,
            c.course AS course,
            c.passout_year AS passout_year,
            c.skills AS skills,
            i.institute_id AS institute_id,
            i.name AS institute_name,
            i.email AS institute_email,
            co.company_id, co.name as company_name, co.cin,
            eh.joining_date, eh.exit_date, eh.status
        FROM users u, candidates c, institutes i, companies co, employees e, employee_history eh
        WHERE u.user_id = c.user_id and i.institute_id = c.institute_id and e.user_id = u.user_id 
            and co.company_id = e.company_id and e.emp_id = eh.emp_id
            and u.email = %s order by eh.history_id desc limit 1 
        '''

        cursor.execute(query, (user_email,))
        result = cursor.fetchone()
        
        if not result:
            return {"success": False, "error": "Profile not found"}
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


