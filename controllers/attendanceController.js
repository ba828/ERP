const db = require("../config/db");

// CHECK-IN
exports.checkIn = async (req, res) => {
  try {
    const employee_id = req.user.employee_id;
    const today = new Date().toISOString().split("T")[0];

    const existing = await db.query(
      "SELECT * FROM attendance WHERE employee_id=$1 AND date=$2",
      [employee_id, today]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    await db.query(
      `INSERT INTO attendance (employee_id, date, check_in, status)
       VALUES ($1,$2,CURRENT_TIMESTAMP,'Present')`,
      [employee_id, today]
    );

    res.json({ message: "Check-in successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CHECK-OUT
exports.checkOut = async (req, res) => {
  try {
    const employee_id = req.user.employee_id;
    const today = new Date().toISOString().split("T")[0];

    const record = await db.query(
      "SELECT * FROM attendance WHERE employee_id=$1 AND date=$2",
      [employee_id, today]
    );

    if (record.rows.length === 0) {
      return res.status(400).json({ message: "Check-in first" });
    }

    const checkInTime = record.rows[0].check_in;
    const now = new Date();

    // Calculate hours worked (simple logic)
    const workedHours =
      (now - new Date(`${today}T${checkInTime}`)) / (1000 * 60 * 60);

    const status = workedHours < 4 ? "Half Day" : "Present";

    await db.query(
      `UPDATE attendance
       SET check_out=CURRENT_TIME, status=$1
       WHERE employee_id=$2 AND date=$3`,
      [status, employee_id, today]
    );

    res.json({ message: "Check-out successful", status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// GET today's attendance
exports.getTodayAttendance = async (req, res) => {
  try {
    const employee_id = req.user.employee_id;
    const today = new Date().toISOString().split("T")[0];

    const result = await db.query(
      "SELECT * FROM attendance WHERE employee_id=$1 AND date=$2",
      [employee_id, today]
    );

    if (result.rows.length === 0) {
      return res.json({ status: "Not Checked In" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// MONTHLY REPORT
exports.monthlyReport = async (req, res) => {
  try {
    const employee_id = req.user.employee_id;
    const { month, year } = req.query;

    const result = await db.query(
      `SELECT date, check_in, check_out, status
       FROM attendance
       WHERE employee_id=$1
       AND EXTRACT(MONTH FROM date)=$2
       AND EXTRACT(YEAR FROM date)=$3
       ORDER BY date`,
      [employee_id, month, year]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
