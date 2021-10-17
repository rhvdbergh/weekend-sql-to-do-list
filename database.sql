CREATE TABLE "tasks" (
 "id" SERIAL PRIMARY KEY,
 "task" VARCHAR(250) NOT NULL,
 "complete" BOOLEAN DEFAULT FALSE,
 "time_completed" DATE
);

INSERT INTO "tasks" 
("task", "complete")
VALUES
('Bake some pizza', FALSE),
('Eat some pizza', FALSE),
('Install Express', FALSE),
('Create file structure', FALSE),
('Execute INSERT INTO statement', FALSE),
('Create a table', FALSE),
('Insert a really, really long message to see what it will look like on different screen sizes', FALSE);
