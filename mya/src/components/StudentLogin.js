import React, { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentLogin = () => {
  const [studentid, setStudentid] = useState('');  // State for Student ID
  const [spassword, setSpassword] = useState('');  // State for Student Password
  const navigate = useNavigate();  // React Router hook to navigate

  // Handle login logic
  const handleLogin = async () => {
    try {
      // Send request to the backend for student login
      const response = await axios.post('http://localhost:8001/registration/studentlogin', { studentid, spassword });
      alert(response.data.message);  // Display success message

      // Navigate to the student's dashboard or another page on successful login
      if (response.data.message === "Login successful") {
        navigate('/student/dashboard');  // Replace with actual dashboard path
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error);  // Log errors
      alert(error.response?.data?.message || 'Login failed, please try again.');
    }
  };

  // Navigate to Register page
  const handleNavigateToRegister = () => {
    navigate('/student/register');
  };

  return (
    <Container>
      <Typography variant="h4">Student Login</Typography>
      <TextField
        label="Student ID"
        value={studentid}
        onChange={(e) => setStudentid(e.target.value)}  // Update studentid state
        fullWidth
        style={{ marginBottom: '15px' }}
      />
      <TextField
        label="Password"
        type="password"
        value={spassword}
        onChange={(e) => setSpassword(e.target.value)}  // Update spassword state
        fullWidth
        style={{ marginBottom: '15px' }}
      />
      <Button variant="contained" onClick={handleLogin}>Login</Button>

      <Button
        variant="outlined"
        onClick={handleNavigateToRegister}
        style={{ marginTop: '10px' }}
      >
        Register as Student
      </Button>
    </Container>
  );
};

export default StudentLogin;
