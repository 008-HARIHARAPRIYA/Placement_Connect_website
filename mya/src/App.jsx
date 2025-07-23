import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './components/HomePages.css';
import axios from 'axios'; // Import axios for API calls

import StudentRegistraton from './components/StudentRegistraton';
import AdminDashboard from './components/AdminDashboard';
import AdminRegister from './components/AdminRegister';
import StudentDashboard from './components/StudentDashboard';


const Home = () => {
  const placedStudents = [
    { id: 1, name: 'John Doe', company: 'Google', position: 'Software Engineer', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8MS8QVASobRp_NB956TsKM_bdcS5ZT_yp4A&s' },
    { id: 2, name: 'Jane Smith', company: 'Amazon', position: 'Data Scientist', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7X0OdfaWumbYopUqS0CwuhlKFbpcyLjeGtsKK6L9xzx_NtQrfY2wjdnuVULT05OldlZ0&usqp=CAU' },
    { id: 3, name: 'Mark Johnson', company: 'Facebook', position: 'UI/UX Designer', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcST1k7zVchojzpKlOOGP30Olbj2kb1l7DDEBw&s' },
  ];

  return (
    <div className="header-container">
      <h1>Placement Connect</h1>
      <div className="content">
        <img src="./propic.PNG" alt="Placement" className="left-image" />
        <p style={{ fontSize: '18px', color: '#fff', maxWidth: '600px'}}>
          <span style={{ fontSize: '24px', fontFamily: 'Dancing Script', fontWeight: 'bold' }}>
            Welcome to Placement Connect.<br/>
          </span>
          Our platform offers a range of services designed to help students and professionals find the perfect job opportunities. Whether you're looking to connect with employers or expand your network, we have you covered.
        </p>
      </div>
      <h2 className="rotatable-globe">Placed Students</h2>
      <div className="student-list">
        {placedStudents.map((student) => (
          <div key={student.id} className="student-card">
            <img src={student.image} alt={student.name} className="student-image" />
            <div className="student-details">
            <h3>{student.name}</h3>

              <p><strong>Company:</strong> {student.company}</p>
              <p><strong>Position:</strong> {student.position}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // Track chatbot visibility

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { sender: "user", text: message };
    setChat((prevChat) => [...prevChat, userMessage]);

    try {
      // const response = await axios.post("http://localhost:8001/chatbot", { message });
      const response = await axios.post("https://placement-connect-website-1.onrender.com/chatbot", { message });

      const botMessage = { sender: "bot", text: response.data.response };
      setChat((prevChat) => [...prevChat, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setMessage("");
  };

  return (
    <div className="chatbot-container">
      {/* AI Image Button to Open/Minimize Chatbot */}
      <img
        src="ai.jpg" // Replace with a better AI-related image URL
        alt="AI Assistant"
        className="chat-icon"
        onClick={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="chatbot-window">
          {/* Minimize button (AI image) */}
          <img
            src="ai.jpg"
            alt="Close Chat"
            className="chat-minimize"
            onClick={() => setIsOpen(false)}
          />
          <h2>Chat with AI Assistant</h2>
          <div className="chat-window">
            {chat.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                <p><strong>{msg.sender === "user" ? "You" : "Bot"}:</strong> {msg.text}</p>
              </div>
            ))}
          </div>
          <input 
            type="text" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            placeholder="Type a message..." 
            className="chat-input"
          />
          <button onClick={sendMessage} className="chat-send-button">Send</button>
        </div>
      )}
    </div>
  );
};


const App = () => {
  return (
    <BrowserRouter>
      <div style={{ backgroundImage: 'url("./3607424.jpg")', minHeight: '100vh', padding: '10px', backgroundSize: '300% 300%', animation: 'gradientAnimation 30s ease infinite' }}>
        <ul style={{ listStyleType: 'none', display: 'flex', gap: '20px' }}>
          <li><Link to="/" style={{ color: '#fff' }}>Home</Link></li>
          <li><Link to="/Student-login" style={{ color: '#fff' }}>Student Login</Link></li>
          <li><Link to="/admin-login" style={{ color: '#fff' }}>Admin Login</Link></li>
        </ul>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin-login" element={<AdminRegister />} />
          <Route path="/Student-register" element={<StudentRegistraton />} />
          <Route path="/Student-login" element={<StudentRegistraton />} />
          <Route path="/admin-register" element={<AdminRegister />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
        </Routes>
        <Chatbot />
      </div>
    </BrowserRouter>
  );
};

export default App;