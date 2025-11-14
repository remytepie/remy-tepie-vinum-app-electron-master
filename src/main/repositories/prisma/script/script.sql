--CREATE DATABASE todo_db;

CREATE TABLE todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title TINYTEXT,
    description TEXT,
    due_date DATETIME,
    is_finished BIT DEFAULT 0
);

CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name TINYTEXT
);

CREATE TABLE todo_tags (
    todo_id INT,
    tag_id INT,
    PRIMARY KEY (todo_id, tag_id),
    FOREIGN KEY (todo_id) REFERENCES todos(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

INSERT INTO tags (name) VALUES ('Travail');
INSERT INTO tags (name) VALUES ('Personnel');
INSERT INTO tags (name) VALUES ('Urgent');

INSERT INTO todos (title, description, due_date, is_finished) VALUES ('MaTache1','untruca faire','2025-10-10',false);
INSERT INTO todos (title, description, due_date, is_finished) VALUES ('Etudier SGBD','bla bla','2025-10-25',false);
INSERT INTO todos (title, description, due_date, is_finished) VALUES ('Etudier Reseau','blu blu','2025-10-23',false);
INSERT INTO todos (title, description, due_date, is_finished) VALUES ('Etudier Anglais','bli bli','2025-10-15',false);

INSERT INTO todo_tags (todo_id, tag_id) VALUES (1, 2);
INSERT INTO todo_tags (todo_id, tag_id) VALUES (2, 1);
INSERT INTO todo_tags (todo_id, tag_id) VALUES (3, 1);
INSERT INTO todo_tags (todo_id, tag_id) VALUES (4, 3);
INSERT INTO todo_tags (todo_id, tag_id) VALUES (4, 2);