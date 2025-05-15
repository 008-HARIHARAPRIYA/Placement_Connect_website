const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("./models/admin");
const router = express.Router();

// Middleware for authenticating admin
const authenticateAdmin = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    req.adminId = decoded.id; // Store the admin ID for later use
    next();
  });
};

// Admin login route
router.post("/login", async (req, res) => {
  const { adminid, apassword } = req.body;

  try {
    const admin = await Admin.findOne({ email: adminid });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isPasswordCorrect = await bcrypt.compare(apassword, admin.password);
    if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid password" });

    // Generate JWT token
    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

// Admin registration route
router.post("/register", async (req, res) => {
  const { adminid, adminname, apassword } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email: adminid });
    if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(apassword, 10);

    const newAdmin = new Admin({
      name: adminname,
      email: adminid,
      password: hashedPassword,
    });

    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error registering admin", error: err.message });
  }
});

// Admin protected route example
router.get("/dashboard", authenticateAdmin, (req, res) => {
  res.status(200).json({ message: `Welcome Admin with ID: ${req.adminId}` });
});

module.exports = router;
