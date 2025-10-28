import streamlit as st
import mysql.connector
from db import get_connection

st.set_page_config(page_title="Research Connect", layout="wide")

try:
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
except Exception as e:
    st.error(f"Database connection failed: {e}")
    st.stop()

# Add background + card style once
st.markdown("""
<style>
.stApp {
    background: linear-gradient(135deg, #f0f4f8, #e9eef5);
}
.card {
    background-color: #ffffff;
    border-radius: 15px;
    box-shadow: 0 3px 8px rgba(0,0,0,0.08);
    padding: 22px;
    margin: 12px 0;
    transition: all 0.3s ease-in-out;
    border-left: 6px solid #2563eb;
}
.card:hover { box-shadow: 0 6px 16px rgba(0,0,0,0.12); transform: translateY(-4px); }
.card h3 { color: #1e3a8a; font-weight: 700; font-size: 20px; margin-bottom: 4px; }
.card small { color: #6b7280; font-size: 13px; }
.stButton>button { background-color:#2563eb; color:white; border-radius:8px; padding:8px 20px; border:none; font-weight:500; margin-top:8px; }
.stButton>button:hover { background-color:#1d4ed8; transform: scale(1.02); }
</style>
""", unsafe_allow_html=True)


st.title("🛠️ Admin Dashboard")

conn = get_connection()
cursor = conn.cursor(dictionary=True)

st.markdown("### 👩‍🏫 Manage Faculty")
cursor.execute("SELECT * FROM Faculty")
for f in cursor.fetchall():
    with st.expander(f"{f['first_name']} {f['last_name']} — {f['department']}"):
        st.write(f"**Email:** {f['email']}")
        if st.button("❌ Delete", key=f"del_fac_{f['faculty_id']}"):
            cursor2 = conn.cursor()
            cursor2.execute("DELETE FROM Faculty WHERE faculty_id=%s", (f["faculty_id"],))
            conn.commit()
            st.success("Faculty deleted.")
            st.rerun()

st.divider()

st.markdown("### 🎓 Manage Students")
cursor.execute("SELECT * FROM Students")
for s in cursor.fetchall():
    with st.expander(f"{s['first_name']} {s['last_name']} — {s['major']}"):
        st.write(f"**Email:** {s['email']}")
        if st.button("❌ Delete", key=f"del_stu_{s['student_id']}"):
            cursor2 = conn.cursor()
            cursor2.execute("DELETE FROM Students WHERE student_id=%s", (s["student_id"],))
            conn.commit()
            st.success("Student deleted.")
            st.rerun()

st.divider()

st.markdown("### 📚 All Projects")
cursor.execute("SELECT * FROM Research_Projects")
for p in cursor.fetchall():
    st.markdown(f"**{p['title']}** — {p['status']}")
