INSERT INTO departments (dep_name)
VALUES
    ("Finance"),
    ("Sales"),
    ("Legal"),
    ("Software Engineering");

INSERT INTO roles (title, salary, department_id)
VALUES
    ("Financial Manager", 100000, 1),
    ("Financial Analyst", 80000, 1),
    ("Account Executive", 110000, 2),
    ("Salesperson", 75000, 2),
    ("Legal Team Lead", 105000, 3),
    ("Lawyer", 90000, 3),
    ("Sr Software Engineer", 120000, 4),
    ("Jr Software Engineer", 90000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ("Brian", "Brooks", 1, null),
    ("Justin", "Boone", 2, 1),
    ("Gregory", "Parker", 3, null),
    ("Chelsey", "Coleman", 4, 3),
    ("Michael", "Clark", 5, null),
    ("Raymond", "Jenkins", 6, 5),
    ("Kari", "Turner", 7, null),
    ("Christopher", "Rocha", 8, 7);