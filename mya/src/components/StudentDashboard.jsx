import React, { useEffect, useState } from 'react';
import './StudentDashboard.css';


import { Typography, Card, CardContent } from "@mui/material";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [companyDetails, setCompanyDetails] = useState([]);
  const [adminJobs, setAdminJobs] = useState([]);
  const [isFetchingCompanies, setIsFetchingCompanies] = useState(false);
  const [newCompany, setNewCompany] = useState({
    companyName: '',
    position: '',
    status: 'Pending',
  });

  useEffect(() => {
    fetchStudentDetails();
    fetchAdminJobs();
  }, []);

  const fetchStudentDetails = async () => {
    const studentId = localStorage.getItem('studentid');
    if (!studentId) {
      setError('No student ID found. Please log in.');
      setIsLoading(false);
      return;
    }

    try {
      setIsFetchingCompanies(true);
      const response = await fetch(`http://localhost:5000/student/dashboard/${studentId}`);
      const data = await response.json();

      if (response.ok) {
        setStudent(data);
        setCompanyDetails(data.companyDetails || []);
      } else {
        setError(data.error || 'Unable to fetch student details.');
      }
    } catch (err) {
      setError('Network error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
      setIsFetchingCompanies(false);
    }
  };

  const fetchAdminJobs = async () => {
    try {
      const response = await fetch('http://localhost:8001/admin/jobs');
      const data = await response.json();

      if (response.ok) {
        setAdminJobs(data || []);
      } else {
        console.error('Failed to fetch admin jobs:', data.error);
      }
    } catch (err) {
      console.error('Network error fetching admin jobs:', err);
    }
  };

  const handleInputChange = (e) => {
    setNewCompany({ ...newCompany, [e.target.name]: e.target.value });
  };

  const handleAddCompany = async () => {
    if (!newCompany.companyName.trim() || !newCompany.position.trim()) {
      alert('Please fill all fields.');
      return;
    }

    const studentId = localStorage.getItem('studentid');
    try {
      const response = await fetch(`http://localhost:5000/student/${studentId}/companyDetails`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCompany),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save company details.');
      }

      setNewCompany({ companyName: '', position: '', status: 'Pending' });
      fetchStudentDetails();
    } catch (error) {
      alert(error.message);
    }
  };

  if (error) return <div className="error-message">{error}</div>;
  if (isLoading) return <div className="loading"><span>Loading...</span></div>;

  return (
    <div className="dashboard">
      {/* Student Details Card */}
      <div className="student-card">
        <h1>Welcome, {student?.studentname}!</h1>
        <p><strong>Email:</strong> {student?.email}</p>
        <p><strong>Mobile:</strong> {student?.mobile}</p>
        <p><strong>CGPA:</strong> {student?.cgpa}</p>
        <p><strong>Academic Year:</strong> {student?.academicYear}</p>
        <p><strong>Skills:</strong> {student?.skills?.join(', ')}</p>
        <p><strong>Address:</strong> {student?.address}</p>
      </div>

      {/* Company Section */}
      <div className="company-section">
        {/* Input Form for Adding Company Details */}
        <div className="application-form">
          <h3>Add New Company</h3>
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={newCompany.companyName}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="position"
            placeholder="Position"
            value={newCompany.position}
            onChange={handleInputChange}
          />
          <select name="status" value={newCompany.status} onChange={handleInputChange}>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button className="add-btn" onClick={handleAddCompany}>Add Company</button>
        </div>

        {/* Company Details Table */}
        <div className="application-table">
          <Typography
            variant="h4"
            sx={{
              background: "linear-gradient(45deg, rgb(223, 78, 153), rgb(157, 26, 222), rgb(4, 4, 240))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "bold",
              textAlign: "center",
              letterSpacing: 1.5,
            }}
          >
            Companies Applied
          </Typography>
          {isFetchingCompanies ? (
            <div className="loading">Fetching companies...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>S. No.</th>
                  <th>Company Name</th>
                  <th>Position</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(companyDetails) && companyDetails.length > 0 ? (
                  companyDetails.map((company, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{company.companyName || 'N/A'}</td>
                      <td>{company.position || 'N/A'}</td>
                      <td>{company.status || 'Pending'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No company details found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Admin Jobs Section */}
      <div className="admin-jobs">
        <Typography
          variant="h4"
          sx={{
            background: "linear-gradient(45deg, rgb(223, 78, 153), rgb(157, 26, 222), rgb(4, 4, 240))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "bold",
            textAlign: "center",
            letterSpacing: 1.5,
          }}
        >
          Jobs Posted by Admin
        </Typography>
        <div className="jobs-container">
          {Array.isArray(adminJobs) && adminJobs.length > 0 ? (
            adminJobs.map((job, index) => (
              <Card 
                key={index} 
                sx={{ margin: "16px 0", padding: "16px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">Job #{index + 1}</Typography>
                  <Typography><strong>Company Name:</strong> {job.title || 'N/A'}</Typography>
                  <Typography><strong>Position:</strong> {job.description || 'N/A'}</Typography>
                  <Typography><strong>Requirements:</strong> {job.experience || 'N/A'}, Skills: {job.skills || 'N/A'}</Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography>No jobs posted by admin.</Typography>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
