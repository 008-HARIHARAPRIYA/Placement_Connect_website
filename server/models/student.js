const mongoose = require("mongoose");

// Define the schema
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Student's name
  email: { type: String, required: true, unique: true }, // Unique email
  phone: { type: String, required: true }, // Phone number
  skills: { type: [String], required: true }, // Array of skills
  cgpa: { type: Number, required: true }, // CGPA value
  applicationStatus: { type: String, default: "Pending" } // Default status
});

// Export the model
const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
