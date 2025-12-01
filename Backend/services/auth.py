from config.db import get_db_connection

def login_user(data):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # check in user table
        cursor.execute(
            """
            SELECT 
                u.user_id, r.role, u.password_hash 
            FROM users u, roles r 
            WHERE u.role_code = r.role_code
                and email = %s
            """, 
            (data.email,)
        )
        user = cursor.fetchone()

        if not user:
            return {"success": False, "error": "Invalide User Credentials"}

        # password check (this will change when encryption is implemetned)
        if user['password_hash'] != data.password:
            return {"success": False, "error": "Invalide User Credentials"}
        
        user_id = user['user_id']
        role = user['role']
        company_id = None
        institute_id = None
        
        # check the role and store exta data
        if role == "company":
            cursor.execute(
                "SELECT company_id FROM companies WHERE user_id = %s", (user_id,)
            )
            company = cursor.fetchone()
            company_id = company['company_id']
        elif role == "institute":
            cursor.execute(
                "SELECT institute_id FROM institutes WHERE user_id = %s", (user_id,)
            )
            institute = cursor.fetchone()
            institute_id = institute['institute_id']
        
        # create object
        result = {
            "user_id": user_id,
            "role": role,
            "company_id": company_id,
            "institute_id": institute_id
        }

        return {'success': True, 'data': result}

    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    
    finally:
        cursor.close()
        conn.close()