import streamlit as st
from db import get_connection

st.title("🎓 Student Dashboard")

student = st.session_state.get("user")
if not student:
    st.error("Please login first.")
    st.stop()

conn = get_connection()
cursor = conn.cursor(dictionary=True)

st.markdown("## 🔍 Available Projects")
cursor.execute("SELECT * FROM Research_Projects WHERE status='Recruiting'")
for p in cursor.fetchall():
    with st.expander(f"{p['title']} — {p['status']}"):
        st.write(p["description"])
        if st.button(f"Apply to {p['title']}", key=f"apply_{p['project_id']}"):
            cursor2 = conn.cursor()
            cursor2.execute(
                "INSERT IGNORE INTO Applications (student_id, project_id, status) VALUES (%s,%s,'Pending')",
                (student["student_id"], p["project_id"])
            )
            conn.commit()
            st.success("✅ Application sent!")
            st.experimental_rerun()

st.divider()
st.markdown("## 📨 Your Applications")
cursor.execute("""
SELECT a.application_id, a.status, r.title
FROM Applications a
JOIN Research_Projects r ON a.project_id=r.project_id
WHERE a.student_id=%s
""", (student["student_id"],))
for a in cursor.fetchall():
    st.markdown(f"**{a['title']}** — {a['status']}")
