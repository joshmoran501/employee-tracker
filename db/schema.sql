-- create employee database
DROP DATABASE if exists employee_db;
CREATE DATABASE employee_db;
USE employee_db;

-- create department, role, and employee tables
CREATE TABLE department (
    id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    deptName VARCHAR(50) NOT NULL
);

CREATE TABLE roles (
    id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    title VARCHAR(50) NOT NULL,
    salary INTEGER NOT NULL,
    deptID INTEGER NOT NULL,

    FOREIGN KEY (deptID) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee (
    id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    firstName VARCHAR(50) NOT NULL,
	lastName VARCHAR(50) NOT NULL,
    roleID INTEGER NOT NULL,
    deptID INTEGER NOT NULL,
    managerID INTEGER,
    isManager BOOLEAN,

    FOREIGN KEY (roleID) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (deptID) REFERENCES roles(deptID) ON DELETE CASCADE,
    FOREIGN KEY (managerID) REFERENCES employee(id) ON DELETE CASCADE
);