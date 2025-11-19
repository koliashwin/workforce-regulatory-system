from config.db import get_db_connection

# raise the dispute
def raise_dispute(raised_by_type: str, raised_by_id: int, raised_against_type: str, raised_against_id: int, topic: str):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute(
            "INSERT INTO disputes (raised_by_type, raised_by_id, raised_against_type, raised_against_id, topic) VALUES (%s, %s, %s, %s, %s)",
            (raised_by_type, raised_by_id, raised_against_type, raised_against_id, topic)
        )
        dispute_id = cursor.lastrowid
        conn.commit()
        return {"success": True, 'dispute_id': dispute_id, 'message': f"Dispute raised by {raised_by_type}({raised_by_id}) against {raised_against_type}({raised_against_id})"}

    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    
    finally:
        cursor.close()
        conn.close()

# update dispute status (not in use at least for now)
# def update_dispute(dispute_id: int, status: str, updated_by_type: str, updated_by_id: int):
#     conn = get_db_connection()
#     cursor = conn.cursor(dictionary=True)

#     try:
#         cursor.execute(
#             "UPDATE disputes SET status = %s WHERE dispute_id = %s", (status, dispute_id)
#         )
#         conn.commit()
#         return {"success": True, "message": f"Dispute Updated by {updated_by_type}({updated_by_id})"}
        
#     except Exception as e:
#         conn.rollback()
#         return {"success": False, "error": str(e)}
    
#     finally:
#         cursor.close()
#         conn.close()

# get all disputes information
def view_all_disputes():
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "SELECT * FROM disputes"
        )
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