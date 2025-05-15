const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dialogflow = require('@google-cloud/dialogflow');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PROJECT_ID = 'my-application-2ea8d';
const SESSION_ID = '123456'; // Use unique session ID for each user
const CREDENTIALS = JSON.parse(fs.readFileSync('dialogflow-key.json'));

// MongoDB Connection
mongoose
  .connect('mongodb://localhost:27017/admin')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit if the connection fails
  });

// Admin Schema
const adminSchema = new mongoose.Schema({
  adminid: { type: String, required: true, unique: true },
  apassword: { type: String, required: true },
  adminname: { type: String },
  aemail: { type: String },
  amobile: { type: String },
});

const studentSchema = new mongoose.Schema({
  studentid: { type: String, required: true, unique: true }, // Unique student identifier
  studentname: { type: String, required: true },            // Student's name
  email: { type: String, required: true, unique: true },    // Email
  password: { type: String, required: true },               // Password
  mobile: { type: String, required: true },                 // Mobile number
  cgpa: { type: Number, required: true },                   // CGPA
  skills: { type: [String], default: [] },                  // Array of skills
  academicYear: { type: String, required: true },           // Academic Year
  address: { type: String, required: true },                // Address
  
  companyDetails: [{
    companyName: { type: String, required: true },
    position: { type: String, required: true },
    status: { type: String, required: true }
  }]
});

const Admin = mongoose.model('users', adminSchema);
const Student = mongoose.model('students', studentSchema);

// Register Admin
app.post('/admin/register', async (req, res) => {
  try {
    const { adminid, apassword, adminname, aemail, amobile } = req.body;

    if (!adminid || !apassword || !adminname || !aemail || !amobile) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const existingAdmin = await Admin.findOne({ adminid });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin ID already exists.' });
    }

    const admin = new Admin({ adminid, apassword, adminname, aemail, amobile });
    await admin.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    console.error('Error registering admin:', err);
    res.status(500).json({ error: 'Server error occurred.' });
  }
});

// Login Admin
app.post('/admin/login', async (req, res) => {
  try {
    const { adminid, apassword } = req.body;

    const admin = await Admin.findOne({ adminid });
    if (!admin || admin.apassword !== apassword) {
      return res.status(400).json({ error: 'Invalid Admin ID or Password.' });
    }

    res.status(200).json({ message: 'Login successful', admin });
  } catch (err) {
    console.error('Error logging in admin:', err);
    res.status(500).json({ error: 'Server error occurred.' });
  }
});

// Fetch all students (New API for Admin Dashboard)
app.get('/admin/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ error: 'Server error occurred.' });
  }
});

// Register Student
app.post('/student/register', async (req, res) => {
  try {
    const { studentid, spassword, studentname, semail, smobile, cgpa, skills, academicYear, address } = req.body;

    if (!studentid || !spassword || !studentname || !semail || !smobile || !cgpa || !academicYear || !address) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const existingStudent = await Student.findOne({ studentid });
    if (existingStudent) {
      return res.status(400).json({ error: 'Student ID already exists.' });
    }

    const student = new Student({
      studentid,
      password: spassword,
      studentname,
      email: semail,
      mobile: smobile,
      cgpa,
      skills,
      academicYear,
      address,
      
    });
    await student.save();
    res.status(201).json({ message: 'Student registered successfully' });
  } catch (err) {
    console.error('Error registering student:', err);
    res.status(500).json({ error: 'Server error occurred.' });
  }
});

// Login Student
app.post('/student/login', async (req, res) => {
  try {
    const { studentid, spassword } = req.body;

    if (!studentid || !spassword) {
      return res.status(400).json({ error: 'All required fields must be provided.' });
    }

    const student = await Student.findOne({ studentid });
    if (!student || student.password !== spassword) {
      return res.status(401).json({ error: 'Invalid Student ID or Password.' });
    }

    res.status(200).json({ message: 'Login successful', student });
  } catch (err) {
    console.error('Error logging in student:', err);
    res.status(500).json({ error: 'Server error occurred.' });
  }
});



app.get('/student/dashboard/:studentid', async (req, res) => {
  try {
    const { studentid } = req.params;
    console.log('Received studentid:', studentid); // Log to verify the student ID received

    const student = await Student.findOne({ studentid });

    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    res.status(200).json({
      studentid: student.studentid,
      studentname: student.studentname,
      email: student.email,
      mobile: student.mobile,
      cgpa: student.cgpa,
      skills: student.skills,
      academicYear: student.academicYear,
      address: student.address,
      companyDetails: student.companyDetails || [],
    });
  } catch (err) {
    console.error('Error fetching student details:', err);
    res.status(500).json({ error: 'Server error occurred.' });
  }
});


app.post('/student/:studentid/companyDetails', async (req, res) => {
  try {
    const { studentid } = req.params;
    const { companyName, position, status } = req.body;

    if (!companyName || !position || !status) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const student = await Student.findOne({ studentid });
    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    student.companyDetails.push({ companyName, position, status });
    await student.save();

    res.status(201).json(student.companyDetails[student.companyDetails.length - 1]);
  } catch (err) {
    console.error('Error saving company details:', err);
    res.status(500).json({ error: 'Server error occurred.' });
  }
});



app.get('/student/dashboard/:studentid', async (req, res) => {
  try {
    const { studentid } = req.params;
    const student = await Student.findOne({ studentid });

    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    res.status(200).json(student);
  } catch (err) {
    console.error('Error fetching student details:', err);
    res.status(500).json({ error: 'Server error occurred.' });
  }
});

// Update specific company details
app.put('/student/:studentid/company/:companyid', async (req, res) => {
  try {
    const { studentid, companyid } = req.params;
    const { companyName, position, status } = req.body;  // Removed companyLink here

    const student = await Student.findOneAndUpdate(
      { studentid, "companyDetails._id": companyid },
      {
        $set: {
          "companyDetails.$.companyName": companyName,
          "companyDetails.$.position": position,
          "companyDetails.$.status": status  // companyLink removed here
        }
      },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ error: 'Student or company not found.' });
    }

    res.status(200).json({ message: 'Company details updated successfully', student });
  } catch (err) {
    console.error('Error updating company details:', err);
    res.status(500).json({ error: 'Server error occurred.' });
  }
});

// Delete company from student profile
app.delete('/student/:studentid/company/:companyid', async (req, res) => {
  try {
    const { studentid, companyid } = req.params;
    //const student = await Student.findById(studentid);

    const student = await Student.findOneAndUpdate(
      { studentid },
      { $pull: { companyDetails: { _id: companyid } } },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    // Remove company detail
    const companyDetail = student.companyDetails.id(companyid);
    if (!companyDetail) {
      return res.status(404).json({ error: 'Company not found.' });
    }
    companyDetail.remove();
    await student.save();
    res.status(200).json({ message: 'Company details deleted successfully', student });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting company details.' });
  }
});

app.post('/student/:studentId/applications', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { companyName, position, status } = req.body;

    if (!companyName || !position) {
      return res.status(400).json({ error: 'Company Name and Position are required.' });
    }

    const student = await Student.findOne({ studentid: studentId });
    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    // Add new application to student's companyDetails array
    student.companyDetails.push({ companyName, position, status });
    await student.save();

    res.status(201).json({ message: 'Application added successfully', application: student.companyDetails });
  } catch (err) {
    console.error('Error adding application:', err);
    res.status(500).json({ error: 'Server error occurred.' });
  }
});

// Function to send queries to Dialogflow
async function sendToDialogflow(message) {
  const sessionClient = new dialogflow.SessionsClient({ credentials: CREDENTIALS });
  const sessionPath = sessionClient.projectAgentSessionPath(PROJECT_ID, SESSION_ID);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: 'en',
      },
    },
  };

  const responses = await sessionClient.detectIntent(request);
  console.log('Dialogflow response:', responses[0].queryResult.fulfillmentText); // Log the response
  return responses[0].queryResult.fulfillmentText;
}

// API route to handle chat requests
app.post('/chatbot', async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const botResponse = await sendToDialogflow(userMessage);
    res.json({ response: botResponse });
  } catch (error) {
    console.error('Dialogflow error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));






