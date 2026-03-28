import api from './axios';

/**
 * Event / Competition API functions
 * Backend mounts the event engine at: /api/v1/competitions
 */

// Get all competitions/events
export const getAllEvents = async (filters = {}) => {
  try {
    const response = await api.get('/competitions', { params: filters });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get competition by ID
export const getEventById = async (eventId) => {
  try {
    const response = await api.get(`/competitions/${eventId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create new competition (society_head or admin)
export const createEvent = async (eventData) => {
  try {
    const response = await api.post('/competitions', eventData, {
      headers: eventData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update competition
export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await api.patch(`/competitions/${eventId}`, eventData, {
      headers: eventData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete competition
export const deleteEvent = async (eventId) => {
  try {
    const response = await api.delete(`/competitions/${eventId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Transition event state (e.g. draft -> registration -> ongoing)
export const transitionEventState = async (eventId, newStatus, cancellationReason) => {
  try {
    const response = await api.patch(`/competitions/${eventId}/transition`, {
      status: newStatus,
      cancellationReason,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get event announcements
export const getAnnouncements = async (eventId) => {
  try {
    const response = await api.get(`/competitions/${eventId}/announcements`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Post event announcement
export const postAnnouncement = async (eventId, content) => {
  try {
    const response = await api.post(`/competitions/${eventId}/announcements`, { content });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get leaderboard
export const getLeaderboard = async (eventId) => {
  try {
    const response = await api.get(`/competitions/${eventId}/leaderboard`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ─── Teams ────────────────────────────────────────────────────────────────────

export const getTeams = async (eventId) => {
  try {
    const response = await api.get(`/competitions/${eventId}/teams`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createTeam = async (eventId, teamData) => {
  try {
    const response = await api.post(`/competitions/${eventId}/teams`, teamData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMyTeam = async (eventId) => {
  try {
    const response = await api.get(`/competitions/${eventId}/teams/my`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const joinTeam = async (eventId, teamId) => {
  try {
    const response = await api.post(`/competitions/${eventId}/teams/${teamId}/join`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const leaveTeam = async (eventId, teamId) => {
  try {
    const response = await api.post(`/competitions/${eventId}/teams/${teamId}/leave`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ─── Submissions ──────────────────────────────────────────────────────────────

export const getMySubmission = async (eventId) => {
  try {
    const response = await api.get(`/competitions/${eventId}/submissions/my`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const upsertSubmission = async (eventId, submissionData) => {
  try {
    const response = await api.post(`/competitions/${eventId}/submissions`, submissionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const addFileToSubmission = async (eventId, formData) => {
  try {
    const response = await api.post(`/competitions/${eventId}/submissions/files`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
