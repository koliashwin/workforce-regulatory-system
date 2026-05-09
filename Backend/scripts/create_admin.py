import sys
import os

# Make sure imports resolve from Backend/ folder
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from config.db import get_db_connection
from utils.password import hash_password

def create_admin(name: str, email: str, password: str):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # Check if email already exists
        cursor.execute("SELECT user_id FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            print(f"[ERROR] User with email '{email}' already exists.")
            return

        hashed = hash_password(password)

        cursor.execute(
            "INSERT INTO users (role_code, email, password_hash, name, contact_no, dob) VALUES (%s, %s, %s, %s, %s, %s)",
            (400, email, hashed, name, "0000000000", "1990-01-01")
        )
        user_id = cursor.lastrowid
        conn.commit()

        print(f"[SUCCESS] Admin created.")
        print(f"  User ID  : {user_id}")
        print(f"  Name     : {name}")
        print(f"  Email    : {email}")
        print(f"  Role code: 400")

    except Exception as e:
        conn.rollback()
        print(f"[ERROR] {e}")
    finally:
        cursor.close()
        conn.close()


if __name__ == "__main__":
    print("=== Create Superadmin ===")
    name     = input("Name     : ").strip()
    email    = input("Email    : ").strip()
    password = input("Password : ").strip()

    if not name or not email or not password:
        print("[ERROR] All fields are required.")
        sys.exit(1)

    if len(password) < 8:
        print("[ERROR] Password must be at least 8 characters.")
        sys.exit(1)

    create_admin(name, email, password)