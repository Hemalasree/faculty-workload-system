const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const facultyRoutes = require("./routes/faculty.routes");
const subjectRoutes = require("./routes/subject.routes");

app.use("/api/faculty", facultyRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/workload", require("./routes/workloadRoutes"));

app.get("/", (req, res) => res.send("Faculty Workload Backend Running"));

app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});
