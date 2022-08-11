const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const connection = require("./connection.js");

connection.connect((err) => {
  if (err) throw err;
  prompt();
});

function prompt() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "pick",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add department",
          "Add role",
          "Add employee",
          "Update employee role",
          "Update employee's manager",
          "View employees by manager",
          "View employees by department",
          // "Delete department",
          // "Delete role",
          // "Delete employee"
        ],
      },
    ])
    .then((answer) => {
      const { pick } = answer;

      if (pick === "View all departments") {
        viewDepts();
      }
      if (pick === "View all roles") {
        viewRoles();
      }
      if (pick === "View all employees") {
        viewEmployees();
      }
      if (pick === "Add department") {
        addDept();
      }
      if (pick === "Add role") {
        addRole();
      }
      if (pick === "Add employee") {
        addEmployee();
      }
      if (pick === "Update employee role") {
        updateEmployee();
      }

      // // bonus
      if (pick === "Update employee's manager") {
        updateManager();
      }
      if (pick === "View employees by manager") {
        viewByManager();
      }
      if (pick === "View employees by department") {
        viewByDept();
      }
      // if (pick === "Delete department"){
      //     deleteDept()
      // }
      // if (pick === "Delete role"){
      //     deleteRole()
      // }
      // if (pick === "Delete employee"){
      //     deleteEmployee()
      // }
    });
}

function viewDepts() {
  console.log("Displaying departments \n");
  const sql = `SELECT department.id AS id, department.deptName as department FROM department`;

  connection.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    prompt();
  });
}

function viewRoles() {
  console.log("Displaying roles \n");
  const sql = `SELECT roles.title as 'Job Title', roles.id as ID, roles.salary as Salary, roles.deptID as 'Department ID'  FROM roles;`;

  connection.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    prompt();
  });
}

function viewEmployees() {
  console.log("Displaying employees \n");
  const sql = `SELECT e.id, e.firstName as 'First name', 
        e.lastName as 'Last Name', r.title as 'Title', 
        d.deptName as 'Department', r.salary as 'Salary', 
        concat(m.firstName,' ', m.lastName) as 'Manager'
        
        FROM employee e
        JOIN roles r
	        ON e.roleID = r.id
        JOIN department d
	        ON r.deptID = d.id
        LEFT JOIN employee m
	        ON e.managerID = m.id`;

  connection.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    prompt();
  });
}

function addDept() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "addDept",
        message: "What department would you like to add?",
        validate: (addDept) => {
          if (addDept) {
            return true;
          } else {
            console.log("Please enter a department name");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      const sql = `insert into department (deptName)
            values (?)`;
      connection.query(sql, answer.addDept, (err, res) => {
        if (err) throw err;
        console.table(`Added ${answer.addDept} to departments.`);
        viewDepts();
      });
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "role",
        message: "What is the title of the role?",
        validate: (addRole) => {
          if (addRole) {
            return true;
          } else {
            console.log("Please enter a vale role title");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "salary",
        message: "What is this role's salary?",
        validate: (salary) => {
          if (!isNaN(salary)) {
            return true;
          } else {
            console.log(" Please enter a valid salary.");
            return false;
          }
        },
      },
    ])

    .then((answer) => {
      const params = [answer.role, answer.salary];

      const grabDept = `SELECT id, deptName from department`;

      connection.query(grabDept, (err, res) => {
        if (err) throw err;

        const dept = res.map(({ deptName, id }) => ({
          name: deptName,
          value: id,
        }));

        if (dept === {}) {
          inquirer
            .prompt([
              {
                type: "confirm",
                name: "addNewDept",
                message: "No departments added, would you like to add one?",
                default: true,
              },
            ])
            .then((addNewDept) => {
              if (addNewDept === true) {
                addDept();
              } else prompt();
            });
        } else
          inquirer
            .prompt([
              {
                type: "list",
                name: "dept",
                message: "What department is this role in?",
                choices: dept,
              },
            ])
            .then((answer) => {
              const dept = answer.dept;

              params.push(dept);

              const sql = `insert into roles (title, salary, deptID)
                    values (?, ?, ?);`;
              connection.query(sql, params, (err, res) => {
                if (err) throw err;
                console.table(`Added ${answer.role} to roles`);
                viewRoles();
              });
            });
      });
    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the employee's first name?",
        validate: (firstName) => {
          if (firstName) {
            return true;
          } else {
            console.log("Please enter a name");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
        validate: (lastName) => {
          if (lastName) {
            return true;
          } else {
            console.log("Please enter a name");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      params = [answer.firstName, answer.lastName];

      const grabRoles = `SELECT roles.id, roles.title FROM employee_db.roles`;

      connection.query(grabRoles, (err, res) => {
        if (err) throw err;

        const roles = res.map(({ id, title }) => ({ name: title, value: id }));

        inquirer
          .prompt([
            {
              type: "list",
              name: "roles",
              message: "What is the employee's role?",
              choices: roles,
            },
          ])
          .then((answer) => {
            const role = answer.roles;

            params.push(role);

            const managerSQL = "SELECT * FROM employee";

            connection.query(managerSQL, (err, res) => {
              if (err) throw err;

              const managers = res.map(({ id, firstName, lastName }) => ({
                name: `${firstName} ${lastName}`,
                value: id,
              }));

              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "manager",
                    message: "Who is the employee's manager?",
                    choices: managers,
                  },
                ])
                .then((answer) => {
                  const manager = answer.manager;
                  params.push(manager);

                  const deptSQL = "SELECT * FROM department";

                  connection.query(deptSQL, (err, res) => {
                    if (err) throw err;

                    const departments = res.map(({ id, deptName }) => ({
                      name: deptName,
                      value: id,
                    }));

                    inquirer
                      .prompt([
                        {
                          type: "list",
                          name: "department",
                          message: "What department is the employee in?",
                          choices: departments,
                        },
                      ])
                      .then((answer) => {
                        const department = answer.department;
                        params.push(department);

                        const sql = `INSERT into employee (firstName, lastName, roleID, managerID, deptID) VALUES (?, ?, ?, ?, ?)`;

                        connection.query(sql, params, (err, res) => {
                          if (err) throw err;

                          console.log(`Employee added`);

                          viewEmployees();
                        });
                      });
                  });
                });
            });
          });
      });
    });
}

function updateEmployee() {
  const sql = `SELECT * FROM employee`;

  connection.query(sql, (err, res) => {
    if (err) throw err;

    const employeeList = res.map(({ id, firstName, lastName }) => ({
      name: `${firstName} ${lastName}`,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "name",
          message: "Which employee would you like to update?",
          choices: employeeList,
        },
      ])

      .then((answer) => {
        const employee = answer.name;
        const params = [];

        const roleSQL = `SELECT * from roles`;

        connection.query(roleSQL, (err, res) => {
          if (err) throw err;

          const roles = res.map(({ id, title }) => ({
            name: title,
            value: id,
          }));

          roles.push(addRole);

          inquirer
            .prompt([
              {
                type: "list",
                name: "role",
                message: "What is the employee's new role?",
                choices: roles,
              },
            ])

            .then((answer) => {
              const role = answer.role;

              params.push(role);
              params.push(employee);

              console.log(params);

              const sql = "UPDATE employee SET roleID = ? WHERE id = ?";

              connection.query(sql, params, (err, res) => {
                if (err) throw err;

                console.log("Employee role updated");

                viewEmployees();
              });
            });
        });
      });
  });
}

function updateManager() {
  const sql = `SELECT * FROM employee`;

  connection.query(sql, (err, res) => {
    if (err) throw err;

    const employees = res.map(({ id, firstName, lastName }) => ({
      name: `${firstName} ${lastName}`,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "employeeName",
          message: "Which employee would you like to update?",
          choices: employees,
        },
      ])
      .then((answer) => {
        const employee = answer.name;

        managerSQL = `SELECT * FROM employee WHERE isManager = TRUE`;

        connection.query(managerSQL, (err, res) => {
          if (err) throw err;

          const managers = res.map(({ id, firstName, lastName }) => ({
            name: `${firstName} ${lastName}`,
            value: id,
          }));

          inquirer
            .prompt([
              {
                type: "list",
                name: "manager",
                message: "Who is the employee's manager?",
                choices: managers,
              },
            ])
            .then((answer) => {
              const manager = answer.manager;
              const params = [];

              params.push(manager);
              params.push(employee);

              const sql = `UPDATE employee SET managerID = ? WHERE id = ?`;

              connection.query(sql, (err, res) => {
                if (err) throw err;
                console.log("Employee's manager updated");
                viewEmployees();
              });
            });
        });
      });
  });
}

function viewByManager() {
  const managerSQL = `SELECT * FROM employee WHERE isManager = TRUE`;

  connection.query(managerSQL, (err, res) => {
    if (err) throw err;

    const managers = res.map(({ id, firstName, lastName }) => ({
      name: `${firstName} ${lastName}`,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "manager",
          message: "Which manager's employees would you like to view?",
          choices: managers,
        },
      ])

      .then((answer) => {
        const manager = answer.manager;
        const params = [];

        params.push(manager);

        sql = `
            SELECT e.id, e.firstName as 'First name', 
                e.lastName as 'Last Name', r.title as 'Title', 
                d.deptName as 'Department', r.salary as 'Salary'
                
                FROM employee e
                JOIN roles r
                    ON e.roleID = r.id
                JOIN department d
                    ON r.deptID = d.id
                
                WHERE managerID = ?;`;

        connection.query(sql, params, (err, res) => {
          if (err) throw err;

          console.table(res);
          prompt();
        });
      });
  });
}

function viewByDept() {
  const sql = `SELECT * FROM department`;

  connection.query(sql, (err, res) => {
    if (err) throw err;

    const departments = res.map(({ id, deptName }) => ({
      name: deptName,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "department",
          message: "What department would you like to view?",
          choices: departments,
        },
      ])
      .then((answer) => {
        const department = answer.department;

        const params = [];

        params.push(department);

        const sql = `SELECT e.id, e.firstName as 'First name', 
                e.lastName as 'Last Name', r.title as 'Title', 
                r.salary as 'Salary', 
                concat(m.firstName,' ', m.lastName) as 'Manager'
                
                FROM employee e
                JOIN roles r
                    ON e.roleID = r.id
                JOIN department d
                    ON r.deptID = d.id
                LEFT JOIN employee m
                    ON e.managerID = m.id
                    
                WHERE r.deptID = ?;`;

        connection.query(sql, params, (err, res) => {
          if (err) throw err;

          console.table(res);
          prompt();
        });
      });
  });
}
