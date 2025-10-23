-- ========================================================
--  UNDERGRADUATE RESEARCH & FACULTY CONNECT PLATFORM
--  Full MySQL-Compatible SQL Setup Script
--  Includes DDL + DML + Procedures + Triggers
-- ========================================================

-- -----------------------------
-- DATABASE CREATION
-- -----------------------------
DROP DATABASE IF EXISTS researchhub;
CREATE DATABASE researchhub;
USE researchhub;

-- -----------------------------
-- TABLE DEFINITIONS (DDL)
-- -----------------------------

CREATE TABLE Admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    major VARCHAR(100),
    gpa DECIMAL(3,2) CHECK (gpa >= 0.0 AND gpa <= 4.0),
    year_level INT CHECK (year_level >= 1 AND year_level <= 4),
    research_interests TEXT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    admin_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES Admin(admin_id) ON DELETE SET NULL
);

CREATE TABLE Faculty (
    faculty_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    department VARCHAR(100),
    research_areas TEXT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    admin_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES Admin(admin_id) ON DELETE SET NULL
);

CREATE TABLE Research_Projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('Recruiting', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Recruiting',
    max_students INT NOT NULL CHECK (max_students > 0 AND max_students <= 20),
    faculty_id INT NOT NULL,
    admin_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (faculty_id) REFERENCES Faculty(faculty_id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES Admin(admin_id) ON DELETE SET NULL
);

CREATE TABLE Applications (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    status ENUM('Pending', 'Accepted', 'Rejected', 'Withdrawn') DEFAULT 'Pending',
    cover_letter TEXT,
    student_id INT NOT NULL,
    project_id INT NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES Research_Projects(project_id) ON DELETE CASCADE,
    UNIQUE KEY unique_application (student_id, project_id)
);

CREATE TABLE Skills (
    skill_id INT AUTO_INCREMENT PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Project_Skills (
    project_id INT,
    skill_id INT,
    PRIMARY KEY (project_id, skill_id),
    FOREIGN KEY (project_id) REFERENCES Research_Projects(project_id),
    FOREIGN KEY (skill_id) REFERENCES Skills(skill_id)
);

CREATE TABLE Student_Skills (
    student_id INT,
    skill_id INT,
    PRIMARY KEY (student_id, skill_id),
    FOREIGN KEY (student_id) REFERENCES Students(student_id),
    FOREIGN KEY (skill_id) REFERENCES Skills(skill_id)
);

CREATE TABLE Project_Members (
    project_id INT,
    student_id INT,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id, student_id),
    FOREIGN KEY (project_id) REFERENCES Research_Projects(project_id),
    FOREIGN KEY (student_id) REFERENCES Students(student_id)
);

CREATE TABLE Student_Achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    project_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    awarded_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES Research_Projects(project_id) ON DELETE CASCADE
);

-- -----------------------------
-- INDEXES FOR PERFORMANCE
-- -----------------------------

-- Indexes for frequently queried columns
CREATE INDEX idx_students_email ON Students(email);
CREATE INDEX idx_faculty_email ON Faculty(email);
CREATE INDEX idx_projects_faculty ON Research_Projects(faculty_id);
CREATE INDEX idx_projects_status ON Research_Projects(status);
CREATE INDEX idx_applications_student ON Applications(student_id);
CREATE INDEX idx_applications_project ON Applications(project_id);
CREATE INDEX idx_applications_status ON Applications(status);
CREATE INDEX idx_project_skills_project ON Project_Skills(project_id);
CREATE INDEX idx_student_skills_student ON Student_Skills(student_id);
CREATE INDEX idx_project_members_project ON Project_Members(project_id);

-- -----------------------------
-- SAMPLE DATA (DML)
-- -----------------------------

-- ADMIN
INSERT INTO Admin (first_name, last_name, email) VALUES 
('Alice', 'Johnson', 'alice.johnson@univ.edu'),
('Robert', 'Miller', 'robert.miller@univ.edu'),
('Susan', 'Clark', 'susan.clark@univ.edu'),
('David', 'Wong', 'david.wong@univ.edu'),
('Priya', 'Nair', 'priya.nair@univ.edu');

-- FACULTY
INSERT INTO Faculty (first_name, last_name, department, research_areas, email, password, admin_id) VALUES 
('John', 'Smith', 'Computer Science', 'AI, ML', 'john.smith@univ.edu', 'faculty123', 1),
('Emily', 'Taylor', 'Biotechnology', 'Genetics, Cell Biology', 'emily.taylor@univ.edu', 'faculty123', 2),
('Arjun', 'Rao', 'Mechanical Engineering', 'Robotics, Automation', 'arjun.rao@univ.edu', 'faculty123', 3),
('Linda', 'Brown', 'Physics', 'Quantum Computing', 'linda.brown@univ.edu', 'faculty123', 4),
('Carlos', 'Garcia', 'Mathematics', 'Statistics, Optimization', 'carlos.garcia@univ.edu', 'faculty123', 5);

-- STUDENTS
INSERT INTO Students (first_name, last_name, major, gpa, year_level, research_interests, email, password, admin_id) VALUES
('Jane', 'Doe', 'Computer Science', 3.8, 3, 'AI Research, Data Science', 'jane.doe@univ.edu', 'student123', 1),
('Mark', 'Lee', 'Biotechnology', 3.5, 2, 'Genetics, Lab Research', 'mark.lee@univ.edu', 'student123', 2),
('Aditi', 'Sharma', 'Physics', 3.9, 4, 'Quantum Computing, Nanotech', 'aditi.sharma@univ.edu', 'student123', 3),
('Ethan', 'Wang', 'Mechanical Engineering', 3.6, 3, 'Robotics, Control Systems', 'ethan.wang@univ.edu', 'student123', 4),
('Sophia', 'Martinez', 'Mathematics', 3.7, 2, 'Optimization, Machine Learning', 'sophia.martinez@univ.edu', 'student123', 5),
('Ravi', 'Patel', 'Computer Science', 3.4, 1, 'Web Dev, Databases', 'ravi.patel@univ.edu', 'student123', 1);

-- RESEARCH PROJECTS
INSERT INTO Research_Projects (title, description, status, max_students, faculty_id, admin_id) VALUES
('AI for Healthcare', 'Exploring AI applications in medical imaging', 'Recruiting', 5, 1, 1),
('Genetic Analysis Tool', 'Developing software for genome sequencing', 'Recruiting', 4, 2, 2),
('Robotic Arm Design', 'Creating a low-cost robotic arm prototype', 'In Progress', 6, 3, 3),
('Quantum Algorithms', 'Researching quantum computing optimization', 'Recruiting', 3, 4, 4),
('Statistical Models for Climate Data', 'Analyzing large climate datasets', 'Completed', 5, 5, 5),
('NLP for Education', 'Building AI tutors using NLP', 'Recruiting', 5, 1, 1);

-- SKILLS
INSERT INTO Skills (skill_name, category) VALUES
('Python', 'Programming'),
('Data Analysis', 'Analytical'),
('Lab Work', 'Experimental'),
('Robotics', 'Engineering'),
('Quantum Mechanics', 'Physics'),
('Statistics', 'Mathematics');

-- PROJECT_SKILLS (using auto-generated IDs)
INSERT INTO Project_Skills VALUES
(1, 1), (1, 2),  -- AI for Healthcare: Python, Data Analysis
(2, 1), (2, 3),  -- Genetic Analysis: Python, Lab Work
(3, 4),          -- Robotic Arm: Robotics
(4, 5),          -- Quantum Algorithms: Quantum Mechanics
(5, 6),          -- Climate Data: Statistics
(6, 1), (6, 2);  -- NLP Education: Python, Data Analysis

-- STUDENT_SKILLS (using auto-generated IDs)
INSERT INTO Student_Skills VALUES
(1, 1), (1, 2),  -- Jane Doe: Python, Data Analysis
(2, 3),          -- Mark Lee: Lab Work
(3, 5),          -- Aditi Sharma: Quantum Mechanics
(4, 4),          -- Ethan Wang: Robotics
(5, 6),          -- Sophia Martinez: Statistics
(6, 1), (6, 2);  -- Ravi Patel: Python, Data Analysis

-- APPLICATIONS (using auto-generated IDs)
INSERT INTO Applications (status, cover_letter, student_id, project_id) VALUES
('Pending', 'I am passionate about AI in medicine.', 1, 1),
('Accepted', 'My skills in lab work fit this project.', 2, 2),
('Pending', 'Excited to work on robotics hardware.', 4, 3),
('Rejected', 'Quantum computing fascinates me.', 3, 4),
('Accepted', 'Strong background in statistics for climate research.', 5, 5),
('Pending', 'Interested in NLP and education tech.', 6, 6);

-- -----------------------------
-- STORED PROCEDURES
-- -----------------------------
DELIMITER $$

-- Procedure: MatchStudentsToProject
CREATE PROCEDURE MatchStudentsToProject(IN p_project_id INT)
BEGIN
    SELECT s.student_id, s.first_name, s.last_name,
           (
              COALESCE((
                SELECT COUNT(*) 
                FROM student_skills ss 
                JOIN project_skills ps ON ss.skill_id = ps.skill_id
                WHERE ss.student_id = s.student_id AND ps.project_id = p_project_id
              ),0)
           ) AS match_score
    FROM students s
    WHERE (
        SELECT COUNT(*) 
        FROM student_skills ss 
        JOIN project_skills ps ON ss.skill_id = ps.skill_id
        WHERE ss.student_id = s.student_id AND ps.project_id = p_project_id
    ) > 0
    ORDER BY match_score DESC;
END$$


-- Procedure: Accept Application
CREATE PROCEDURE accept_application(IN p_application_id INT)
BEGIN
    DECLARE v_project_id INT;
    DECLARE v_student_id INT;

    SELECT project_id, student_id 
    INTO v_project_id, v_student_id 
    FROM applications 
    WHERE application_id = p_application_id;

    UPDATE applications 
    SET status = 'Accepted' 
    WHERE application_id = p_application_id;

    INSERT IGNORE INTO project_members (project_id, student_id)
    VALUES (v_project_id, v_student_id);
END$$

DELIMITER ;

-- -----------------------------
-- TRIGGERS
-- -----------------------------
DELIMITER $$

CREATE TRIGGER trg_award_on_complete
AFTER UPDATE ON research_projects
FOR EACH ROW
BEGIN
    IF NEW.status = 'Completed' AND OLD.status <> 'Completed' THEN
        INSERT IGNORE INTO student_achievements (student_id, project_id, title, awarded_on)
        SELECT a.student_id, NEW.project_id, CONCAT('Completed: ', NEW.title), NOW()
        FROM applications a
        WHERE a.project_id = NEW.project_id AND a.status = 'Accepted';
    END IF;
END$$

DELIMITER ;

-- ========================================================
-- ✅ DATABASE SETUP COMPLETE
-- ========================================================

-- Example calls:
-- CALL MatchStudentsToProject(301);
-- CALL accept_application(501);
-- UPDATE research_projects SET status='Completed' WHERE project_id=301;
-- SELECT * FROM student_achievements;

-- Passwords are now included in the INSERT statements above
-- Test credentials:
-- Student: jane.doe@univ.edu / student123
-- Faculty: john.smith@univ.edu / faculty123