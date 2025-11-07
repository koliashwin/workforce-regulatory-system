from config.db import get_db_connection

# sample template

# ---------------------------------------------------------
# from config.db import get_db_connection

# def func_name(data):
#     conn = get_db_connection()
#     cursor = conn.cursor(dictionary=True)

#     try:
#         pass
#     except Exception as e:
#         conn.rollback()
#         return {"success": False, "error": str(e)}
#     finally:
#         cursor.close()
#         conn.close()

# ---------------------------------------------------

# test function
def create_candidate_clg(candidate):
    # clg will uploade the candidate data in db
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # create new user with specific role and basic details
        cursor.execute(
            "insert into users (role_id, email, name, contact_no, dob) VALUES (%s, %s, %s, %s, %s)",
            (candidate.role_id, candidate.email, candidate.name, candidate.contact_no, candidate.dob)
        )
        conn.commit()
        return {"success": True}
    except Exception as e:
        conn.rollback()
        return {"success": False, 'error': str(e)}
    finally:
        cursor.close()
        conn.close()

# test function
def candidates_list():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT * FROM users WHERE role_id = 100"
        )
        results = cursor.fetchall()

        if not results:
            return {'success': True, 'data': []}
        return {'success': True, 'data': results}
    except Exception as e:
        return {"success": False, 'error': str(e)}
    finally:
        cursor.close()
        conn.close()