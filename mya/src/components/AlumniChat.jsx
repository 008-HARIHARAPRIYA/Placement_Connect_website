import React, { useState } from "react";
import { MessageCircle, Linkedin, Send, Star } from "lucide-react";
import { motion } from "framer-motion";
import "./AlumniChat.css";

const alumniData = [
  {
    id: 1,
    name: "John",
    company: "Google",
    salary: "RS:50,00,000",
    linkedin: "https://www.linkedin.com/in/johndoe/",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    achievements: ["Developed an AI model", "Promoted to Senior Engineer", "Speaker at Tech Conferences"],
  },
  {
    id: 2,
    name: "Sarah",
    company: "Microsoft",
    salary: "RS:30,00,000",
    linkedin: "https://www.linkedin.com/in/sarahlee/",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    achievements: ["Led a cybersecurity project", "Won Best Employee Award", "Guest Lecturer at Stanford"],
  },
  {
    id: 3,
    name: "Amit",
    company: "Amazon",
    salary: "RS:20,00,000",
    linkedin: "https://www.linkedin.com/in/amitpatel/",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    achievements: ["Optimized AWS services", "Developed a patented algorithm", "Built a successful startup"],
  },
  {
    id: 4,
    name: "Lisa",
    company: "Apple",
    salary: "RS:10,00,000",
    linkedin: "https://www.linkedin.com/in/lisawong/",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    achievements: ["Designed iOS features", "Top Innovator Award", "Mentored 50+ students"],
  },
];

export default function AlumniChat() {
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [messages, setMessages] = useState({});
  const [message, setMessage] = useState("");
  const [showAchievements, setShowAchievements] = useState(null);

  const handleChatOpen = (alumni) => {
    setSelectedAlumni(alumni);
    setShowAchievements(null); // Close achievements if chat is opened
  };

  const handleShowAchievements = (alumniId) => {
    setShowAchievements(alumniId);
    setSelectedAlumni(null); // Close chat if achievements are opened
  };

  const sendMessage = () => {
    if (!selectedAlumni || !message.trim()) return;

    const newMessages = { ...messages };
    if (!newMessages[selectedAlumni.id]) newMessages[selectedAlumni.id] = [];

    newMessages[selectedAlumni.id].push({ sender: "You", text: message });
    setMessages(newMessages);
    setMessage("");

    // Alumni automatic reply
    setTimeout(() => {
      newMessages[selectedAlumni.id].push({
        sender: selectedAlumni.name,
        text: "Thanks for reaching out! Let me know how I can help you.",
      });
      setMessages({ ...newMessages });
    }, 1000);
  };

  return (
    <div className="container">
      <h1>Connect with Alumni</h1>
      <div className="grid">
        {alumniData.map((alumni) => (
          <motion.div key={alumni.id} whileHover={{ scale: 1.05 }}>
            <div className="card">
              <img src={alumni.image} alt={alumni.name} className="alumni-image" />
              <div className="card-info">
                <h2>{alumni.name}</h2>
                <p>{alumni.company}</p>
                <p><strong>Salary:</strong> {alumni.salary}</p>
              </div>
              <div className="buttons">
                <button onClick={() => handleChatOpen(alumni)} className="chat-btn">
                  <MessageCircle size={20} /> Chat
                </button>
                <a href={alumni.linkedin} target="_blank" rel="noopener noreferrer">
                  <button className="linkedin-btn">
                    <Linkedin size={20} />
                  </button>
                </a>
                <button className="achievement-btn" onClick={() => handleShowAchievements(alumni.id)}>
                  <Star size={20} /> Achievements
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedAlumni && (
        <div className="chat-box">
          <h2>Chat with {selectedAlumni.name} ({selectedAlumni.company})</h2>
          <div className="messages">
            {(messages[selectedAlumni.id] || []).map((msg, index) => (
              <p key={index}><strong>{msg.sender}:</strong> {msg.text}</p>
            ))}
          </div>
          <div className="input-box">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button onClick={sendMessage} className="send-btn">
              <Send size={20} />
            </button>
          </div>
        </div>
      )}

      {showAchievements && (
        <div className="achievements-box">
          <h2>Achievements of {alumniData.find(a => a.id === showAchievements)?.name}</h2>
          <ul>
            {alumniData.find(a => a.id === showAchievements)?.achievements.map((achievement, index) => (
              <li key={index}>⭐ {achievement}</li>
            ))}
          </ul>
          <button onClick={() => setShowAchievements(null)} className="close-btn">Close</button>
        </div>
      )}
    </div>
  );
}