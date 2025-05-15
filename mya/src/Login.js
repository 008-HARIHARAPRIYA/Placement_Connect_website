import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, CircularProgress, Container, Typography, Box, Card, CardContent } from '@mui/material';

function Login() {
  const [adminid, setAdminid] = useState('');
  const [apassword, setApassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await axios.post('http://localhost:3001/api/login', {
        adminid,
        apassword,
      });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'white' }}>
        <Card sx={{ width: '100%', padding: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" align="center" gutterBottom>
              Admin Login
            </Typography>
            <form onSubmit={handleLogin} style={{ width: '100%' }}>
              <TextField
                label="Admin ID"
                variant="outlined"
                fullWidth
                value={adminid}
                onChange={(e) => setAdminid(e.target.value)}
                required
                margin="normal"
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={apassword}
                onChange={(e) => setApassword(e.target.value)}
                required
                margin="normal"
              />
              {error && <Typography color="error" variant="body2">{error}</Typography>}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginTop: 2 ,
                  backgroundColor: '#191654', // Set button background color to #0f0c29
    '&:hover': {
      backgroundColor: '#4a00e0', // Optional: a slightly lighter color for hover effect
    },
                }}
                disabled={loading} // Disable the button while loading
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
              </Button>
            </form>

            <Box sx={{ marginTop: 2, textAlign: 'center' }}>
              <Typography variant="body2">
                Don't have an account? <a href="/admin-register">Register</a>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default Login;