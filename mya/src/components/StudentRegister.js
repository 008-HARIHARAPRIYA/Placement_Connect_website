import React, { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentRegister = () => {
  const [studentid, setStudentid] = useState('');
  const [studentname, setStudentname] = useState('');
  const [spassword, setSpassword] = useState('');
  const [skills, setSkills] = useState('');
  const [saddress, setSaddress] = useState('');
  const [cgpa, setCgpa] = useState('');
  const navigate = useNavigate();

  // Handle registration logic
  const handleRegister = async () => {
    if (!studentid || !studentname || !spassword || !skills || !saddress || !cgpa) {
      alert("All fields are required.");
      return;
    }

    if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
      alert("Please enter a valid CGPA between 0 and 10.");
      return;
    }

    const skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill !== '');

    if (skillsArray.length === 0) {
      alert('Skills cannot be empty.');
      return;
    }

    const studentData = { studentid, studentname, spassword, skills: skillsArray, saddress, cgpa };

    try {
      const response = await axios.post('http://localhost:5000/registration/studentsignup', studentData);

      if (response.data.message === "Student registered successfully") {
        alert(response.data.message);
        navigate('/student/login'); // Correct navigation to login page
      } else {
        alert("Registration failed: " + response.data.message);
      }
    } catch (error) {
      console.error('Error during student registration:', error);
      if (error.response && error.response.data.message === "User already exists") {
        alert("A student with this ID already exists. Please try again with a different ID.");
      } else {
        alert('An error occurred, please try again.');
      }
    }
  };

  // Navigate to Login page if not registered
  const handleNavigateToLogin = () => {
    navigate('/student/login');
  };

  return (
    <Container>
      <Typography variant="h4">Student Register</Typography>
      <TextField
        label="Student ID"
        value={studentid}
        onChange={(e) => setStudentid(e.target.value)}
        fullWidth
        style={{ marginBottom: '15px' }}
      />
      <TextField
        label="Student Name"
        value={studentname}
        onChange={(e) => setStudentname(e.target.value)}
        fullWidth
        style={{ marginBottom: '15px' }}
      />
      <TextField
        label="Password"
        type="password"
        value={spassword}
        onChange={(e) => setSpassword(e.target.value)}
        fullWidth
        style={{ marginBottom: '15px' }}
      />
      <TextField
        label="Skills (comma separated)"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
        fullWidth
        style={{ marginBottom: '15px' }}
      />
      <TextField
        label="Address"
        value={saddress}
        onChange={(e) => setSaddress(e.target.value)}
        fullWidth
        style={{ marginBottom: '15px' }}
      />
      <TextField
        label="CGPA"
        value={cgpa}
        onChange={(e) => setCgpa(e.target.value)}
        fullWidth
        style={{ marginBottom: '15px' }}
      />
      <Button variant="contained" onClick={handleRegister} style={{ marginBottom: '15px' }}>
        Register
      </Button>

      <Button
        variant="outlined"
        onClick={handleNavigateToLogin}
        style={{ marginTop: '10px' }}
      >
        Login as Student
      </Button>
    </Container>
  );
};

export default StudentRegister;
