import React, { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [adminid, setAdminid] = useState('');  // State for Admin ID
  const [apassword, setApassword] = useState('');  // State for Admin Password
  const navigate = useNavigate();  // Use navigate hook to redirect

  // Handle login logic
  const handleLogin = async () => {
    try {
      console.log("Admin ID: ", adminid);  // Log Admin ID
      console.log("Password: ", apassword);  // Log Password

      // Send request to the backend for admin login
      const response = await axios.post('http://localhost:5000/registration/adminlogin', { adminid, apassword });
      console.log("Response from backend:", response.data);  // Log response data
      alert(response.data.message);

      // Navigate to dashboard or other route on successful login
      if (response.data.message === "Login successful") {
        navigate('/admin/dashboard'); // Replace with actual dashboard path
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error);  // Log errors
      alert(error.response?.data?.message || 'Login failed, please try again.');
    }
  };

  // Navigate to Register page
  const handleNavigateToRegister = () => {
    navigate('/admin/register');
  };

  return (
    <Container>
      <Typography variant="h4">Admin Login</Typography>
      <TextField
        label="Admin ID"
        value={adminid}
        onChange={(e) => setAdminid(e.target.value)}  // Update adminid state
        fullWidth
      />
      <TextField
        label="Password"
        type="password"
        value={apassword}
        onChange={(e) => setApassword(e.target.value)}  // Update apassword state
        fullWidth
      />
      <Button variant="contained" onClick={handleLogin}>Login</Button>
      <Button variant="outlined" onClick={handleNavigateToRegister} style={{ marginTop: '10px' }}>
        Register as Admin
      </Button>
    </Container>
  );
};

export default AdminLogin;
