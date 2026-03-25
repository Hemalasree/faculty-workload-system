const express = require("express");
const cors    = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth",          require("./routes/authRoutes"));
app.use("/api/faculty",       require("./routes/facultyRoutes"));
app.use("/api/subjects",      require("./routes/subjectRoutes"));
app.use("/api/departments",   require("./routes/departmentRoutes"));
app.use("/api/allocations",   require("./routes/allocationRoutes"));
app.use("/api/leaves",        require("./routes/leaveRoutes"));
app.use("/api/requests",      require("./routes/requestRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/dashboard",     require("./routes/dashboardRoutes"));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));