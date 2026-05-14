from datetime import date
from config.db import get_db_connection
from services.audit import log_action
from utils.password import hash_password
import json
import os

def register_company(data):

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # ── 1. Verify CIN before creating anything ────────────────
        file_path = os.path.join(os.path.dirname(__file__), "../dummy DB/MCA companies.json")
        with open(file_path, "r") as f:
            mca_data = json.load(f)

        verification_status = "Unknown"
        for company in mca_data:
            if (company['CIN'].strip().upper() == data.cin.strip().upper()
                    and company["Status"].lower() == "active"):
                verification_status = "Registered"

        # create a user for company
        cursor.execute(
            "INSERT INTO users (role_code, email, password_hash, name, contact_no, dob) VALUES (300, %s, %s, %s, %s, %s)",
            (data.email, hash_password("Abced@12345"), data.user_name, data.contact_no, date.today())
        )
        user_id = cursor.lastrowid

        # store company details int DB
        cursor.execute(
            "INSERT INTO companies (name, cin, user_id, address, contact_no, email, verification_status) VALUES(%s, %s, %s, %s, %s, %s, %s)",
            (data.name, data.cin, user_id, data.address, data.contact_no, data.email, verification_status)
        )
        company_id = cursor.lastrowid
        conn.commit()

        # audit log for company registrations
        log_action(
            action="COMPANY_REGISTRED",
            performed_by="system",
            target_type="companies",
            target_id=company_id,
            description=f"Company Registred on Platform",
            metadata={"cin": data.cin, "verification_status": verification_status}
        )

        return {"success": True, "company_id": cursor.lastrowid, "verification_status": verification_status}
    
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
                # audit log for verified company
                log_action(
                    action="COMPANY_VERIFIED",
                    performed_by="system",
                    target_type="companies",
                    target_id=cin,
                    description=f"Company verified via CIN lookup",
                    metadata={"cin": cin, "result": "registered"}
                )
                return {"success": True, "verified": True, "details": company}
        
        # can have the another update query her but since default status is Unknown it not required for now
        # query goes here if required

        # audit log for verified company
        log_action(
            action="UNKNOWN_COMPANY",
            performed_by="system",
            target_type="companies",
            target_id=cin,
            description=f"Company verification failed via CIN lookup",
            metadata={"cin": cin, "result": "unknown"}
        )
        return {"success": True, "verified": False, "details": None}

    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    
    finally:
        cursor.close()
        conn.close()

def all_employee_list(id: int):

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
            and c.company_id = %s
        '''
        cursor.execute(query, (id,))
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

def view_company_profile(company_id: int):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        company_query = '''
        SELECT * FROM companies 
        WHERE company_id = %s
        '''
        cursor.execute(company_query, (company_id,))
        company_info = cursor.fetchone()

        if not company_info:
            return {"success": False, "error": "Company not found"}

        employee_query = '''
        SELECT 
            u.user_id, e.emp_id, eh.history_id,
            u.name as employee_name, u.email as employee_email,
            u.contact_no as employee_contact, e.designation, eh.joining_date,
            eh.exit_date, eh.status as employee_status
        FROM employees e, employee_history eh, users u
        WHERE e.emp_id = eh.emp_id and e.company_id = eh.company_id 
            and e.user_id = u.user_id and e.company_id = %s
        '''
        cursor.execute(employee_query, (company_id,))
        company_employees = cursor.fetchall()

        dispute_query = '''
        SELECT
            *
        FROM disputes
        WHERE raised_by_type='company' AND raised_by_id= %s
            OR raised_against_type='company' AND raised_against_id= %s
        ORDER BY created_on DESC;
        '''
        cursor.execute(dispute_query, (company_id, company_id))
        dispute_history = cursor.fetchall()

        result = {
            "company_info": company_info,
            "company_employees": company_employees,
            "dispute_history" : dispute_history
        }

        return {"success": True, "data": result}

    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    
    finally:
        cursor.close()
        conn.close()