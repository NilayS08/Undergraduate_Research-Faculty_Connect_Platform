-- 1) Show definitions for existing procedures and the new one
SHOW CREATE PROCEDURE MatchStudentsToProject;
SHOW CREATE PROCEDURE accept_application;
SHOW CREATE PROCEDURE withdraw_application;

-- 2) Quick existence check
SELECT ROUTINE_NAME, ROUTINE_TYPE
FROM INFORMATION_SCHEMA.ROUTINES
WHERE ROUTINE_SCHEMA = DATABASE()
  AND ROUTINE_NAME IN ('MatchStudentsToProject','accept_application','withdraw_application');

-- ---------------------------------------------------
-- SAFE TEST for withdraw_application (use transaction)
-- ---------------------------------------------------
START TRANSACTION;

-- pick an existing faculty to satisfy FK
SET @fac = (SELECT faculty_id FROM Faculty LIMIT 1);

-- create temp student
INSERT INTO Students (first_name, last_name, major, gpa, year_level, research_interests, email, password, admin_id)
VALUES ('TMP_WITHDRAW','Student','Test',0.0,1,'testing','tmp_withdraw@example.com','tmp_pass', NULL);
SET @stu = LAST_INSERT_ID();

-- create a temp project (linked to existing faculty)
INSERT INTO Research_Projects (title, description, status, max_students, faculty_id, admin_id)
VALUES ('TMP Withdraw Project','Temporary project for withdraw test','Recruiting',2, @fac, NULL);
SET @proj = LAST_INSERT_ID();

-- create a Pending application
INSERT INTO Applications (status, cover_letter, student_id, project_id)
VALUES ('Pending', 'Test withdraw', @stu, @proj);
SET @app = LAST_INSERT_ID();

-- Optionally simulate acceptance then membership to see deletion behavior:
-- CALL accept_application(@app);
-- (if you test acceptance, accept_application will insert into Project_Members)

-- Now CALL the new withdraw_application procedure
CALL withdraw_application(@app);

-- Verify application status changed to 'Withdrawn'
SELECT application_id, status, student_id, project_id FROM Applications WHERE application_id = @app;

-- Verify no Project_Members exists for this student/project
SELECT * FROM Project_Members WHERE project_id = @proj AND student_id = @stu;

-- Verify a log entry was created by the trigger (if trigger is present)
SELECT * FROM Application_Logs WHERE application_id = @app;

-- Cleanup: ROLLBACK to remove test rows (or COMMIT to keep)
ROLLBACK;

-- End of procedure verification additions.
