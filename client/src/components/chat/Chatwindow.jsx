import React, { useState, useRef, useEffect } from 'react';

/**
 * Main chat window component that displays messages and chat header
 * Shows conversation history and provides message input functionality
 * Matches the exact design from the provided image
 */
const ChatWindow = ({ selectedChat, messages, onSendMessage, isConnected, onSimulateMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Scrolls the messages container to the bottom
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /**
   * Handles sending a new message
   */
  const handleSendMessage = () => {
    if (newMessage.trim() && onSendMessage) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  /**
   * Handles Enter key press in message input
   * @param {Event} e - Keyboard event
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // If no chat is selected, show placeholder exactly as per design
  if (!selectedChat) {
    return (
      <div className="chat-window empty">
        <div className="empty-state">
          <h3>Select a conversation</h3>
          <p>Choose a chat from the sidebar to start messaging</p>
          
          {/* Debug button for testing socket messages */}
          {process.env.NODE_ENV === 'development' && onSimulateMessage && (
            <button 
              onClick={onSimulateMessage}
            >
              Test Socket Message
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      {/* Chat header with participant info and status - matches design */}
      <div className="chat-header chat-window-header">
        <div className="chat-info">
          <h3>{selectedChat.name}</h3>
          <span className={`status ${!selectedChat.online ? 'offline' : ''}`}>
            {selectedChat.online ? 'Online' : 'Offline'}
          </span>
        </div>
        <div className="chat-actions">
          {/* Action buttons as per design */}
          <button className="action-btn" title="Voice call">📞</button>
          <button className="action-btn" title="Video call">🎥</button>
          <button className="action-btn" title="More options">⋮</button>
        </div>
      </div>

      {/* Conversation start info - exactly as shown in design */}
      {selectedChat.id === 1 && (
        <div className="conversation-start">
          <span>You started this conversation. Today at 9:15 AM</span>
        </div>
      )}

      {/* Messages container */}
      <div className="messages-container">
        {messages.map(message => (
          <div 
            key={message.id}
            className={`message ${message.isOwn ? 'own-message' : 'other-message'}`}
          >
            {/* Show avatar for other messages */}
            {!message.isOwn && (
              <div className="message-avatar">
                {message.avatar}
              </div>
            )}
            
            <div className="message-bubble">
              <div className="message-text">{message.text}</div>
              <div className="message-time">{message.time}</div>
            </div>

            {/* Show avatar for own messages on the right */}
            {message.isOwn && (
              <div className="message-avatar">
                {message.avatar}
              </div>
            )}
          </div>
        ))}
        
        {/* Empty reference for auto-scrolling */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input area - matches design exactly */}
      <div className="message-input-container">
        <div className="input-actions">
          <button className="input-action-btn" title="Add emoji">➕</button>
          <button className="input-action-btn" title="Attach file">📎</button>
        </div>
        <input 
          type="text" 
          placeholder="Type a message..."
          className="message-input"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={!isConnected}
        />
        <button 
          className="send-button"
          onClick={handleSendMessage}
          disabled={!newMessage.trim() || !isConnected}
          title={!isConnected ? "Connecting to server..." : "Send message"}
        >
          ➤
        </button>
      </div>

      {/* Connection status indicator */}
      {!isConnected && (
        <div className="connection-banner">
          🔴 Waiting for connection... Messages may not be delivered.
        </div>
      )}
    </div>
  );
};

export default ChatWindow;