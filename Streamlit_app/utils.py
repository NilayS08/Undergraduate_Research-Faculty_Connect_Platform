import mysql.connector
from mysql.connector import Error
import bcrypt  # Import bcrypt for secure password hashing and verification

def hash_password(password):
    # Hash the password using bcrypt
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode(), salt).decode()

def verify_password(input_password, stored_password):
    # Verify the input password against the stored hashed password
    return bcrypt.checkpw(input_password.encode(), stored_password.encode())

def get_user_by_email(email: str, role: str):
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="thisbelongstome",
        database="researchhub"
    )
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
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="thisbelongstome",
            database="researchhub"
        )
        if conn.is_connected():
            cursor = conn.cursor(dictionary=True)
            table = "Students" if role == "Student" else "Faculty" if role == "Faculty" else "Admins"

            # ✅ Query to fetch user by email
            query = f"SELECT * FROM {table} WHERE email=%s"
            cursor.execute(query, (email,))
            user = cursor.fetchone()

            if user:
                # ✅ Verify the input password with the stored hashed password
                if verify_password(password, user["password"]):
                    return user
                else:
                    print("❌ Password mismatch.")
            else:
                print("❌ User not found.")
            return None
    except Error as e:
        print(f"❌ Error verifying user: {e}")
        return None
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()