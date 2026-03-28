import api from './axios';

/**
 * Chat API functions
 * Backend mounts at: /api/v1/chats
 */

// Get all my chats (DMs + group chats)
export const getMyChats = async () => {
  try {
    const response = await api.get('/chats');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create or get a DM conversation with another user
export const createOrGetDM = async (targetUserId) => {
  try {
    const response = await api.post('/chats/dm', { targetUserId });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get a specific chat by ID
export const getChatById = async (chatId) => {
  try {
    const response = await api.get(`/chats/${chatId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get messages for a chat (paginated)
export const getChatMessages = async (chatId, page = 1, limit = 50) => {
  try {
    const response = await api.get(`/chats/${chatId}/messages`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Send a message in a chat
export const sendMessage = async (chatId, content) => {
  try {
    const response = await api.post(`/chats/${chatId}/messages`, { content });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Mark a chat as read
export const markChatAsRead = async (chatId) => {
  try {
    const response = await api.patch(`/chats/${chatId}/read`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Edit a message
export const editMessage = async (chatId, msgId, content) => {
  try {
    const response = await api.patch(`/chats/${chatId}/messages/${msgId}`, { content });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete a message
export const deleteMessage = async (chatId, msgId) => {
  try {
    const response = await api.delete(`/chats/${chatId}/messages/${msgId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Toggle reaction on a message
export const toggleReaction = async (chatId, msgId, emoji) => {
  try {
    const response = await api.post(`/chats/${chatId}/messages/${msgId}/react`, { emoji });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update group chat (name, etc.)
export const updateGroupChat = async (chatId, data) => {
  try {
    const response = await api.patch(`/chats/${chatId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Add member to a group chat
export const addMemberToChat = async (chatId, userId) => {
  try {
    const response = await api.post(`/chats/${chatId}/members`, { userId });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Remove member from a group chat
export const removeMemberFromChat = async (chatId, userId) => {
  try {
    const response = await api.delete(`/chats/${chatId}/members/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
