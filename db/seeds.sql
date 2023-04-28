INSERT INTO departments (department_name)
VALUES 
('Marketing'),
('Engineering'),
('Finance'), 
('Human Resources'),
('Research and Development'),
('Customer Relations'),
('Legal');

INSERT INTO roles (title, salary, department_id)
VALUES
('Marketing Manager', 100000.00, 1),
('Engineering Manager', 200000.00, 2),
('Head of Finance', 130000.00, 3),
('HR Director', 150000.00, 4),
('Research and Development Manager', 170000.00,5),
('Customer Relations Manager', 60000.00, 6),
('Legal Manager', 85000.00, 7);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Heather', 'Summers', 1, 1),
('John', 'Doe', 2, 2),
('Jane', 'Smith', 3, 3),
('Chris', 'Lake', 4, 4),
('John', 'Summit', 5, 5),
('Dom', 'Dolla', 6, 6),
('Peggy', 'Gou', 7, 7);


