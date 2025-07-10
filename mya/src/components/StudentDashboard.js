import React, { useState, useEffect } from 'react';
import './StudentDashboard.css'; // Import the CSS file

const StudentDashboard = () => {
  const [studentDetails, setStudentDetails] = useState(null);
  const [socialLinks, setSocialLinks] = useState([
    { platform: 'LinkedIn', link: 'https://linkedin.com/in/johndoe', editable: false },
    { platform: 'GitHub', link: 'https://github.com/johndoe', editable: false },
  ]);
  const [profilePic, setProfilePic] = useState(null);
  const [applications, setApplications] = useState([
    { company: 'Company A', position: 'Software Engineer', status: 'Pending' },
    { company: 'Company B', position: 'Data Scientist', status: 'Approved' },
    { company: 'Company C', position: 'Product Manager', status: 'Rejected' },
  ]);

  useEffect(() => {
    const studentData = {
      id:'1234',
      name: 'John Doe',
      address:'Madurai',
      cgpa: '8.5',
      profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
      academicYear: 'Sophomore',
      registrationNumber: 'S1234567',
     skills:'designer,programmer'
    };

    setStudentDetails(studentData);
    setProfilePic(studentData.profilePicture);
  }, []);

  // Handle profile picture change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle social link change
  const handleSocialLinkChange = (index, newLink) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index].link = newLink;
    setSocialLinks(updatedLinks);
  };

  // Toggle editable state for social links
  const toggleEditable = (index) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index].editable = !updatedLinks[index].editable;
    setSocialLinks(updatedLinks);
  };

  // Handle application status change
  const handleApplicationStatusChange = (index, newStatus) => {
    const updatedApplications = [...applications];
    updatedApplications[index].status = newStatus;
    setApplications(updatedApplications);
  };

  // Delete an application
  const handleDeleteApplication = (index) => {
    const updatedApplications = applications.filter((_, i) => i !== index);
    setApplications(updatedApplications);
  };

  // Handle adding a new application
  const handleAddApplication = () => {
    const newApplication = { company: '', position: '', status: 'Pending' };
    setApplications([...applications, newApplication]);
  };

  // Delete a social link
  const handleDeleteSocialLink = (index) => {
    const updatedLinks = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(updatedLinks);
  };

  // Handle adding a new social link
  const handleAddSocialLink = () => {
    const newSocialLink = { platform: '', link: '', editable: true };
    setSocialLinks([...socialLinks, newSocialLink]);
  };

  // Edit an application (similar to social link edit)
  const handleEditApplication = (index, field, value) => {
    const updatedApplications = [...applications];
    updatedApplications[index][field] = value;
    setApplications(updatedApplications);
  };

  if (!studentDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Profile Section */}
      <div className="profile-section">
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
            id="profile-pic-upload"
          />
          <label htmlFor="profile-pic-upload">
            <img src={profilePic} alt="Profile" />
          </label>
        </div>
        <div>
          <h2>Welcome, {studentDetails.name}</h2>
          <p><strong>Registration Number:</strong> {studentDetails.id}</p>
          <p><strong>CGPA:</strong> {studentDetails.cgpa}</p>
          <p><strong>Academic Year:</strong> {studentDetails.academicYear}</p>
          <p><strong>Address:</strong> {studentDetails.address}</p>
          <p><strong>Skills:</strong> {studentDetails.skills}</p>
        </div>
      </div>

      {/* Application Table Section */}
      <h3>Applications:</h3>
      <button onClick={handleAddApplication}>+ Add Application</button>
      <table className="application-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Position</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  value={application.company}
                  onChange={(e) => handleEditApplication(index, 'company', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={application.position}
                  onChange={(e) => handleEditApplication(index, 'position', e.target.value)}
                />
              </td>
              <td>
                <select
                  value={application.status}
                  onChange={(e) => handleApplicationStatusChange(index, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleDeleteApplication(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Social Media Links Section */}
      <h3>Social Media Links:</h3>
      <button onClick={handleAddSocialLink}>+ Add Social Link</button>
      <table className="social-links-table">
        <thead>
          <tr>
            <th>Platform</th>
            <th>Link</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {socialLinks.map((social, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  value={social.platform}
                  onChange={(e) => handleSocialLinkChange(index, e.target.value)}
                />
              </td>
              <td>
                {social.editable ? (
                  <input
                    type="text"
                    value={social.link}
                    onChange={(e) => handleSocialLinkChange(index, e.target.value)}
                  />
                ) : (
                  social.link
                )}
              </td>
              <td>
                <button onClick={() => toggleEditable(index)}>
                  {social.editable ? 'Save' : 'Edit'}
                </button>
                <button onClick={() => handleDeleteSocialLink(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentDashboard;