
import pool from "../config/db.js";

export const getEmployees = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM employees");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// export const getEmployees = async (req, res) => {
//   const employees = await Employee.findAll();
//   res.json(employees);
// };

export const getEmployeeById = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM employees WHERE id = $1", [
      req.params.id,
    ]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};


export const createEmployee = async (req, res) => {
  try {
    const { name, email, salary } = req.body;
    const result = await pool.query(
      "INSERT INTO employees (name, email, salary) VALUES ($1, $2, $3) RETURNING *",
      [name, email, salary]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};


export const updateEmployee = async (req, res) => {
  try {
    const { name, email, salary } = req.body;
    const result = await pool.query(
      "UPDATE employees SET name=$1, email=$2, salary=$3 WHERE id=$4 RETURNING *",
      [name, email, salary, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    await pool.query("DELETE FROM employees WHERE id = $1", [req.params.id]);
    res.json({ message: "Employee deleted" });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
