import React, { useState, useEffect } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';

/**
 * Main layout component that splits the chat interface into sidebar and main window
 * Handles the overall layout structure and state management between components
 */
const ChatLayout = ({ messages = [], onSendMessage, socket, isConnected, onSimulateMessage }) => {
  // State to track the currently selected chat/conversation
  const [selectedChat, setSelectedChat] = useState(null);
  
  // Mock data for chats - exactly matching the provided design
  const chats = [
    {
      id: 1,
      name: "Dr. Eleanor Vance",
      lastMessage: "Sounds good, I'll review it this afternoon...",
      time: "10:42 AM",
      unread: false,
      online: true,
      isGroup: false,
      avatar: "👩‍⚕️"
    },
    {
      id: 2,
      name: "CS Study Group",
      lastMessage: "Don't forget the deadline...",
      time: "Yesterday",
      unread: false,
      online: false,
      isGroup: true,
      avatar: "👥",
      lastSender: "You" // Special case for group chats showing sender
    },
    {
      id: 3,
      name: "Maria Garcia",
      lastMessage: "Can we reschedule our meeting...",
      time: "Yesterday",
      unread: true,
      online: false,
      isGroup: false,
      avatar: "👩‍💼"
    },
    {
      id: 4,
      name: "John Doe",
      lastMessage: "Perfect, thank you!",
      time: "Sun",
      unread: false,
      online: false,
      isGroup: false,
      avatar: "👨‍💻"
    }
  ];

  // Mock messages data for Dr. Eleanor Vance chat (ID: 1)
  const chatMessages = {
    1: [
      {
        id: 1,
        sender: "Dr. Eleanor Vance",
        text: "Hi Alex, I've received your project proposal. It looks promising. Could you elaborate on the methodology section?",
        time: "9:18 AM",
        isOwn: false,
        avatar: "👩‍⚕️"
      },
      {
        id: 2,
        sender: "You",
        text: "Of course, Dr. Vance. I'm planning to use a mixed-methods approach, combining quantitative surveys with qualitative interviews to get a comprehensive view. I can send over a more detailed outline.",
        time: "9:25 AM", // Fixed time to be logical
        isOwn: true,
        avatar: "👤"
      },
      {
        id: 3,
        sender: "Dr. Eleanor Vance",
        text: "Sounds good, I'll review it this afternoon. Let's schedule a brief meeting for tomorrow to discuss it further.",
        time: "10:42 AM",
        isOwn: false,
        avatar: "👩‍⚕️"
      }
    ],
    // Empty messages for other chats
    2: [],
    3: [],
    4: []
  };

  // Combine mock messages with real-time messages from socket
  const [allMessages, setAllMessages] = useState(chatMessages);

  // Update messages when new messages come from socket
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (selectedChat && lastMessage.chatId === selectedChat.id) {
        setAllMessages(prev => ({
          ...prev,
          [selectedChat.id]: [...(prev[selectedChat.id] || []), {
            id: lastMessage.messageId,
            sender: lastMessage.sender === "user" ? "You" : selectedChat.name,
            text: lastMessage.text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOwn: lastMessage.sender === "user",
            avatar: lastMessage.sender === "user" ? "👤" : selectedChat.avatar
          }]
        }));
      }
    }
  }, [messages, selectedChat]);

  /**
   * Handles chat selection from the sidebar
   * @param {Object} chat - The selected chat object
   */
  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    // In a real app, you might fetch chat history here
    console.log(`Selected chat: ${chat.name}`);
  };

  /**
   * Handles sending new messages
   * @param {string} messageText - The text of the message to send
   */
  const handleSendMessage = (messageText) => {
    if (onSendMessage && selectedChat && messageText.trim()) {
      const messageData = {
        chatId: selectedChat.id,
        text: messageText,
        sender: "user" // This would be the current user's ID in a real app
      };
      onSendMessage(messageData);

      // Optimistically update UI
      const newMessage = {
        id: Date.now(),
        sender: "You",
        text: messageText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
        avatar: "👤"
      };

      setAllMessages(prev => ({
        ...prev,
        [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage]
      }));
    }
  };

  return (
    <div className="chat-layout">
      {/* Sidebar section - takes up 1/3 of the width on larger screens */}
      <div className="chat-sidebar-container">
        <ChatSidebar 
          chats={chats}
          selectedChat={selectedChat}
          onChatSelect={handleChatSelect}
          isConnected={isConnected}
        />
      </div>
      
      {/* Main chat window section - takes up 2/3 of the width on larger screens */}
      <div className="chat-window-container">
        <ChatWindow 
          selectedChat={selectedChat}
          messages={selectedChat ? allMessages[selectedChat.id] || [] : []}
          onSendMessage={handleSendMessage}
          isConnected={isConnected}
          onSimulateMessage={onSimulateMessage}
        />
      </div>
    </div>
  );
};

export default ChatLayout;