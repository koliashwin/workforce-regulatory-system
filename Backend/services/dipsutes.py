from config.db import get_db_connection
from services.audit import log_action


def check_duplicate_dispute(
    raised_by_id: int,
    raised_against_id: int,
    topic: str
) -> bool:
    """Returns True if an identical pending dispute already exists."""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            """SELECT dispute_id FROM disputes
               WHERE raised_by_id = %s
                 AND raised_against_id = %s
                 AND topic = %s
                 AND status = 'pending'""",
            (raised_by_id, raised_against_id, topic)
        )
        return cursor.fetchone() is not None
    except Exception:
        return False
    finally:
        cursor.close()
        conn.close()


def raise_dispute(
    raised_by_type: str,
    raised_by_id: int,
    raised_against_type: str,
    raised_against_id: int,
    topic: str,
    description: str = None   # ← now accepts description
):
    """
    Auto-raise a dispute. Skips silently if identical pending dispute exists.
    """
    # Duplicate guard
    if check_duplicate_dispute(raised_by_id, raised_against_id, topic):
        return {"success": False, "error": "Duplicate dispute, already pending"}

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute(
            """INSERT INTO disputes
               (raised_by_type, raised_by_id, raised_against_type,
                raised_against_id, topic, description)
               VALUES (%s, %s, %s, %s, %s, %s)""",
            (raised_by_type, raised_by_id, raised_against_type,
             raised_against_id, topic, description)
        )
        dispute_id = cursor.lastrowid
        conn.commit()

        log_action(
            action="DISPUTE_RAISED",
            performed_by="system",
            target_type="disputes",
            target_id=dispute_id,
            description=f"Auto dispute raised: {topic}",
            metadata={
                "raised_by_type":     raised_by_type,
                "raised_by_id":       raised_by_id,
                "raised_against_type": raised_against_type,
                "raised_against_id":  raised_against_id,
                "description":        description
            }
        )

        return {"success": True, "dispute_id": dispute_id}

    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    finally:
        cursor.close()
        conn.close()


def update_dispute(dispute_id: int, status: str, resolution_note: str = None):
    """Admin resolves, rejects, or marks a dispute under review."""
    valid_statuses = ['pending', 'under review', 'resolved', 'rejected']
    if status not in valid_statuses:
        return {"success": False, "error": f"Invalid status. Must be one of: {valid_statuses}"}

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT dispute_id FROM disputes WHERE dispute_id = %s", (dispute_id,)
        )
        if not cursor.fetchone():
            return {"success": False, "error": "Dispute not found"}

        cursor.execute(
            """UPDATE disputes
               SET status = %s, description = COALESCE(%s, description)
               WHERE dispute_id = %s""",
            (status, resolution_note, dispute_id)
        )
        conn.commit()

        log_action(
            action=f"DISPUTE_{status.upper().replace(' ', '_')}",
            performed_by="admin",
            target_type="disputes",
            target_id=dispute_id,
            description=f"Dispute #{dispute_id} updated to '{status}'",
            metadata={"resolution_note": resolution_note}
        )

        return {"success": True, "message": f"Dispute updated to '{status}'"}

    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    finally:
        cursor.close()
        conn.close()


def view_all_disputes():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            """SELECT dispute_id, raised_by_type, raised_by_id,
                      raised_against_type, raised_against_id,
                      topic, description, status, created_on, updated_on
               FROM disputes
               ORDER BY created_on DESC"""
        )
        results = cursor.fetchall()
        return {'success': True, 'data': results or []}
    except Exception as e:
        return {"success": False, "error": str(e)}
    finally:
        cursor.close()
        conn.close()
