const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/faculty", require("./routes/facultyRoutes"));
app.use("/api/subjects", require("./routes/subjectRoutes"));
app.use("/api/workload", require("./routes/workloadRoutes"));

app.get("/", (req, res) => {
  res.send("Faculty Workload Backend Running")
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});
