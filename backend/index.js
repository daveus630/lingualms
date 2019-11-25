require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 7000;
const log = console.log;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: [
      "https://lingua-leave-management-system.appspot.com",
      "https://lingua-leave-management-system.appspot.com/dashboard",
      "http://localhost:4200"
    ]
  })
);

const agents = require("./routes/agents");
const supervisors = require("./routes/supervisors");
const projects = require("./routes/projects");
const requests = require("./routes/requests");
const holidays = require("./routes/holidays");

app.use("/api/agents/", agents);
app.use("/api/supervisors/", supervisors);
app.use("/api/projects/", projects);
app.use("/api/requests/", requests);
app.use("/api/holidays/", holidays);

app.listen(port, () => log("Server is listening on port", port));
