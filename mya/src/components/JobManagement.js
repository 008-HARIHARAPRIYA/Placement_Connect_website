import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Card,
  CardContent
} from "@mui/material";

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    experience: "",
    skills: "",
    recruiterEmail: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8001/admin/jobs");
      setJobs(response.data);
    } catch (err) {
      setError("Failed to fetch job listings.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob((prev) => ({ ...prev, [name]: value }));
  };

  const addJob = async () => {
    if (!newJob.title || !newJob.skills || !newJob.recruiterEmail) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await axios.post("http://localhost:8001/admin/jobs", newJob);
      fetchJobs();
      setNewJob({ title: "", description: "", experience: "", skills: "", recruiterEmail: "" });
    } catch (err) {
      setError("Failed to add job.");
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8001/admin/jobs/${id}`);
      fetchJobs();
    } catch (err) {
      setError("Failed to delete job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ marginTop: 4, display: "flex", justifyContent: "center" }}>
      <Card sx={{ width: "80%", padding: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            Job Management
          </Typography>

          {/* Job Input Form */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 3 }}>
            <TextField label="Job Title" name="title" value={newJob.title} onChange={handleInputChange} fullWidth />
            <TextField label="Description" name="description" value={newJob.description} onChange={handleInputChange} fullWidth multiline rows={3} />
            <TextField label="Experience (Years)" name="experience" value={newJob.experience} onChange={handleInputChange} fullWidth />
            <TextField label="Skills Required" name="skills" value={newJob.skills} onChange={handleInputChange} fullWidth />
            <TextField label="Recruiter Email" name="recruiterEmail" value={newJob.recruiterEmail} onChange={handleInputChange} fullWidth />
            <Button variant="contained" color="primary" onClick={addJob} disabled={loading}>
              {loading ? "Adding..." : "Add Job"}
            </Button>
            {error && <Typography color="error">{error}</Typography>}
          </Box>

          {/* Job Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><b>Title</b></TableCell>
                  <TableCell><b>Description</b></TableCell>
                  <TableCell><b>Experience</b></TableCell>
                  <TableCell><b>Skills</b></TableCell>
                  <TableCell><b>Recruiter Email</b></TableCell>
                  <TableCell><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobs.length > 0 ? (
                  jobs.map((job) => (
                    <TableRow key={job._id}>
                      <TableCell>{job.title}</TableCell>
                      <TableCell>{job.description}</TableCell>
                      <TableCell>{job.experience}</TableCell>
                      <TableCell>{job.skills}</TableCell>
                      <TableCell>{job.recruiterEmail}</TableCell>
                      <TableCell>
                        <Button color="error" onClick={() => deleteJob(job._id)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No jobs found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default JobManagement;
