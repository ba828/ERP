const db = require("../config/db");

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM employees ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new employee
exports.createEmployee = async (req, res) => {
  try {
    const {
      emp_code,
      name,
      email,
      phone,
      department,
      role,
      salary,
      joining_date,
    } = req.body;

    await db.query(
      `INSERT INTO employees
      (emp_code, name, email, phone, department, role, salary, joining_date)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        emp_code,
        name,
        email,
        phone,
        department,
        role,
        salary,
        joining_date,
      ]
    );

    res.json({ message: "Employee added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      department,
      role,
      salary,
      joining_date,
      status,
    } = req.body;

    await db.query(
      `UPDATE employees
       SET name=$1,
           email=$2,
           phone=$3,
           department=$4,
           role=$5,
           salary=$6,
           joining_date=$7,
           status=$8
       WHERE id=$9`,
      [
        name,
        email,
        phone,
        department,
        role,
        salary,
        joining_date,
        status,
        id,
      ]
    );

    res.json({ message: "Employee updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Soft delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      "UPDATE employees SET status='Inactive' WHERE id=$1",
      [id]
    );

    res.json({ message: "Employee deactivated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
