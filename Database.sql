-- ========================================================
--  UNDERGRADUATE RESEARCH & FACULTY CONNECT PLATFORM
--  Full MySQL-Compatible SQL Setup Script (Enhanced)
-- ========================================================

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
    year_level INT CHECK (year_level BETWEEN 1 AND 4),
    research_interests TEXT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    admin_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_student_admin FOREIGN KEY (admin_id)
        REFERENCES Admin(admin_id) ON DELETE SET NULL
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
    CONSTRAINT fk_faculty_admin FOREIGN KEY (admin_id)
        REFERENCES Admin(admin_id) ON DELETE SET NULL
);

CREATE TABLE Research_Projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('Recruiting', 'In Progress', 'Completed', 'Cancelled')
        DEFAULT 'Recruiting',
    max_students INT NOT NULL CHECK (max_students BETWEEN 1 AND 20),
    faculty_id INT NOT NULL,
    admin_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_project_faculty FOREIGN KEY (faculty_id)
        REFERENCES Faculty(faculty_id) ON DELETE CASCADE,
    CONSTRAINT fk_project_admin FOREIGN KEY (admin_id)
        REFERENCES Admin(admin_id) ON DELETE SET NULL
);

CREATE TABLE Skills (
    skill_id INT AUTO_INCREMENT PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Applications (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    status ENUM('Pending', 'Accepted', 'Rejected', 'Withdrawn') DEFAULT 'Pending',
    cover_letter TEXT,
    student_id INT NOT NULL,
    project_id INT NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    CONSTRAINT fk_app_student FOREIGN KEY (student_id)
        REFERENCES Students(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_app_project FOREIGN KEY (project_id)
        REFERENCES Research_Projects(project_id) ON DELETE CASCADE,
    UNIQUE KEY unique_application (student_id, project_id)
);

-- ✅ Junction Tables (with proper FK cascade + unique names)

CREATE TABLE Project_Skills (
    project_id INT,
    skill_id INT,
    PRIMARY KEY (project_id, skill_id),
    CONSTRAINT fk_project_skills_project FOREIGN KEY (project_id)
        REFERENCES Research_Projects(project_id) ON DELETE CASCADE,
    CONSTRAINT fk_project_skills_skill FOREIGN KEY (skill_id)
        REFERENCES Skills(skill_id) ON DELETE CASCADE
);

CREATE TABLE Student_Skills (
    student_id INT,
    skill_id INT,
    PRIMARY KEY (student_id, skill_id),
    CONSTRAINT fk_student_skills_student FOREIGN KEY (student_id)
        REFERENCES Students(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_student_skills_skill FOREIGN KEY (skill_id)
        REFERENCES Skills(skill_id) ON DELETE CASCADE
);

CREATE TABLE Project_Members (
    project_id INT,
    student_id INT,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id, student_id),
    CONSTRAINT fk_project_members_project FOREIGN KEY (project_id)
        REFERENCES Research_Projects(project_id) ON DELETE CASCADE,
    CONSTRAINT fk_project_members_student FOREIGN KEY (student_id)
        REFERENCES Students(student_id) ON DELETE CASCADE
);

CREATE TABLE Student_Achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    project_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    awarded_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ach_student FOREIGN KEY (student_id)
        REFERENCES Students(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_ach_project FOREIGN KEY (project_id)
        REFERENCES Research_Projects(project_id) ON DELETE CASCADE
);

-- -----------------------------
-- INDEXES
-- -----------------------------
CREATE INDEX idx_students_email ON Students(email);
CREATE INDEX idx_faculty_email ON Faculty(email);
CREATE INDEX idx_projects_faculty ON Research_Projects(faculty_id);
CREATE INDEX idx_projects_status ON Research_Projects(status);
CREATE INDEX idx_applications_student ON Applications(student_id);
CREATE INDEX idx_applications_project ON Applications(project_id);

-- -----------------------------
-- SAMPLE DATA (DML)
-- -----------------------------
-- (Same inserts as before — unchanged, already good)
-- [Keep your existing INSERT INTO ... statements exactly as you have them]
-- (Admin, Faculty, Students, Research_Projects, Skills, Project_Skills, Student_Skills, Applications)

-- -----------------------------
-- STORED PROCEDURES
-- -----------------------------
DELIMITER $$

CREATE PROCEDURE MatchStudentsToProject(IN p_project_id INT)
BEGIN
    SELECT s.student_id, s.first_name, s.last_name,
           (
              SELECT COUNT(*) 
              FROM Student_Skills ss 
              JOIN Project_Skills ps ON ss.skill_id = ps.skill_id
              WHERE ss.student_id = s.student_id AND ps.project_id = p_project_id
           ) AS match_score
    FROM Students s
    WHERE (
        SELECT COUNT(*) 
        FROM Student_Skills ss 
        JOIN Project_Skills ps ON ss.skill_id = ps.skill_id
        WHERE ss.student_id = s.student_id AND ps.project_id = p_project_id
    ) > 0
    ORDER BY match_score DESC;
END$$

CREATE PROCEDURE accept_application(IN p_application_id INT)
BEGIN
    DECLARE v_project_id INT;
    DECLARE v_student_id INT;

    SELECT project_id, student_id 
    INTO v_project_id, v_student_id 
    FROM Applications 
    WHERE application_id = p_application_id;

    UPDATE Applications 
    SET status = 'Accepted' 
    WHERE application_id = p_application_id;

    INSERT IGNORE INTO Project_Members (project_id, student_id)
    VALUES (v_project_id, v_student_id);
END$$
DELIMITER ;

-- -----------------------------
-- TRIGGERS
-- -----------------------------
DELIMITER $$

CREATE TRIGGER trg_award_on_complete
AFTER UPDATE ON Research_Projects
FOR EACH ROW
BEGIN
    IF NEW.status = 'Completed' AND OLD.status <> 'Completed' THEN
        INSERT IGNORE INTO Student_Achievements (student_id, project_id, title, awarded_on)
        SELECT a.student_id, NEW.project_id, CONCAT('Completed: ', NEW.title), NOW()
        FROM Applications a
        WHERE a.project_id = NEW.project_id AND a.status = 'Accepted';
    END IF;
END$$

DELIMITER ;

-- ========================================================
-- ✅ DATABASE SETUP COMPLETE
-- ========================================================

-- Test credentials:
-- Student: jane.doe@univ.edu / student123
-- Faculty: john.smith@univ.edu / faculty123

USE researchhub;
-- ===============================
-- ADMIN
-- ===============================
INSERT INTO Admin (first_name, last_name, email)
VALUES ('Alice', 'Johnson', 'alice.johnson@univ.edu');

-- ===============================
-- FACULTY
-- ===============================
INSERT INTO Faculty (first_name, last_name, department, research_areas, email, password, admin_id)
VALUES
('John', 'Smith', 'Computer Science', 'AI, ML, Data Science', 'john.smith@univ.edu', 'faculty123', 1),
('Emily', 'Taylor', 'Biotechnology', 'Genomics, Cell Biology', 'emily.taylor@univ.edu', 'faculty123', 1);

-- ===============================
-- STUDENTS
-- ===============================
INSERT INTO Students (first_name, last_name, major, gpa, year_level, research_interests, email, password, admin_id)
VALUES
('Jane', 'Doe', 'Computer Science', 3.8, 3, 'AI, NLP, Data Science', 'jane.doe@univ.edu', 'student123', 1),
('Mark', 'Lee', 'Biotechnology', 3.5, 2, 'Genetics, Lab Automation', 'mark.lee@univ.edu', 'student123', 1),
('Aditi', 'Sharma', 'Mechanical Engineering', 3.7, 4, 'Robotics, Mechatronics', 'aditi.sharma@univ.edu', 'student123', 1);

-- ===============================
-- SKILLS
-- ===============================
INSERT INTO Skills (skill_name, category)
VALUES
('Python', 'Programming'),
('Machine Learning', 'AI'),
('Data Analysis', 'Analytical'),
('Robotics', 'Engineering'),
('Genetics', 'Biology');

-- ===============================
-- PROJECTS
-- ===============================
INSERT INTO Research_Projects (title, description, status, max_students, faculty_id, admin_id)
VALUES
('AI for Healthcare', 'Applying AI for medical imaging and disease prediction.', 'Recruiting', 5, 1, 1),
('Genetic Analysis Tool', 'Developing bioinformatics pipelines for genome sequencing.', 'Recruiting', 3, 2, 1),
('Smart Robotics System', 'Designing a modular robot for lab automation.', 'In Progress', 4, 1, 1);

-- ===============================
-- PROJECT_SKILLS
-- ===============================
INSERT INTO Project_Skills (project_id, skill_id)
VALUES
(1, 1), (1, 2), (1, 3),
(2, 5),
(3, 1), (3, 4);

-- ===============================
-- STUDENT_SKILLS
-- ===============================
INSERT INTO Student_Skills (student_id, skill_id)
VALUES
(1, 1), (1, 2), (1, 3),
(2, 5),
(3, 4), (3, 1);

-- ===============================
-- APPLICATIONS
-- ===============================
INSERT INTO Applications (status, cover_letter, student_id, project_id)
VALUES
('Pending', 'Passionate about AI in healthcare.', 1, 1),
('Accepted', 'Background in genetics and bioinformatics.', 2, 2),
('Pending', 'Interested in robotic systems.', 3, 3);
