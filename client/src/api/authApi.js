import api from './axios';

/**
 * Authentication API functions
 * Endpoints aligned with backend routes: /api/v1/users/...
 */

// User registration
export const signup = async (formData) => {
  try {
    // formData should be a FormData object (for avatar/coverImage uploads)
    const response = await api.post('/users/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Network error — is the backend running?' };
  }
};

// User login
export const login = async (credentials) => {
  try {
    // credentials: { email, displayName, password }
    const response = await api.post('/users/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Network error — is the backend running?' };
  }
};

// Logout user
export const logout = async () => {
  try {
    const response = await api.post('/users/logout');
    localStorage.removeItem('authState');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Refresh access token
export const refreshToken = async () => {
  try {
    const response = await api.post('/users/refresh-token');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get current logged-in user
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/users/current-user');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Change password
export const changePassword = async (oldPassword, newPassword, confirmPassword) => {
  try {
    const response = await api.patch('/users/change-password', {
      oldPassword,
      newPassword,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update account details (profile info)
export const updateAccountDetails = async (profileData) => {
  try {
    const response = await api.patch('/users/update-account', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update academic info
export const updateAcademicInfo = async (academicData) => {
  try {
    const response = await api.patch('/users/update-academic', academicData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update avatar
export const updateAvatar = async (formData) => {
  try {
    const response = await api.patch('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update cover image
export const updateCoverImage = async (formData) => {
  try {
    const response = await api.patch('/users/cover-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
