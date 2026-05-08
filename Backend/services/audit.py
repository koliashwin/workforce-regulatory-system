from config.db import get_db_connection
import json

def log_action(
        action : str,
        performed_by: str = None,
        performed_by_id: int = None,
        target_type: str = None,
        target_id: int = None,
        description: str = None,
        metadata: dict = None
):
    # call this func anywher in service to record the event

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO audit_logs
            (action, performed_by, performed_by_id, target_type, target_id, description, metadata)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (
                action, performed_by, performed_by_id, target_type, target_id,
                description, json.dumps(metadata) if metadata else None
            )
        )
        conn.commit()
    except Exception as e:
        print(f"[AUDIT LOG FAILED] {e}")
    finally:
        cursor.close()
        conn.close()