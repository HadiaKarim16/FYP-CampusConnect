import api from './axios';

/**
 * Notification API functions
 * Backend mounts at: /api/v1/notifications
 */

// Get all notifications for user
export const getUserNotifications = async (filters = {}) => {
  try {
    const response = await api.get('/notifications', { params: filters });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete notification
export const deleteNotification = async (notificationId) => {
  try {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get unread notification count
export const getUnreadCount = async () => {
  try {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
