import bcrypt
import pymysql
from db import get_connection


def hash_password(password: str) -> str:
    """Return a bcrypt hash of the password."""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def get_user_by_email(email: str, role: str):
    conn = get_connection()
    if not conn:
        return None
    cursor = conn.cursor(dictionary=True)
    table = {"student": "Students", "faculty": "Faculty", "admin": "Admin"}.get(role.lower())
    cursor.execute(f"SELECT * FROM {table} WHERE email=%s", (email,))
    user = cursor.fetchone()
    conn.close()
    return user

def verify_user(email: str, password: str, role: str):
    """Verify user login by comparing bcrypt hashes."""
    conn = get_connection()

    # ✅ Use DictCursor so results come as dictionaries
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    table = {
        "student": "Students",
        "faculty": "Faculty",
        "admin": "Admin"
    }.get(role.lower())

    if not table:
        conn.close()
        return None

    # ✅ Fetch user details
    cursor.execute(f"SELECT * FROM {table} WHERE email=%s", (email,))
    user = cursor.fetchone()
    conn.close()

    if not user:
        return None

    # ✅ Compare bcrypt hashes safely
    try:
        if bcrypt.checkpw(password.encode('utf-8'), user["password"].encode('utf-8')):
            return user
        else:
            return None
    except Exception as e:
        print("Password check failed:", e)
        return None