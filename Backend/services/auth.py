from config.db import get_db_connection
from utils.jwt import create_token
from utils.password import verify_password

def login_user(data):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        # check in user table
        cursor.execute(
            """
            SELECT 
                u.user_id, r.role, u.password_hash, u.email, u.role_code
            FROM users u, roles r
            WHERE u.role_code = r.role_code
                and u.email = %s
            """, 
            (data.email,)
        )
        user = cursor.fetchone()

        if not user:
            return {"success": False, "error": "Invalide User Credentials"}

        # password check 
        if not verify_password(data.password, user["password_hash"]):
            return {"success": False, "error": "Invalide User Credentials"}
        
        token_data = {
            "user_id":      user["user_id"],
            "role":         user["role"],
            "role_code":    user["role_code"],
            "email":        user["email"]
        }

        user_id = user['user_id']
        # role = user['role']
        # company_id = None
        # institute_id = None
        
        # # check the role and store exta data
        if user["role"] == "company":
            cursor.execute(
                "SELECT company_id FROM companies WHERE user_id = %s", (user_id,)
            )
            company = cursor.fetchone()
            token_data["company_id"] = company['company_id']
        elif user["role"] == "institute":
            cursor.execute(
                "SELECT institute_id FROM institutes WHERE user_id = %s", (user_id,)
            )
            institute = cursor.fetchone()
            token_data["institute_id"] = institute['institute_id']
        
        token = create_token(token_data)

        result = {
            "access_token": token,
            "token_type":   "bearer",
            "token_data":   token_data
        }
        # # create object
        # result = {
        #     "user_id": user_id,
        #     "role": role,
        #     "company_id": company_id,
        #     "institute_id": institute_id
        # }
        return {'success': True, 'data': result}

    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    
    finally:
        cursor.close()
        conn.close()