INSERT INTO department (id, deptName)
VALUES 
    (1, "Dog"),
    (2, "Cat"),
    (3, "Monkey");

INSERT INTO roles (id, title, salary, deptID)
VALUES
    (1, "Top Dog", 60000, 1),
    (2, "Lion King", 65000, 2),
    (3, "Silverback", 70000, 3),
    (4, "Chihuahua", 50000, 1),
    (5, "Scaredy Cat", 50000, 2),
    (6, "Bumbling Baboon", 50000, 3);
    
INSERT INTO employee (id, firstName, lastName, roleID, deptID, managerID, isManager)
VALUES
    (1, "Mu", "Fasa", 2, 2, NULL, TRUE),
    (2, "King", "Kong", 3, 3, NULL, TRUE),
    (3, "Air", "Bud", 1, 1, NULL, TRUE),
    (4, "Bruiser", "Woods", 4, 1, 3, FALSE),
    (5, "Uncle", "Scar", 5, 2, 1, FALSE),
    (6, "Darwin", "Thornberry", 6, 3, 2, FALSE)
