import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './admincss.css';
const BASE_URL = 'https://placement-connect-website-1.onrender.com';

const AdminRegister = () => {
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and registration
  const [formData, setFormData] = useState({
    adminid: '',
    apassword: '',
    adminname: '',
    aemail: '',
    amobile: '',
  });

  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const url = isLogin
    //   ? 'http://localhost:8001/admin/login'
    //   : 'http://localhost:8001/admin/register';
const url = isLogin
  ? `${BASE_URL}/admin/login`
  : `${BASE_URL}/admin/register`;
    const payload = isLogin
      ? { adminid: formData.adminid, apassword: formData.apassword }
      : formData;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        if (isLogin) {
          console.log('Logged in admin:', result.admin);
          navigate('/admin-dashboard'); // Navigate to AdminDashboard after login
        }
      } else {
        alert(`Error: ${result.error || 'Unknown error occurred.'}`);
      }
    } catch (err) {
      console.error('Network error:', err);
      alert('Network error occurred while processing your request.');
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-card">
        <h2 className="admin-title">{isLogin ? 'Admin Login' : 'Admin Registration'}</h2>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="adminid">Admin ID:</label>
            <input
              type="text"
              id="adminid"
              name="adminid"
              value={formData.adminid}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="apassword">Password:</label>
            <input
              type="password"
              id="apassword"
              name="apassword"
              value={formData.apassword}
              onChange={handleChange}
              required
            />
          </div>
          {!isLogin && (
            <>
              <div>
                <label htmlFor="adminname">Admin Name:</label>
                <input
                  type="text"
                  id="adminname"
                  name="adminname"
                  value={formData.adminname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="aemail">Email:</label>
                <input
                  type="email"
                  id="aemail"
                  name="aemail"
                  value={formData.aemail}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="amobile">Mobile Number:</label>
                <input
                  type="text"
                  id="amobile"
                  name="amobile"
                  value={formData.amobile}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}
          <button type="submit" className="admin-button">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <div className="admin-link">
          <a href="#" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Need an account? Register here' : 'Already have an account? Login here'}
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
