import streamlit as st
from utils import verify_user, hash_password
from db import get_connection

st.set_page_config(page_title="Research Connect", page_icon="🧠", layout="wide")

st.markdown(
    "<h1 style='text-align:center;color:#2E86C1;'>🎓 Undergraduate Research & Faculty Connect Platform</h1>",
    unsafe_allow_html=True
)

tab1, tab2 = st.tabs(["🔑 Login", "📝 Sign Up"])

# ---------- LOGIN ----------
with tab1:
    role = st.selectbox("Select Role", ["Student", "Faculty", "Admin"], key="login_role")
    email = st.text_input("Email", placeholder="you@university.edu", key="login_email")
    password = st.text_input("Password", type="password", key="login_password")

    if st.button("Login", use_container_width=True, key="login_button"):
        user = verify_user(email, password, role)
        if user:
            st.success(f"✅ Welcome {user['first_name']} {user['last_name']}!")
            st.session_state['user'] = user
            st.session_state['role'] = role.lower()
            st.switch_page(f"pages/{role.title()}_Dashboard.py")
        else:
            st.error("❌ Invalid credentials or unverified account")

# ---------- SIGN UP ----------
with tab2:
    role = st.selectbox("Sign Up As", ["Student", "Faculty"], key="signup_role")
    first = st.text_input("First Name", key="signup_first")
    last = st.text_input("Last Name", key="signup_last")
    email = st.text_input("Email (must be unique)", key="signup_email")
    password = st.text_input("Password", type="password", key="signup_password")

    if st.button("Create Account", use_container_width=True, key="signup_button"):
        if not email or not password:
            st.warning("⚠️ Please fill all fields.")
        else:
            conn = get_connection()
            cursor = conn.cursor()
            table = "Students" if role == "Student" else "Faculty"
            hashed = hash_password(password)
            query = f"INSERT INTO {table} (first_name, last_name, email, password) VALUES (%s,%s,%s,%s)"
            cursor.execute(query, (first, last, email, hashed))
            conn.commit()
            conn.close()
            st.success(f"✅ {role} account created successfully! You can now log in.")
