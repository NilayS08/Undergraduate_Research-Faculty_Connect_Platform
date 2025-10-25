import streamlit as st
from db import get_connection

st.title("🎓 Faculty Dashboard")

faculty = st.session_state.get("user")
if not faculty:
    st.error("Please login first.")
    st.stop()

conn = get_connection()
cursor = conn.cursor(dictionary=True)

st.markdown("## 📚 Your Projects")
cursor.execute("SELECT * FROM Research_Projects WHERE faculty_id=%s", (faculty["faculty_id"],))
projects = cursor.fetchall()

for p in projects:
    with st.expander(f"{p['title']} — {p['status']}"):
        st.write(p["description"])
        new_status = st.selectbox("Update status", ["Recruiting", "In Progress", "Completed", "Cancelled"], index=["Recruiting", "In Progress", "Completed", "Cancelled"].index(p["status"]), key=p["project_id"])
        if st.button("Save", key=f"save_{p['project_id']}"):
            cursor2 = conn.cursor()
            cursor2.execute("UPDATE Research_Projects SET status=%s WHERE project_id=%s", (new_status, p["project_id"]))
            conn.commit()
            st.success("✅ Status updated!")
            st.experimental_rerun()

st.divider()

st.markdown("## ➕ Add New Project")
title = st.text_input("Project Title")
desc = st.text_area("Description")
max_stu = st.number_input("Max Students", 1, 10)
if st.button("Create Project"):
    cursor.execute(
        "INSERT INTO Research_Projects (title, description, faculty_id, max_students) VALUES (%s,%s,%s,%s)",
        (title, desc, faculty["faculty_id"], max_stu)
    )
    conn.commit()
    st.success("✅ Project created successfully!")
    st.experimental_rerun()
