import api from './axios';

/**
 * Campus API functions
 */

// Get all campuses
export const getAllCampuses = async () => {
  try {
    const response = await api.get('/campuses');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get campus by ID
export const getCampusById = async (id) => {
  try {
    const response = await api.get(`/campuses/id/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
