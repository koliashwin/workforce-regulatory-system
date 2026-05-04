from config.db import get_db_connection

# public helper functions
def _safe_institute(profile: dict) -> dict:
    """Strip private fields before sending institute data to public."""
    info = profile.get("institute_info", {})
    students = profile.get("institute_students", [])
    disputes = profile.get("dispute_history", [])

    return {
        "institute_info": {
            "institute_id":       info.get("institute_id"),
            "name":               info.get("name"),
            "address":            info.get("address"),
            "verification_status": info.get("verification_status"),
        },
        "students": [
            {
                "student_name":  s.get("student_name"),
                "course":        s.get("course"),
                "passout_year":  s.get("passout_year"),
                "company_name":  s.get("company_name"),       # None = not yet placed
                "designation":   s.get("designation"),
            }
            for s in students
        ],
        "placement_stats": _placement_stats(students),
        "dispute_summary": _dispute_summary(disputes),
    }


def _safe_company(profile: dict) -> dict:
    """Strip private employee details before sending company data to public."""
    info = profile.get("company_info", {})
    employees = profile.get("company_employees", [])
    disputes = profile.get("dispute_history", [])

    return {
        "company_info": {
            "company_id":         info.get("company_id"),
            "name":               info.get("name"),
            "cin":                info.get("cin"),
            "address":            info.get("address"),
            "verification_status": info.get("verification_status"),
        },
        "employee_count":   len(employees),
        "active_employees": sum(1 for e in employees if not e.get("exit_date")),
        "dispute_summary":  _dispute_summary(disputes),
    }


def _placement_stats(students: list) -> dict:
    total   = len(students)
    placed  = sum(1 for s in students if s.get("company_name"))
    courses = {}
    for s in students:
        c = s.get("course") or "Unknown"
        courses[c] = courses.get(c, 0) + 1
    return {
        "total":            total,
        "placed":           placed,
        "placement_rate":   round(placed / total * 100, 1) if total else 0,
        "by_course":        [{"course": k, "count": v} for k, v in courses.items()],
    }


def _dispute_summary(disputes: list) -> dict:
    return {
        "total":        len(disputes),
        "pending":      sum(1 for d in disputes if d.get("status") == "pending"),
        "resolved":     sum(1 for d in disputes if d.get("status") == "resolved"),
        "under_review": sum(1 for d in disputes if d.get("status") == "under review"),
    }


def overall_states():
    """Aggregate numbers for the public landing page hero."""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT COUNT(*) AS cnt FROM companies WHERE verification_status = 'Registered'")
        companies = cursor.fetchone()["cnt"]

        cursor.execute("SELECT COUNT(*) AS cnt FROM institutes")
        institutes = cursor.fetchone()["cnt"]

        cursor.execute("SELECT COUNT(*) AS cnt FROM candidates")
        candidates = cursor.fetchone()["cnt"]

        cursor.execute("SELECT COUNT(*) AS cnt FROM disputes")
        disputes_total = cursor.fetchone()["cnt"]

        cursor.execute("SELECT COUNT(*) AS cnt FROM disputes WHERE status = 'resolved'")
        disputes_resolved = cursor.fetchone()["cnt"]

        cursor.execute("SELECT COUNT(*) AS cnt FROM employee_history WHERE status = 'Joined Safely'")
        safe_joinings = cursor.fetchone()["cnt"]

        results = {
            "verified_companies": companies,
            "institutes":         institutes,
            "candidates":         candidates,
            "disputes_total":     disputes_total,
            "disputes_resolved":  disputes_resolved,
            "safe_joinings":      safe_joinings,
        }

        if not results:
            return {'success': True, 'data': []}
        return {'success': True, 'data': results}
    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    finally:
        cursor.close()
        conn.close()