import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMyChats, getChatMessages, sendMessage as sendMessageApi, markChatAsRead, createOrGetDM } from '../../api/chatApi';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Normalize a backend chat object into the shape ChatList expects.
 * Backend chat has: _id, type, members[{userId: {_id, profile}, role}], lastMessage, updatedAt
 * ChatList expects: _id/id, participantName, participantId, participantRole, lastMessage, lastMessageAt, unreadCount
 */
const normalizeConversation = (chat, currentUserId) => {
  const chatObj = chat._doc || chat; // handle mongoose docs or plain objects

  // For DM chats, find the "other" member
  let participantName = 'Unknown User';
  let participantId = null;
  let participantRole = 'Student';
  let participantAvatar = '';

  if (chatObj.type === 'dm' && chatObj.members) {
    const otherMember = chatObj.members.find(m => {
      const mId = m.userId?._id?.toString() || m.userId?.toString();
      return mId !== currentUserId;
    });

    if (otherMember) {
      const user = otherMember.userId; // populated user object
      if (typeof user === 'object' && user !== null) {
        participantName = user.profile?.displayName
          || `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim()
          || 'Unknown User';
        participantId = user._id?.toString();
        participantAvatar = user.profile?.avatar || '';
      } else {
        // userId is just an ObjectId string (not populated)
        participantId = user?.toString();
      }
      participantRole = otherMember.role || 'member';
    }
  } else if (chatObj.name) {
    // Group chat
    participantName = chatObj.name;
  }

  // Extract last message content
  let lastMessageText = '';
  let lastMessageAt = chatObj.updatedAt;
  if (chatObj.lastMessage) {
    if (typeof chatObj.lastMessage === 'object') {
      lastMessageText = chatObj.lastMessage.content || '';
      lastMessageAt = chatObj.lastMessage.createdAt || chatObj.updatedAt;
    } else {
      lastMessageText = chatObj.lastMessage;
    }
  }

  return {
    _id: chatObj._id?.toString() || chatObj.id,
    id: chatObj._id?.toString() || chatObj.id,
    type: chatObj.type || 'dm',
    participantName,
    participantId,
    participantRole,
    participantAvatar,
    lastMessage: lastMessageText,
    lastMessageAt,
    unreadCount: chatObj.myUnreadCount || 0,
    isOnline: false,
    members: chatObj.members,
  };
};

// ─── Async Thunks (calling real backend at /api/v1/chats) ─────────────────

export const fetchConversations = createAsyncThunk(
  'messages/fetchConversations',
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await getMyChats();
      // Backend returns ApiResponse: { statusCode, data, message }
      const chats = response.data;

      // Get current user ID for normalization
      let currentUserId = null;
      try {
        const authState = JSON.parse(localStorage.getItem('authState') || '{}');
        currentUserId = authState?.user?._id || authState?.user?.id;
      } catch { /* ignore */ }

      const normalized = (Array.isArray(chats) ? chats : []).map(chat =>
        normalizeConversation(chat, currentUserId)
      );
      return normalized;
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch conversations');
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async ({ conversationId, page, limit }, { rejectWithValue }) => {
    try {
      const response = await getChatMessages(conversationId, page, limit);
      return { conversationId, messages: response.data };
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch messages');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ conversationId, content }, { rejectWithValue }) => {
    try {
      const response = await sendMessageApi(conversationId, content);
      return { conversationId, message: response.data };
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to send message');
    }
  }
);

export const markConversationRead = createAsyncThunk(
  'messages/markConversationRead',
  async (conversationId, { rejectWithValue }) => {
    try {
      await markChatAsRead(conversationId);
      return conversationId;
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to mark as read');
    }
  }
);

export const startNewConversation = createAsyncThunk(
  'messages/startNewConversation',
  async ({ targetUserId }, { rejectWithValue }) => {
    try {
      const response = await createOrGetDM(targetUserId);
      // response is { statusCode, data: chat, message }
      const chat = response.data;

      // Get current user ID for normalization
      let currentUserId = null;
      try {
        const authState = JSON.parse(localStorage.getItem('authState') || '{}');
        currentUserId = authState?.user?._id || authState?.user?.id;
      } catch { /* ignore */ }

      return normalizeConversation(chat, currentUserId);
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to start conversation');
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    conversations: [],
    activeConversationId: null,
    messages: {},
    sendingStatus: 'idle',
    status: 'idle',
    error: null,
  },
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversationId = action.payload;
    },
    clearConversationMessages: (state, action) => {
      const convId = action.payload;
      state.messages[convId] = [];
      const conv = state.conversations.find(c => c._id === convId);
      if (conv) {
        conv.lastMessage = '';
        conv.unreadCount = 0;
      }
    },
    // For real-time socket events — add an incoming message from another user
    receiveMessage: (state, action) => {
      const { chatId, message } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      // Avoid duplicates
      if (!state.messages[chatId].find(m => m._id === message._id)) {
        state.messages[chatId].push(message);
      }
      // Update conversation preview
      const conv = state.conversations.find(c => c._id === chatId);
      if (conv) {
        conv.lastMessage = message.content;
        conv.lastMessageAt = message.createdAt;
        if (chatId !== state.activeConversationId) {
          conv.unreadCount = (conv.unreadCount || 0) + 1;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { conversationId, messages } = action.payload;
        state.messages[conversationId] = Array.isArray(messages) ? messages : (messages?.messages || []);
      })
      .addCase(sendMessage.pending, (state) => {
        state.sendingStatus = 'sending';
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendingStatus = 'succeeded';
        const { conversationId, message } = action.payload;
        if (!state.messages[conversationId]) {
          state.messages[conversationId] = [];
        }
        state.messages[conversationId].push(message);

        const conv = state.conversations.find(c => c._id === conversationId);
        if (conv) {
          conv.lastMessage = message.content;
          conv.lastMessageAt = message.createdAt;
          conv.unreadCount = 0;
        }
      })
      .addCase(sendMessage.rejected, (state) => {
        state.sendingStatus = 'failed';
      })
      .addCase(markConversationRead.fulfilled, (state, action) => {
        const conv = state.conversations.find(c => c._id === action.payload);
        if (conv) conv.unreadCount = 0;
      })
      .addCase(startNewConversation.fulfilled, (state, action) => {
        const newConv = action.payload;
        const exists = state.conversations.find(c => c._id === newConv._id);
        if (!exists) {
          state.conversations.push(newConv);
        }
        state.activeConversationId = newConv._id;
        if (!state.messages[newConv._id]) {
          state.messages[newConv._id] = [];
        }
      });
  },
});

export const { setActiveConversation, clearConversationMessages, receiveMessage } = messagesSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectConversations = (state) => {
  return [...(state.messages?.conversations || [])].sort((a, b) =>
    new Date(b.lastMessageAt || b.updatedAt) - new Date(a.lastMessageAt || a.updatedAt)
  );
};
export const selectActiveMessages = (state) => state.messages?.messages?.[state.messages?.activeConversationId] || [];
export const selectTotalUnread = (state) => (state.messages?.conversations || []).reduce((sum, c) => sum + (c.unreadCount || 0), 0);
export const selectActiveConversationId = (state) => state.messages?.activeConversationId;
export const selectMessagesStatus = (state) => state.messages?.status || 'idle';

export default messagesSlice.reducer;
