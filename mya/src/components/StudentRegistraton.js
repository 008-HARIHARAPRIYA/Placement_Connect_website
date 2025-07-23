import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentRegister.css';
const BASE_URL = 'https://placement-connect-website-1.onrender.com';

const StudentRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    studentid: '',
    spassword: '',
    studentname: '',
    semail: '',
    smobile: '',
    cgpa: '',
    skills: '',
    academicYear: '',
    address: '',
    //companyApplied: '',
    //socialLink: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

const url = isLogin
  ? `${BASE_URL}/student/login`
  : `${BASE_URL}/student/register`;

    // const url = isLogin
    //   ? 'http://localhost:8001/student/login'
    //   : 'http://localhost:8001/student/register';

    const payload = isLogin
      ? {
          studentid: formData.studentid,
          spassword: formData.spassword,
        }
      : {
          studentid: formData.studentid,
          spassword: formData.spassword,
          studentname: formData.studentname,
          semail: formData.semail,
          smobile: formData.smobile,
          cgpa: formData.cgpa,
          skills: formData.skills.split(',').map(skill => skill.trim()), // Convert skills string to an array
          academicYear: formData.academicYear,
          address: formData.address,
          //companyApplied: formData.companyApplied,
         // socialLink: formData.socialLink,
        };

    console.log('Payload being sent:', payload);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log('Server response:', result);

      if (response.ok) {
        alert(result.message);
        if (isLogin) {
          localStorage.setItem('studentid', formData.studentid);
          //console.log('Logged in student:', result.student);
          navigate('/Student-Dashboard', { state: { studentid: formData.studentid } });
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
    <div className="student-container">
      <div className="student-card">
        <h2 className="student-title">{isLogin ? 'Student Login' : 'Student Registration'}</h2>
        <form className="student-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="studentid">Student ID:</label>
            <input
              type="text"
              id="studentid"
              name="studentid"
              value={formData.studentid}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="spassword">Password:</label>
            <input
              type="password"
              id="spassword"
              name="spassword"
              value={formData.spassword}
              onChange={handleChange}
              required
            />
          </div>
          {!isLogin && (
            <>
              <div>
                <label htmlFor="studentname">Student Name:</label>
                <input
                  type="text"
                  id="studentname"
                  name="studentname"
                  value={formData.studentname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="semail">Email:</label>
                <input
                  type="email"
                  id="semail"
                  name="semail"
                  value={formData.semail}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="smobile">Mobile Number:</label>
                <input
                  type="text"
                  id="smobile"
                  name="smobile"
                  value={formData.smobile}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="cgpa">CGPA:</label>
                <input
                  type="number"
                  id="cgpa"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleChange}
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label htmlFor="skills">Skills (comma-separated):</label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g., JavaScript, Python, React"
                  required
                />
              </div>
              <div>
                <label htmlFor="academicYear">Academic Year:</label>
                <input
                  type="text"
                  id="academicYear"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleChange}
                  placeholder="e.g., 2024"
                  required
                />
              </div>
              <div>
                <label htmlFor="address">Address:</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  required
                ></textarea>
              </div>
             
            </>
          )}
          <button type="submit" className="student-button">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <div className="student-link">
          <button
            className="link-button"
            onClick={(e) => {
              e.preventDefault();
              setIsLogin(!isLogin);
            }}
          >
            {isLogin ? 'Need an account? Register here' : 'Already have an account? Login here'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;
