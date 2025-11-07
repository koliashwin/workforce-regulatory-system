from config.db import get_db_connection

def register_company(data):

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute(
            "INSERT INTO companies (name, address, contact_no, email) VALUES(%s, %s, %s, %s)",
            (data.name, data.address, data.contact_no, data.email)
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
        query = """SELECT * FROM companies"""

        cursor.execute(query)
        results = cursor.fetchall()
        
        if not results:
            return {'success': True, 'data':[]}
        return {'success': True, 'data':results}
    
    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    
    finally:
        cursor.close()
        conn.close()