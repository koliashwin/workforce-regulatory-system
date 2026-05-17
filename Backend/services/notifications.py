from config.db import get_db_connection


def notify(user_id: int, type: str, title: str, message: str):
    """
    Insert one notification for a user.
    Fails silently — never crashes the calling service.
    Call this anywhere in your services after a key event.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """INSERT INTO notifications (user_id, type, title, message)
               VALUES (%s, %s, %s, %s)""",
            (user_id, type, title, message)
        )
        conn.commit()
    except Exception as e:
        print(f"[NOTIFY FAILED] user={user_id} type={type} err={e}")
    finally:
        cursor.close()
        conn.close()


def get_notifications(user_id: int, limit: int = 20):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            """SELECT notification_id, type, title, message, is_read, created_on
               FROM notifications
               WHERE user_id = %s
               ORDER BY created_on DESC
               LIMIT %s""",
            (user_id, limit)
        )
        rows = cursor.fetchall()
        # Convert datetime to string for JSON
        for r in rows:
            if r.get('created_on'):
                r['created_on'] = r['created_on'].strftime('%Y-%m-%d %H:%M:%S')
        return {"success": True, "data": rows}
    except Exception as e:
        return {"success": False, "error": str(e)}
    finally:
        cursor.close()
        conn.close()


def get_unread_count(user_id: int):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            "SELECT COUNT(*) AS count FROM notifications WHERE user_id = %s AND is_read = FALSE",
            (user_id,)
        )
        result = cursor.fetchone()
        return {"success": True, "count": result["count"]}
    except Exception as e:
        return {"success": False, "count": 0, "error": str(e)}
    finally:
        cursor.close()
        conn.close()


def mark_all_read(user_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE notifications SET is_read = TRUE WHERE user_id = %s AND is_read = FALSE",
            (user_id,)
        )
        conn.commit()
        return {"success": True}
    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    finally:
        cursor.close()
        conn.close()


def mark_one_read(notification_id: int, user_id: int):
    """user_id check prevents users marking someone else's notifications."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE notifications SET is_read = TRUE WHERE notification_id = %s AND user_id = %s",
            (notification_id, user_id)
        )
        conn.commit()
        return {"success": True}
    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    finally:
        cursor.close()
        conn.close()
