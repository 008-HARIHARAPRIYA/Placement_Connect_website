import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";
import JobManagement from './JobManagement'; // Import the JobManagement component

function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [skillsFilter, setSkillsFilter] = useState("");
  const [cgpaFilter, setCgpaFilter] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0); // State to manage the selected tab

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://localhost:8001/admin/students");
      setStudents(response.data);
      setFilteredStudents(response.data);
    } catch (err) {
      setError("Failed to fetch student details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSkillsFilterChange = (e) => setSkillsFilter(e.target.value);
  const handleCgpaFilterChange = (e) => setCgpaFilter(e.target.value);

  const applyFilters = () => {
    let filtered = students;

    if (skillsFilter) {
      filtered = filtered.filter((student) => {
        const skills = Array.isArray(student.skills) ? student.skills.join(", ") : student.skills || "";
        return skills.toLowerCase().includes(skillsFilter.toLowerCase());
      });
    }

    if (cgpaFilter) {
      filtered = filtered.filter((student) => student.cgpa >= parseFloat(cgpaFilter));
    }

    setFilteredStudents(filtered);
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Box sx={{ marginBottom: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography
          variant="h4"
          sx={{
            background: "linear-gradient(45deg,rgb(223, 78, 153),rgb(157, 26, 222),rgb(4, 4, 240))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "bold",
            textAlign: "center",
            letterSpacing: 1.5,
          }}
        >
          Admin Dashboard
        </Typography>
      </Box>

      

      <Tabs
  value={tabIndex}
  onChange={handleTabChange}
  centered
  sx={{
    borderRadius: "8px",
    "& .MuiTabs-indicator": {
      backgroundColor: "rgb(157, 26, 222)", // Indicator line color
    },
  }}
>
  <Tab
    label="Filter Students"
    sx={{
      color: "white", // Default text color
      fontWeight: "bold",
      "&.Mui-selected": {
        color: "rgb(157, 26, 222)", // Text color when selected
      },
    }}
  />
  <Tab
    label="Job Management"
    sx={{
      color: "white", // Default text color
      fontWeight: "bold",
      "&.Mui-selected": {
        color: "rgb(157, 26, 222)", // Text color when selected
      },
    }}
  />
</Tabs>

      {tabIndex === 0 && (
        <Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", alignItems: "center", marginBottom: 2 }}>
            <FormControl sx={{ width: "250px", height: "50px", backgroundColor: "#E3F2FD", borderRadius: "8px" }}>
              <InputLabel>Skills</InputLabel>
              <Select value={skillsFilter} onChange={handleSkillsFilterChange} label="Skills">
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Java">Java</MenuItem>
                <MenuItem value="Python">Python</MenuItem>
                <MenuItem value="JavaScript">JavaScript</MenuItem>
                <MenuItem value="React">React</MenuItem>
                <MenuItem value="Node.js">Node.js</MenuItem>
              </Select>
            </FormControl>

            <TextField
              variant="outlined"
              type="number"
              value={cgpaFilter}
              onChange={handleCgpaFilterChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">Minimum CGPA</InputAdornment>,
              }}
              sx={{ width: "250px", backgroundColor: "#E3F2FD", borderRadius: "8px", height: "50px" }}
            />

            <Button
              variant="contained"
              sx={{
                background: "linear-gradient(45deg,rgb(45, 28, 200),rgb(38, 137, 212),rgb(152, 14, 199))",
                color: "#fff",
                fontWeight: "bold",
                height: "56px", // Matches input fields
                minWidth: "150px", // Ensures button size consistency
                "&:hover": {
                  background: "linear-gradient(45deg,rgb(223, 78, 153),rgb(157, 26, 222),rgb(4, 4, 240))",
                },
              }}
              onClick={applyFilters}
            >
              Apply Filters
            </Button>
          </Box>

          {error && (
            <Box sx={{ marginBottom: 2 }}>
              <Typography color="error" variant="body2">{error}</Typography>
              <Button variant="contained" onClick={fetchStudents} sx={{ marginTop: 1 }}>Retry</Button>
            </Box>
          )}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="student details table">
                <TableHead>
                  <TableRow sx={{ background: "linear-gradient(45deg, #0f0c29, #302b63, #24243e)" }}>
                    <TableCell sx={{ color: "rgb(130, 8, 113)", fontWeight: "bold" }}>Name</TableCell>
                    <TableCell sx={{ color: "#42A5F5", fontWeight: "bold" }}>CGPA</TableCell>
                    <TableCell sx={{ color: "#66BB6A", fontWeight: "bold" }}>Skills</TableCell>
                    <TableCell sx={{ color: "rgb(130, 8, 113)", fontWeight: "bold" }}>Email</TableCell>
                    <TableCell sx={{ color: "rgb(130, 8, 113)", fontWeight: "bold" }}>Mobile</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <TableRow key={student._id}>
                        <TableCell>{student.studentname}</TableCell>
                        <TableCell sx={{ color: "#42A5F5", fontWeight: "bold" }}>{student.cgpa}</TableCell>
                        <TableCell sx={{ color: "#66BB6A", fontWeight: "bold" }}>
                          {Array.isArray(student.skills) ? student.skills.join(", ") : student.skills || "N/A"}
                        </TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.mobile}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No students found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      {tabIndex === 1 && <JobManagement />}
    </Container>
  );
}

export default AdminDashboard;