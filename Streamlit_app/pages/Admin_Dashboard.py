import streamlit as st
import mysql.connector
from db import get_connection

st.set_page_config(page_title="Research Connect", layout="wide")

# Check if user is logged in
if "user" not in st.session_state or st.session_state["user"] is None:
    st.error("⚠️ Please log in first.")
    st.stop()

# Check if user is admin
if st.session_state.get("role") != "admin":
    st.error("⚠️ Access denied. Admin privileges required.")
    st.stop()

try:
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
except Exception as e:
    st.error(f"Database connection failed: {e}")
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
.delete-btn>button { background-color:#dc2626 !important; }
.delete-btn>button:hover { background-color:#b91c1c !important; }
</style>
""", unsafe_allow_html=True)

st.title("🛠️ Admin Dashboard")

# Get admin info
admin_id = st.session_state.get("user_id")
admin_name = f"{st.session_state['user']['first_name']} {st.session_state['user']['last_name']}"

st.markdown(f"### Welcome, {admin_name}!")

# --- STATISTICS OVERVIEW ---
st.markdown("<div class='card'>", unsafe_allow_html=True)
st.markdown("### 📊 Platform Statistics")

col1, col2, col3, col4 = st.columns(4)

with col1:
    cursor.execute("SELECT COUNT(*) as count FROM Students")
    student_count = cursor.fetchone()['count']
    st.metric("Total Students", student_count)

with col2:
    cursor.execute("SELECT COUNT(*) as count FROM Faculty")
    faculty_count = cursor.fetchone()['count']
    st.metric("Total Faculty", faculty_count)

with col3:
    cursor.execute("SELECT COUNT(*) as count FROM Research_Projects")
    project_count = cursor.fetchone()['count']
    st.metric("Total Projects", project_count)

with col4:
    cursor.execute("SELECT COUNT(*) as count FROM Applications WHERE status='Pending'")
    pending_count = cursor.fetchone()['count']
    st.metric("Pending Applications", pending_count)

st.markdown("</div>", unsafe_allow_html=True)

st.divider()

# --- MANAGE FACULTY ---
st.markdown("### 👩‍🏫 Manage Faculty")
cursor.execute("SELECT * FROM Faculty ORDER BY created_at DESC")
faculty_list = cursor.fetchall()

if not faculty_list:
    st.info("No faculty members registered yet.")
else:
    for f in faculty_list:
        with st.expander(f"👤 {f['first_name']} {f['last_name']} — {f['department']}"):
            col1, col2 = st.columns([3, 1])
            
            with col1:
                st.write(f"**Email:** {f['email']}")
                st.write(f"**Research Areas:** {f.get('research_areas', 'Not specified')}")
                st.write(f"**Joined:** {f['created_at'].strftime('%Y-%m-%d')}")
                
                # Show faculty's projects
                cursor.execute("SELECT COUNT(*) as count FROM Research_Projects WHERE faculty_id=%s", (f['faculty_id'],))
                proj_count = cursor.fetchone()['count']
                st.write(f"**Projects:** {proj_count}")
            
            with col2:
                st.markdown("<div class='delete-btn'>", unsafe_allow_html=True)
                if st.button("❌ Delete", key=f"del_fac_{f['faculty_id']}"):
                    try:
                        cursor2 = conn.cursor()
                        cursor2.execute("DELETE FROM Faculty WHERE faculty_id=%s", (f["faculty_id"],))
                        conn.commit()
                        st.success("Faculty deleted successfully.")
                        st.rerun()
                    except Exception as e:
                        st.error(f"Error deleting faculty: {e}")
                st.markdown("</div>", unsafe_allow_html=True)

st.divider()

# --- MANAGE STUDENTS ---
st.markdown("### 🎓 Manage Students")
cursor.execute("SELECT * FROM Students ORDER BY created_at DESC")
student_list = cursor.fetchall()

if not student_list:
    st.info("No students registered yet.")
else:
    for s in student_list:
        with st.expander(f"👤 {s['first_name']} {s['last_name']} — {s.get('major', 'Major not set')}"):
            col1, col2 = st.columns([3, 1])
            
            with col1:
                st.write(f"**Email:** {s['email']}")
                st.write(f"**GPA:** {s.get('gpa', 'N/A')} | **Year:** {s.get('year_level', 'N/A')}")
                st.write(f"**Research Interests:** {s.get('research_interests', 'Not specified')}")
                st.write(f"**Joined:** {s['created_at'].strftime('%Y-%m-%d')}")
                
                # Show student's applications
                cursor.execute("SELECT COUNT(*) as count FROM Applications WHERE student_id=%s", (s['student_id'],))
                app_count = cursor.fetchone()['count']
                st.write(f"**Applications:** {app_count}")
            
            with col2:
                st.markdown("<div class='delete-btn'>", unsafe_allow_html=True)
                if st.button("❌ Delete", key=f"del_stu_{s['student_id']}"):
                    try:
                        cursor2 = conn.cursor()
                        cursor2.execute("DELETE FROM Students WHERE student_id=%s", (s["student_id"],))
                        conn.commit()
                        st.success("Student deleted successfully.")
                        st.rerun()
                    except Exception as e:
                        st.error(f"Error deleting student: {e}")
                st.markdown("</div>", unsafe_allow_html=True)

st.divider()

# --- ALL PROJECTS ---
st.markdown("### 📚 All Research Projects")
cursor.execute("""
    SELECT p.*, f.first_name, f.last_name, f.department,
           (SELECT COUNT(*) FROM Applications WHERE project_id = p.project_id) as app_count
    FROM Research_Projects p
    JOIN Faculty f ON p.faculty_id = f.faculty_id
    ORDER BY p.created_at DESC
""")
project_list = cursor.fetchall()

if not project_list:
    st.info("No projects created yet.")
else:
    for p in project_list:
        status_emoji = {
            'Recruiting': '📢',
            'In Progress': '🔄',
            'Completed': '✅',
            'Cancelled': '❌'
        }.get(p['status'], '📋')
        
        with st.expander(f"{status_emoji} {p['title']} — {p['status']}"):
            st.write(f"**Faculty:** {p['first_name']} {p['last_name']} ({p['department']})")
            st.write(f"**Description:** {p['description']}")
            st.write(f"**Max Students:** {p['max_students']}")
            st.write(f"**Applications:** {p['app_count']}")
            st.write(f"**Created:** {p['created_at'].strftime('%Y-%m-%d')}")
            
            # Option to delete project
            if st.button("🗑️ Delete Project", key=f"del_proj_{p['project_id']}"):
                try:
                    cursor2 = conn.cursor()
                    cursor2.execute("DELETE FROM Research_Projects WHERE project_id=%s", (p["project_id"],))
                    conn.commit()
                    st.success("Project deleted successfully.")
                    st.rerun()
                except Exception as e:
                    st.error(f"Error deleting project: {e}")

# --- LOGOUT BUTTON ---
st.divider()
if st.button("🚪 Logout", type="secondary"):
    st.session_state.clear()
    st.success("Logged out successfully!")
    st.switch_page("app.py")

conn.close()