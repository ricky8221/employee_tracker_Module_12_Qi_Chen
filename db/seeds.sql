USE employee_db;

INSERT INTO department (department)
VALUES 
("Sales"),
("Engineer"),
("Finance"),
("Legal");

INSERT INTO role(title, salary, department_id)
VALUES
("Sales Lead", "10000", 1),
("Sales Specialist", 5000, 1),
("Lead Engineer", "20000", 2),
("Software Engineer", "12000", 2),
("Frontend Developer", "10000", 2),
("Backend Developer", "15000", 2),
("Lead Accountant", "12000", 3),
("Accountant", "8000", 3),
("Legal Team Lead", "20000", 4),
("Leagal Team", "10000", 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
("Ryan", "Lai", 3, NULL),
("Qi", "Chen", 4, 1),
("Nicole", "Ye", 1, NULL),
("Bella", "Chen", 2, 3),
("Jasmine", "Chen", 2, 3),
("Elaine", "Liu", 7, NULL),
("Jasper", "Xiao", 8, 6),
("Anderw", "Lee", 9, NULL),
("Jay", "Wall", 10, 8);