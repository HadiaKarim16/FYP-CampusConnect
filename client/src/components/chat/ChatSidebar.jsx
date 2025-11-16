import React from 'react';

/**
 * Sidebar component displaying the list of conversations/chats
 * Shows search functionality and chat previews exactly as per design
 */
const ChatSidebar = ({ chats, selectedChat, onChatSelect, isConnected }) => {
  return (
    <div className="chat-sidebar">
      {/* Search header section - matches the design exactly */}
      <div className="sidebar-header">
        <h2>Messages</h2>
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search messages or users"
            className="search-input"
          />
        </div>
      </div>

      {/* Chats list - exactly matching the provided design layout */}
      <div className="chats-list">
        {chats.map(chat => (
          <div 
            key={chat.id}
            className={`chat-item ${selectedChat?.id === chat.id ? 'active' : ''}`}
            onClick={() => onChatSelect(chat)}
          >
            {/* Chat avatar/icon */}
            <div className="chat-avatar">
              {chat.avatar}
            </div>
            
            {/* Chat content - structured exactly like the design */}
            <div className="chat-content">
              <div className="chat-header">
                <span className="chat-name">{chat.name}</span>
                <span className="chat-time">{chat.time}</span>
              </div>
              <div className="chat-preview">
                {/* Special handling for group chats showing sender */}
                {chat.isGroup && chat.lastSender ? (
                  <span>
                    <strong>{chat.lastSender}:</strong> {chat.lastMessage}
                  </span>
                ) : (
                  chat.lastMessage
                )}
              </div>
            </div>

            {/* Online status indicator - only for Dr. Eleanor Vance in this design */}
            {chat.online && <div className="online-indicator" title="Online"></div>}
            
            {/* Unread message indicator */}
            {chat.unread && <div className="unread-indicator"></div>}
          </div>
        ))}
      </div>

      {/* Connection status in sidebar (optional) */}
      {!isConnected && (
        <div className="connection-warning">
          🔴 Connecting to chat server...
        </div>
      )}
    </div>
  );
};

export default ChatSidebar;