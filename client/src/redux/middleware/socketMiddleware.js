import { fetchSessionsThunk } from '../slices/mentoringSlice';

let socketInstance = null;

const socketMiddleware = store => next => action => {
  // Store socket instance when it's provided, usually via an auth initialization action
  if (action.payload && action.payload.socket) {
    socketInstance = action.payload.socket;
    
    // Set up listeners for socket events
    if (socketInstance) {
      setupSocketListeners(store, socketInstance);
    }
  }

  return next(action);
};

/**
 * Set up listeners for backend socket events
 */
function setupSocketListeners(store, socket) {
  // Connection events
  socket.on('connect', () => {
    store.dispatch({
      type: 'socket/connected',
    });
  });

  socket.on('disconnect', () => {
    store.dispatch({
      type: 'socket/disconnected',
    });
  });

  // User events
  socket.on('user-update', (data) => {
    store.dispatch({
      type: 'auth/updateUser',
      payload: data,
    });
  });

  // ─── Notification Events ───
  socket.on('notification:new', (data) => {
    store.dispatch({
      type: 'notifications/receiveNotification',
      payload: data,
    });
  });

  socket.on('notification:sync', (data) => {
    // Fired for unread counts
    store.dispatch({
      type: 'notifications/syncUnreadCount',
      payload: data,
    });
  });

  // ─── Chat Events ───
  socket.on('message:new', (data) => {
    store.dispatch({
      type: 'messages/receiveMessage',
      payload: { chatId: data.chat, message: data },
    });
  });
  
  socket.on('message:reaction:update', (data) => {
    store.dispatch({
      type: 'messages/updateReaction',
      payload: data,
    });
  });

  socket.on('chat:read', (data) => {
    // Optionally implemented in slice
    store.dispatch({
      type: 'messages/markChatReadLocally',
      payload: data,
    });
  });

  // ─── Domain Events (Events & Societies) ───
  socket.on('event-update', (data) => {
    store.dispatch({
      type: 'events/updateEvent',
      payload: data,
    });
  });

  socket.on('society-update', (data) => {
    store.dispatch({
      type: 'societies/updateSociety',
      payload: data,
    });
  });

  // ─── Mentoring Events ───
  socket.on('mentoring:session_update', (data) => {
    console.log('[Socket] Mentoring update received:', data);
    // Refresh sessions significantly safer than manual patching
    store.dispatch(fetchSessionsThunk());
  });

  // Error handling
  socket.on('error', (error) => {
    console.error('[Socket] Server Error:', error);
    store.dispatch({
      type: 'socket/error',
      payload: error,
    });
  });
}

export default socketMiddleware;
