import { useState } from "react";

function PlacementChatbot() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Welcome! How can I assist you with placements?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim() !== "") {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
      
      setTimeout(() => {
        const botResponse = getBotResponse(input);
        setMessages(prev => [...prev, { text: botResponse, sender: "bot" }]);
      }, 1000);
    }
  };

  const getBotResponse = (userInput) => {
    const responses = {
      "resume tips": "Ensure your resume highlights key skills and achievements.",
      "interview tips": "Be confident, research the company, and practice common questions.",
      "placement process": "Our placement process includes mock tests, resume screening, and interviews.",
    };
    
    return responses[userInput.toLowerCase()] || "I am here to help! Please ask another question.";
  };

  return (
    <div>
      {/* Chatbot Icon */}
      <button 
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all"
        onClick={() => setChatOpen(!chatOpen)}
      >
        💬
      </button>
      
      {/* Chatbot Window */}
      {chatOpen && (
        <div className="fixed bottom-20 right-6 bg-white shadow-xl rounded-lg w-80 p-4 flex flex-col">
          <div className="flex justify-between items-center border-b pb-2">
            <h4 className="text-lg font-semibold">Placement Assistant</h4>
            <button className="text-gray-500 hover:text-gray-700" onClick={() => setChatOpen(false)}>✕</button>
          </div>
          <div className="h-40 overflow-y-auto p-2 text-gray-700 space-y-2">
            {messages.map((msg, index) => (
              <div key={index} className={`p-2 rounded-lg ${msg.sender === "user" ? "bg-blue-200 text-right" : "bg-gray-200 text-left"}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex mt-2">
            <input 
              type="text" 
              placeholder="Ask about placements..." 
              className="w-full border rounded-lg p-2 text-gray-700"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlacementChatbot;