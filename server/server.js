const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 8001; // Port fixed

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/admin")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });

// Job Schema & Model
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  experience: { type: String, default: "0" },
  skills: { type: String, required: true },
  recruiterEmail: { type: String, required: true },
});

const Job = mongoose.model("jobs", jobSchema);

// Routes
app.get("/admin/jobs", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch jobs", error });
  }
});

app.post("/admin/jobs", async (req, res) => {
  try {
    const { title, description, experience, skills, recruiterEmail } = req.body;

    if (!title || !skills || !recruiterEmail) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const newJob = new Job({ title, description, experience, skills, recruiterEmail });
    await newJob.save();
    res.status(201).json({ message: "Job added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to add job", error });
  }
});

app.delete("/admin/jobs/:id", async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete job", error });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
