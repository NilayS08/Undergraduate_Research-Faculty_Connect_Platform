import streamlit as st
import mysql.connector
from db import get_connection

st.set_page_config(page_title="Research Connect", layout="wide")

# Check if user is logged in FIRST
if "user" not in st.session_state or st.session_state["user"] is None:
    st.error("⚠️ Please log in first.")
    st.stop()

# Add background + card style
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

st.markdown("<h1 style='text-align:center; color:#1e3a8a;'>🎓 Student Dashboard</h1>", unsafe_allow_html=True)

try:
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
except Exception as e:
    st.error(f"Database connection failed: {e}")
    st.stop()

# Get student_id from session state
student_id = st.session_state.get("user_id")

if not student_id:
    st.warning("⚠️ Please log in again — no user session found.")
    st.stop() 

# --- PROFILE CARD ---
cursor.execute("SELECT * FROM Students WHERE student_id=%s", (student_id,))
student = cursor.fetchone() or {}

st.markdown("<div class='card'><h3>🧾 My Profile</h3>", unsafe_allow_html=True)
col1, col2 = st.columns(2)
with col1:
    major = st.text_input("Major", value=student.get("major", ""))
    year = st.number_input("Year Level", 1, 4, value=student.get("year_level", 1))
with col2:
    gpa = st.number_input("GPA", 0.0, 4.0, value=float(student.get("gpa", 0.0)), step=0.1)
    interests = st.text_area("Research Interests", value=student.get("research_interests", ""))

if st.button("💾 Update Profile"):
    cursor.execute(
        "UPDATE Students SET major=%s, year_level=%s, gpa=%s, research_interests=%s WHERE student_id=%s",
        (major, year, gpa, interests, student_id)
    )
    conn.commit()
    st.success("Profile updated!")
    st.rerun()
st.markdown("</div>", unsafe_allow_html=True)

# --- SKILLS CARD ---
st.markdown("<div class='card'><h3>🧠 My Skills</h3>", unsafe_allow_html=True)
cursor.execute("SELECT * FROM Skills")
skills = cursor.fetchall()
skill_map = {s["skill_name"]: s["skill_id"] for s in skills}

cursor.execute("""
    SELECT sk.skill_name FROM Student_Skills ss
    JOIN Skills sk ON ss.skill_id = sk.skill_id
    WHERE ss.student_id = %s
""", (student_id,))
existing = [s["skill_name"] for s in cursor.fetchall()]

selected = st.multiselect("Select Skills", list(skill_map.keys()), default=existing)

if st.button("Update Skills"):
    cursor.execute("DELETE FROM Student_Skills WHERE student_id=%s", (student_id,))
    for skill in selected:
        cursor.execute("INSERT INTO Student_Skills (student_id, skill_id) VALUES (%s, %s)", (student_id, skill_map[skill]))
    conn.commit()
    st.success("Skills updated!")
    st.rerun()
st.markdown("</div>", unsafe_allow_html=True)

# --- MY APPLICATIONS ---
st.markdown("<div class='card'><h3>📝 My Applications</h3>", unsafe_allow_html=True)
cursor.execute("""
    SELECT a.application_id, a.status, a.applied_at, p.title, p.project_id,
           f.first_name, f.last_name
    FROM Applications a
    JOIN Research_Projects p ON a.project_id = p.project_id
    JOIN Faculty f ON p.faculty_id = f.faculty_id
    WHERE a.student_id = %s
    ORDER BY a.applied_at DESC
""", (student_id,))
applications = cursor.fetchall()

if not applications:
    st.info("You haven't applied to any projects yet.")
else:
    for app in applications:
        status_color = {
            'Pending': '🟡',
            'Accepted': '✅',
            'Rejected': '❌',
            'Withdrawn': '⚪'
        }.get(app['status'], '⚪')
        
        st.markdown(f"""
        **{app['title']}** {status_color} *{app['status']}*  
        Faculty: {app['first_name']} {app['last_name']}  
        Applied: {app['applied_at'].strftime('%Y-%m-%d')}
        """)
        
        if app['status'] == 'Pending':
            if st.button("🗑️ Withdraw", key=f"withdraw_{app['application_id']}"):
                cursor.execute("UPDATE Applications SET status='Withdrawn' WHERE application_id=%s", (app['application_id'],))
                conn.commit()
                st.success("Application withdrawn.")
                st.rerun()
        st.divider()

st.markdown("</div>", unsafe_allow_html=True)

# --- AVAILABLE PROJECTS (CARD GRID) ---
st.markdown("<h2 style='margin-top:30px;'>📚 Available Projects</h2>", unsafe_allow_html=True)
cursor.execute("""
    SELECT p.*, f.first_name, f.last_name, f.department
    FROM Research_Projects p
    JOIN Faculty f ON p.faculty_id = f.faculty_id
    WHERE p.status='Recruiting'
""")
projects = cursor.fetchall()

if not projects:
    st.info("No projects currently recruiting.")
else:
    cols = st.columns(2)
    for i, proj in enumerate(projects):
        with cols[i % 2]:
            st.markdown(f"""
                <div class='card'>
                    <h3>{proj['title']}</h3>
                    <small>Faculty: <b>{proj['first_name']} {proj['last_name']}</b> — {proj['department']}</small>
                    <p style='margin-top:10px;'>{proj['description'][:160]}...</p>
                </div>
            """, unsafe_allow_html=True)
            
            # Check if already applied
            cursor.execute("""
                SELECT application_id FROM Applications 
                WHERE student_id=%s AND project_id=%s
            """, (student_id, proj["project_id"]))
            already_applied = cursor.fetchone()
            
            if already_applied:
                st.info("✓ Already applied")
            else:
                if st.button("📩 Apply", key=f"apply_{proj['project_id']}"):
                    try:
                        cursor.execute("""
                            INSERT INTO Applications (student_id, project_id, status)
                            VALUES (%s, %s, 'Pending')
                        """, (student_id, proj["project_id"]))
                        conn.commit()
                        st.success("Application submitted!")
                        st.rerun()
                    except mysql.connector.IntegrityError:
                        st.warning("You've already applied to this project.")

conn.close()