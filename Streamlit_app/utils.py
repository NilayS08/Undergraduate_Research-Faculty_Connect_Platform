import bcrypt
from db import get_connection

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def check_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

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
    user = get_user_by_email(email, role)
    if user and "password" in user and check_password(password, user["password"]):
        return user
    elif user and "password" not in user:  # admin without password
        return user
    return None
