import mysql.connector
import streamlit as st

def get_connection():
    try:
        return mysql.connector.connect(
            host="localhost",
            user="root",
            password="thisbelongstome",  # change this
            database="researchhub"
        )
    except mysql.connector.Error as e:
        st.error(f"Database connection failed: {e}")
        return None
