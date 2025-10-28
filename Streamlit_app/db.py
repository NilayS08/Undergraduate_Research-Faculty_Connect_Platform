import mysql.connector
from mysql.connector import Error

def get_connection():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="thisbelongstome",
            database="researchhub"
        )
        if conn.is_connected():
            print("✅ MySQL connection successful!")
            return conn
    except Error as e:
        print("❌ Database connection failed:", e)
        return None
    