import streamlit as st
import mysql.connector
from db import get_connection

st.set_page_config(page_title="Research Connect", layout="wide")

# Check if user is logged in
if "user" not in st.session_state or st.session_state["user"] is None:
    st.error("⚠️ Please log in first.")
    st.stop()

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

# Get faculty_id from session state
faculty_id = st.session_state.get("user_id")

if not faculty_id:
    st.warning("⚠️ Please log in again — no faculty session found.")
    st.stop()

st.title("👩‍🏫 Faculty Dashboard")

# Show faculty's own projects
cursor.execute("SELECT * FROM Research_Projects WHERE faculty_id = %s", (faculty_id,))
projects = cursor.fetchall()

st.subheader("📋 Your Projects")

if not projects:
    st.info("You haven't created any projects yet.")
else:
    cols = st.columns(2)  # Two cards per row

    for i, proj in enumerate(projects):
        with cols[i % 2]:
            st.markdown(f"""
                <div class="card">
                    <h3>{proj['title']}</h3>
                    <small>Status: <b>{proj['status']}</b></small>
                    <p style="margin-top:10px;">{proj['description'][:150]}...</p>
                </div>
            """, unsafe_allow_html=True)

            new_status = st.selectbox(
                "Change status",
                ["Recruiting", "In Progress", "Completed"],
                index=["Recruiting", "In Progress", "Completed"].index(proj['status']),
                key=f"status_{proj['project_id']}"
            )

            if st.button("💾 Update", key=f"update_{proj['project_id']}"):
                cursor.execute("UPDATE Research_Projects SET status=%s WHERE project_id=%s", (new_status, proj['project_id']))
                conn.commit()
                st.success("✅ Status updated successfully!")
                st.rerun()

            # --- Applicants section in card ---
            st.markdown("<b>Applicants:</b>", unsafe_allow_html=True)
            cursor.execute("""
                SELECT a.application_id, a.status, s.first_name, s.last_name, s.major
                FROM Applications a
                JOIN Students s ON a.student_id = s.student_id
                WHERE a.project_id = %s
            """, (proj['project_id'],))
            applicants = cursor.fetchall()

            if not applicants:
                st.caption("No applicants yet.")
            else:
                for app in applicants:
                    st.markdown(f"• {app['first_name']} {app['last_name']} — {app['major']} ({app['status']})")
                    col1, col2 = st.columns(2)
                    with col1:
                        if st.button("✅ Approve", key=f"approve_{app['application_id']}"):
                            cursor.execute("CALL accept_application(%s)", (app['application_id'],))
                            conn.commit()
                            st.success("Approved!")
                            st.rerun()
                    with col2:
                        if st.button("❌ Reject", key=f"reject_{app['application_id']}"):
                            cursor.execute("UPDATE Applications SET status='Rejected' WHERE application_id=%s", (app['application_id'],))
                            conn.commit()
                            st.warning("Rejected.")
                            st.rerun()

conn.close()