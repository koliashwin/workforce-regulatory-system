from config.db import get_db_connection
import json
import os

def register_company(data):

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # store company details int DB
        cursor.execute(
            "INSERT INTO companies (name, cin, address, contact_no, email) VALUES(%s, %s, %s, %s, %s)",
            (data.name, data.cin, data.address, data.contact_no, data.email)
        )
        conn.commit()

        return {"success": True, "company_id": cursor.lastrowid}
    
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

def verify_company(cin: str):
    # this is a dummy function to test the verification logic with dummy data
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # load dummy data
        file_path = os.path.join(os.path.dirname(__file__), "../dummy DB/MCA companies.json")
        with open(file_path, "r") as f:
            data = json.load(f)

        # search for CIN in dataset
        for company in data:
            if company['CIN'].strip().upper() == cin.strip().upper() and company["Status"].lower() == "active":
                # company is registred and active
                cursor.execute(
                    "UPDATE companies SET verification_status = %s where cin = %s",
                    ('Registered', cin)
                )
                conn.commit()
                return {"success": True, "verified": True, "details": company}
        
        # can have the another update query her but since default status is Unknown it not required for now
        # query goes here if required

        return {"success": True, "verified": False, "details": None}

    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    
    finally:
        cursor.close()
        conn.close()

def onboard_employee(data):

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # fetch company_id
        # for now will need to fetch the company_id via following query 
        # when the front-end is setup will store it in session or localstorage and collect directly form there
        cursor.execute(
            "SELECT company_id FROM companies WHERE cin = %s", (data.company_cin,)
        )
        company_data = cursor.fetchone()

        if not company_data:
            return {"success": False, "error": "Company not found"}

        company_id = company_data['company_id']         # till here its the optional code (will change afte frontend setup)

        # fetch user_id
        # this is also optional code 
        # will have to alter once jobs related modules are implemented
        cursor.execute(
            "SELECT user_id FROM users WHERE email = %s", (data.user_email,)
        )
        user_data = cursor.fetchone()

        if not user_data:
            return {"success": False, "error": "User not found"}

        user_id = user_data['user_id']                  # till here its the optional code (will change afte implementation for jobs module)

        cursor.execute(
            "INSERT INTO employees (company_id, user_id, designation) VALUES (%s, %s, %s)",
            (company_id, user_id, data.designation)
        )
        emp_id = cursor.lastrowid

        cursor.execute(
            "INSERT INTO employee_history (company_id, emp_id, joining_date, status) VALUES (%s, %s, %s, 'Joined Company')",
            (company_id, emp_id, data.joining_date)
        )
        conn.commit()

        return {"success": True, "user_id":user_id, "compnay_id": company_id, "emp_id": emp_id, "emp_history_id": cursor.lastrowid}

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