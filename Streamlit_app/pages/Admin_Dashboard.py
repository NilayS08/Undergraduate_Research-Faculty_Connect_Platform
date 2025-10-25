import streamlit as st
from db import get_connection

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
            st.experimental_rerun()

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
            st.experimental_rerun()

st.divider()

st.markdown("### 📚 All Projects")
cursor.execute("SELECT * FROM Research_Projects")
for p in cursor.fetchall():
    st.markdown(f"**{p['title']}** — {p['status']}")
