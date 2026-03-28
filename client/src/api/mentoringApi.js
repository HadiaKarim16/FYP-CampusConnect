import api from './axios';

/**
 * Mentoring API functions
 * Backend mounts at: /api/v1/mentors
 */

// Get all mentors
export const getAllMentors = async (filters = {}) => {
  try {
    const response = await api.get('/mentors', { params: filters });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get mentor by ID
export const getMentorById = async (mentorId) => {
  try {
    const response = await api.get(`/mentors/${mentorId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Apply/Register to become a mentor
export const applyAsMentor = async (applicationData) => {
  try {
    const response = await api.post('/mentors/register', applicationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get my mentor profile if I am a mentor
export const getMyMentorProfile = async () => {
  try {
    const response = await api.get('/mentors/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update mentor profile (for logged in mentor)
export const updateMentorProfile = async (profileData) => {
  try {
    const response = await api.patch('/mentors/profile', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get mentor availability
export const getMentorAvailability = async (mentorId) => {
  try {
    const response = await api.get(`/mentors/${mentorId}/availability`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Set mentor availability (for logged in mentor)
export const setMentorAvailability = async (availabilityData) => {
  try {
    const response = await api.put('/mentors/availability', availabilityData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Book mentoring session with a specific mentor
export const bookSession = async (mentorId, sessionData) => {
  try {
    const response = await api.post(`/mentors/${mentorId}/book`, sessionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get my built-in sessions (bookings) - as student or mentor
export const getMentoringSessions = async () => {
  try {
    const response = await api.get('/mentors/bookings/my');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Cancel mentoring session (bookingId)
export const cancelSession = async (bookingId) => {
  try {
    const response = await api.patch(`/mentors/bookings/${bookingId}/cancel`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Confirm mentoring session (bookingId - mentor only)
export const confirmSession = async (bookingId) => {
  try {
    const response = await api.patch(`/mentors/bookings/${bookingId}/confirm`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Complete mentoring session (bookingId - mentor only)
export const completeSession = async (bookingId) => {
  try {
    const response = await api.patch(`/mentors/bookings/${bookingId}/complete`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Submit session review/feedback
export const submitSessionFeedback = async (bookingId, feedbackData) => {
  try {
    const response = await api.post(`/mentors/bookings/${bookingId}/review`, feedbackData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get mentor reviews
export const getMentorReviews = async (mentorId) => {
  try {
    const response = await api.get(`/mentors/${mentorId}/reviews`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
