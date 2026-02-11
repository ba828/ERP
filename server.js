const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

db.query("SELECT NOW()", (err, res) => {
  if (err) console.error(err);
  else console.log("DB connected at:", res.rows[0].now);
});

app.get("/", (req, res) => {
  res.send("Vistara ERP Backend Running 🚀");
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
app.use("/api/employees", require("./routes/employeeRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));

