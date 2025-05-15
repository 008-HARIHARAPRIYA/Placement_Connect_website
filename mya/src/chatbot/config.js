import { createChatBotMessage } from 'react-chatbot-kit';

const config = {
  botName: "PlacementBot",
  initialMessages: [createChatBotMessage(`Hi! I'm here to help you with Placement Connect.`)],
  customStyles: {
    botMessageBox: {
      backgroundColor: "#376B7E",
    },
    chatButton: {
      backgroundColor: "#5ccc9d",
    },
  },
};

export default config;
