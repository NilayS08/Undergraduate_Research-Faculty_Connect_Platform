import streamlit as st
import mysql.connector
from db import get_connection

st.set_page_config(page_title="Research Connect", layout="wide")

# Check if user is logged in
if "user" not in st.session_state or st.session_state["user"] is None:
    st.error("⚠️ Please log in first.")
    st.stop()

# Check if user is faculty
if st.session_state.get("role") != "faculty":
    st.error("⚠️ Access denied. Faculty privileges required.")
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
    background: #000000;
}
.card {
    background-color: #1a1a1a;
    border-radius: 15px;
    box-shadow: 0 3px 8px rgba(255,255,255,0.08);
    padding: 22px;
    margin: 12px 0;
    transition: all 0.3s ease-in-out;
    border-left: 6px solid #2563eb;
}
.card:hover { box-shadow: 0 6px 16px rgba(255,255,255,0.12); transform: translateY(-4px); }
.card h3 { color: #60a5fa; font-weight: 700; font-size: 20px; margin-bottom: 4px; }
.card small { color: #9ca3af; font-size: 13px; }
.card p { color: #d1d5db; }
.stButton>button { background-color:#2563eb; color:white; border-radius:8px; padding:8px 20px; border:none; font-weight:500; margin-top:8px; }
.stButton>button:hover { background-color:#1d4ed8; transform: scale(1.02); }
h1, h2, h3 { color: #60a5fa !important; }
p, label { color: #d1d5db !important; }
</style>
""", unsafe_allow_html=True)

# Get faculty_id from session state
faculty_id = st.session_state.get("user_id")

if not faculty_id:
    st.warning("⚠️ Please log in again — no faculty session found.")
    st.stop()

st.title("👩‍🏫 Faculty Dashboard")

# --- PROFILE CARD ---
cursor.execute("SELECT * FROM Faculty WHERE faculty_id=%s", (faculty_id,))
faculty = cursor.fetchone()

if not faculty:
    st.error("Faculty profile not found.")
    st.stop()

st.markdown("<div class='card'><h3>👤 My Profile</h3>", unsafe_allow_html=True)
col1, col2 = st.columns(2)
with col1:
    department = st.text_input("Department", value=faculty.get("department") or "")
with col2:
    research_areas = st.text_area("Research Interests", value=faculty.get("research_areas") or "")

if st.button("💾 Update Profile"):
    cursor.execute(
        "UPDATE Faculty SET department=%s, research_areas=%s WHERE faculty_id=%s",
        (department, research_areas, faculty_id)
    )
    conn.commit()
    st.success("Profile updated!")
    st.rerun()
st.markdown("</div>", unsafe_allow_html=True)

# --- CREATE NEW PROJECT CARD ---
st.markdown("<div class='card'><h3>➕ Create New Project</h3>", unsafe_allow_html=True)

with st.form("create_project_form", clear_on_submit=True):
    proj_title = st.text_input("Project Title", placeholder="e.g., AI-Powered Medical Diagnosis")
    proj_description = st.text_area("Project Description", placeholder="Describe the research goals, methodology, and expected outcomes...")
    proj_max_students = st.number_input("Maximum Students", min_value=1, max_value=20, value=3)
    
    submit_project = st.form_submit_button("🚀 Create Project")
    
    if submit_project:
        if not proj_title or not proj_description:
            st.warning("⚠️ Please fill in both title and description.")
        else:
            try:
                cursor.execute("""
                    INSERT INTO Research_Projects (title, description, status, max_students, faculty_id, admin_id)
                    VALUES (%s, %s, 'Recruiting', %s, %s, NULL)
                """, (proj_title, proj_description, proj_max_students, faculty_id))
                conn.commit()
                st.success(f"✅ Project '{proj_title}' created successfully!")
                st.rerun()
            except Exception as e:
                st.error(f"❌ Error creating project: {e}")

st.markdown("</div>", unsafe_allow_html=True)

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

# --- LOGOUT BUTTON ---
st.divider()
if st.button("🚪 Logout", type="secondary"):
    st.session_state.clear()
    st.success("Logged out successfully!")
    st.switch_page("app.py")

conn.close()