-- 1) List triggers to confirm they exist
SHOW TRIGGERS LIKE 'trg_award_on_complete';
SHOW TRIGGERS LIKE 'trg_log_application_status_change';

-- 2) View trigger creation statements
SHOW CREATE TRIGGER trg_award_on_complete\G
SHOW CREATE TRIGGER trg_log_application_status_change\G

-- 3) Find or create an application to test the logging trigger.
-- If no suitable application exists, create temporary rows inside a transaction (rolled back later).

-- Replace <APP_ID> below if you already have an application id; otherwise follow the instructions to create a temp one.

-- SAFE TEST: create temp data and update status to trigger logging, then ROLLBACK.
START TRANSACTION;

-- pick an existing faculty and student (or create temp rows as needed)
SET @stu = (SELECT student_id FROM Students LIMIT 1);
SET @proj = (SELECT project_id FROM Research_Projects LIMIT 1);

-- If none exist, you may create temp rows here (omitted for brevity). Assume @stu and @proj are set.

-- create a pending application for test if needed
INSERT INTO Applications (status, cover_letter, student_id, project_id)
VALUES ('Pending', 'Trigger verification', @stu, @proj);
SET @app = LAST_INSERT_ID();

-- Ensure there's no pre-existing log entry
SELECT * FROM Application_Logs WHERE application_id = @app;

-- Update application to 'Withdrawn' to fire the trigger
UPDATE Applications SET status = 'Withdrawn' WHERE application_id = @app;

-- Check Application_Logs for a new entry created by trg_log_application_status_change
SELECT * FROM Application_Logs WHERE application_id = @app;

-- Cleanup: ROLLBACK to not persist test rows (if satisfied, re-run without ROLLBACK to keep)
ROLLBACK;

-- End of trigger verification additions.

-- 4) Test trigger INSIDE a transaction so you can rollback after verification.
-- Replace <PROJECT_ID> with the id from step 3 (or set the variable below).

SET @proj_id = <PROJECT_ID>;

-- See current achievement rows for the project (before)
SELECT * FROM Student_Achievements WHERE project_id = @proj_id;

START TRANSACTION;

-- Update project to trigger the action
UPDATE Research_Projects
SET status = 'Completed'
WHERE project_id = @proj_id;

-- Immediately check Student_Achievements (trigger runs within this transaction)
SELECT * FROM Student_Achievements WHERE project_id = @proj_id;

-- If satisfied with results, COMMIT; otherwise ROLLBACK to undo.
-- ROLLBACK;
-- COMMIT;
