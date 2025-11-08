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