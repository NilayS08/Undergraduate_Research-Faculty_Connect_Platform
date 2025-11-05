# 🎓 Undergraduate Research & Faculty Connect Platform

## 📋 Table of Contents

- [Overview](#overview)
- [Main Idea](#main-idea)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [User Roles & Privileges](#user-roles--privileges)
- [Database Features](#database-features)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Future Enhancements](#future-enhancements)

## 🌟 Overview

The **Undergraduate Research & Faculty Connect Platform** is a comprehensive web application designed to bridge the gap between students seeking research opportunities and faculty members looking for research assistants. This platform serves as a central hub for academic collaboration, making it easier for students to discover research projects aligned with their interests and skills, while helping faculty members find qualified student researchers.

This project demonstrates a real-world solution to a common challenge in academia: facilitating meaningful connections between undergraduate students and research opportunities. It showcases full-stack development skills, database design expertise, and an understanding of complex academic workflows.

## 💡 Main Idea

The platform addresses a critical need in academic institutions where:

- **Students** often struggle to find research opportunities that match their interests and skills
- **Faculty members** need a streamlined way to recruit qualified students for their research projects
- **Administrators** require tools to oversee and manage the entire research ecosystem

By creating a centralized platform with role-based access control, skill matching algorithms, and application management systems, we provide an efficient solution that benefits all stakeholders in the academic research community.

## ✨ Features
### For Students
- 📝 Create and manage comprehensive profiles (major, GPA, year level, research interests)
- 🧠 Add and update skill sets from a predefined skill library
- 🔍 Browse available research projects with detailed descriptions
- 📩 Submit applications to research projects with cover letters
- 📊 Track application status (Pending, Accepted, Rejected, Withdrawn)
- 🏆 View achievements and completed project history
- 🎯 Get matched to projects based on skills and interests
### For Faculty
- 🔬 Create and manage research projects
- 📋 Specify project requirements (skills, max students, description)
- 👥 View and manage student applications
- ✅ Approve or reject applications
- 🔄 Update project status (Recruiting, In Progress, Completed, Cancelled)
- 📈 Track project progress and team members
- 🎓 Automatically award achievements to students upon project completion
### For Administrators
- 🛠️ Comprehensive dashboard with platform statistics
- 👨‍🎓 Manage student accounts and profiles
- 👩‍🏫 Manage faculty accounts and research portfolios
- 📚 Oversee all research projects across the platform
- 📊 View analytics (total users, projects, pending applications)
- 🗑️ Delete users and projects with cascading data management
- 🔐 Maintain platform security and data integrity

## 🛠️ Tech Stack
### Frontend
- **Streamlit** (v1.x): Modern Python framework for building interactive web applications
    - Provides responsive UI components
    - Built-in session state management
    - Easy-to-use widgets and forms
    - Real-time updates with `st.rerun()`
### Backend & Database
- **MySQL** (8.0+): Relational database management system
    - ACID compliance for data integrity
    - Support for complex queries and joins
    - Triggers and stored procedures
    - Foreign key constraints with cascading deletes
- **mysql-connector-python**: Python driver for MySQL connectivity
    - Efficient database connection pooling
    - Parameterized queries for SQL injection prevention
    - Dictionary cursor support for easy data access
### Security
- **bcrypt**: Industry-standard password hashing library
    - Adaptive hash function (Blowfish cipher)
    - Built-in salt generation
    - Configurable work factor for future-proofing
    - Protection against rainbow table attacks
### Additional Libraries
- **pandas**: Data manipulation and analysis (for future analytics features)
- **python-dotenv**: Environment variable management (for secure configuration)
### Architecture
- **MVC Pattern**: Separation of concerns
    - `db.py`: Database connection layer
    - `utils.py`: Business logic and authentication
    - `app.py`: Main application controller
    - `pages/*.py`: View layer for different dashboards

## 🗄️ Database Schema
### Core Tables
#### 1. **Admin**
```sql
- admin_id (PK, AUTO_INCREMENT)
- first_name, last_name
- email (UNIQUE)
- created_at, updated_at
```
#### 2. **Students**
```sql
- student_id (PK, AUTO_INCREMENT)
- first_name, last_name
- major, gpa (0.0-4.0), year_level (1-4)
- research_interests (TEXT)
- email (UNIQUE), password (hashed)
- admin_id (FK → Admin)
- created_at, updated_at
```

#### 3. **Faculty**
```sql
- faculty_id (PK, AUTO_INCREMENT)
- first_name, last_name
- department, research_areas (TEXT)
- email (UNIQUE), password (hashed)
- admin_id (FK → Admin)
- created_at, updated_at
```

#### 4. **Research_Projects**
```sql
- project_id (PK, AUTO_INCREMENT)
- title, description (TEXT)
- status (ENUM: 'Recruiting', 'In Progress', 'Completed', 'Cancelled')
- max_students (1-20)
- faculty_id (FK → Faculty)
- admin_id (FK → Admin)
- created_at, updated_at
```
#### 5. **Skills**
```sql
- skill_id (PK, AUTO_INCREMENT)
- skill_name (UNIQUE)
- category (e.g., 'Programming', 'AI', 'Biology')
- created_at
```
#### 6. **Applications**
```sql
- application_id (PK, AUTO_INCREMENT)
- status (ENUM: 'Pending', 'Accepted', 'Rejected', 'Withdrawn')
- cover_letter (TEXT)
- student_id (FK → Students)
- project_id (FK → Research_Projects)
- applied_at, reviewed_at
- UNIQUE(student_id, project_id)
```
### Junction Tables
#### 7. **Project_Skills** (Many-to-Many)
```sql
- project_id (FK → Research_Projects)
- skill_id (FK → Skills)
- PRIMARY KEY (project_id, skill_id)
```
#### 8. **Student_Skills** (Many-to-Many)
```sql
- student_id (FK → Students)
- skill_id (FK → Skills)
- PRIMARY KEY (student_id, skill_id)
```
#### 9. **Project_Members** (Many-to-Many)
```sql
- project_id (FK → Research_Projects)
- student_id (FK → Students)
- joined_at
- PRIMARY KEY (project_id, student_id)
```
#### 10. **Student_Achievements**
````sql
- id (PK, AUTO_INCREMENT)
- student_id (FK → Students)
- project_id (FK → Research_Projects)
- title
- awarded_on
```

### Entity Relationship Diagram
```
Admin ──┬─→ Students ──┬─→ Applications ←─┐
        │              │                   │
        │              └─→ Student_Skills  │
        │              └─→ Project_Members │
        │                                  │
        └─→ Faculty ─→ Research_Projects ──┘
                           ├─→ Project_Skills
                           └─→ Student_Achievements
                           
Skills ←─┬─ Student_Skills
         └─ Project_Skills
````

## 🚀 Setup Instructions
### Prerequisites
- Python 3.8 or higher
- MySQL 8.0 or higher
- pip (Python package manager)
- Git (optional, for cloning)
### Step 1: Clone or Download the Project
```bash
git clone <repository-url>
cd research-connect-platform
```
### Step 2: Install Python Dependencies
```bash
cd Streamlit_app
pip install -r requirements.txt
```
The `requirements.txt` includes:
- `streamlit` - Web application framework
- `mysql-connector-python` - MySQL database driver
- `pandas` - Data manipulation
- `python-dotenv` - Environment configuration
- `bcrypt` - Password hashing (implicit dependency)
### Step 3: Set Up MySQL Database
#### 3.1 Start MySQL Server
```bash
# On Windows (if using XAMPP)
Start XAMPP Control Panel → Start MySQL

# On Mac (if using Homebrew)
brew services start mysql

# On Linux
sudo systemctl start mysql
```
#### 3.2 Create the Database
```bash
# Login to MySQL
mysql -u root -p

# Or use MySQL Workbench / phpMyAdmin
```
#### 3.3 Execute the SQL Script
```bash
# From MySQL command line
source /path/to/Database.sql

# Or copy and paste the entire Database.sql content into MySQL Workbench
```
This will:
- Drop existing `researchhub` database (if exists)
- Create fresh `researchhub` database
- Create all 10 tables with proper constraints
- Add indexes for performance
- Create stored procedures and triggers
- Insert sample data (1 admin, 2 faculty, 3 students, 3 projects)
### Step 4: Configure Database Connection
Edit `Streamlit_app/db.py` to match your MySQL configuration:
```python
def get_connection():
    try:
        conn = mysql.connector.connect(
            host="localhost",        # Change if using remote DB
            user="root",             # Your MySQL username
            password="YOUR_PASSWORD", # Your MySQL password
            database="researchhub"   # Database name (don't change)
        )
        return conn
    except Error as e:
        print("❌ Database connection failed:", e)
        return None
```
**Also update** `Streamlit_app/utils.py` with the same credentials in the two functions that create connections.
### Step 5: Verify Installation
```bash
# Test MySQL connection
mysql -u root -p researchhub -e "SHOW TABLES;"

# Expected output:
# +------------------------+
# | Tables_in_researchhub  |
# +------------------------+
# | Admin                  |
# | Applications           |
# | Faculty                |
# | Project_Members        |
# | Project_Skills         |
# | Research_Projects      |
# | Skills                 |
# | Student_Achievements   |
# | Student_Skills         |
# | Students               |
# +------------------------+
```

## 🏃 Running the Application
## 📁 Project Structure
```
research-connect-platform/
│
├── Database.sql                    # Complete database setup script
├── README.md                       # This file
│
└── Streamlit_app/
    ├── app.py                      # Main application entry point
    ├── db.py                       # Database connection handler
    ├── utils.py                    # Authentication & helper functions
    ├── requirements.txt            # Python dependencies
    │
    └── pages/
        ├── Student_Dashboard.py    # Student interface
        ├── Faculty_Dashboard.py    # Faculty interface
        └── Admin_Dashboard.py      # Admin interface
````
### Start the Streamlit App
````bash
cd Streamlit_app
streamlit run app.py
```

### Expected Output
```
  You can now view your Streamlit app in your browser.

  Local URL: http://localhost:8501
  Network URL: http://192.168.x.x:8501
````
### Access the Application
1. Open your browser
2. Navigate to `http://localhost:8501`
3. You should see the login/signup page
### Test Credentials (from sample data)
**Student Account:**
- Email: `jane.doe@univ.edu`
- Password: `student123`
**Faculty Account:**
- Email: `john.smith@univ.edu`
- Password: `faculty123`
**Admin Account:**
- Email: `alice.johnson@univ.edu`
- Password: (No password in sample data - create one via signup)
### First-Time Setup
1. **Sign Up** as a new student or faculty member
2. Passwords are automatically hashed using bcrypt
3. **Login** with your new credentials
4. You'll be redirected to the appropriate dashboard

## 📄 License
This project is created for educational purposes as part of a database management course.

## 👨‍💻 Author

**Nilay Srivastava** & **Nisschay Khandelwal**
- University: PES University
- Course: Database Management Systems
- Year: 2024-2025
