import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  timeout: 15000,
  withCredentials: true, // CRITICAL: sends HTTP-only cookies (refreshToken) with every request
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor: Attach access token ────────────────────────────────
api.interceptors.request.use(
  (config) => {
    try {
      const authState = localStorage.getItem('authState');
      const token = authState ? JSON.parse(authState)?.token : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Invalid JSON in localStorage — ignore
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Auto-refresh expired access tokens ─────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh on 401 errors, and NOT for auth-related endpoints
    const isAuthEndpoint = originalRequest?.url?.includes('/login') ||
                           originalRequest?.url?.includes('/register') ||
                           originalRequest?.url?.includes('/refresh-token');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // Another refresh is already in flight — queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // The refreshToken is sent automatically via the HTTP-only cookie (withCredentials: true)
        const { data } = await axios.post(
          `${api.defaults.baseURL}/users/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = data.data.accessToken;

        // Update the stored token in localStorage
        try {
          const authState = JSON.parse(localStorage.getItem('authState') || '{}');
          authState.token = newAccessToken;
          localStorage.setItem('authState', JSON.stringify(authState));
        } catch { /* ignore */ }

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed — force logout
        processQueue(refreshError, null);
        localStorage.removeItem('authState');
        sessionStorage.clear();
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Non-401 errors: log and reject
    if (error.response) {
      const { status } = error.response;
      if (status === 403) {
        console.error('Access denied:', error.response.data?.message);
      } else if (status === 500) {
        console.error('Server error:', error.response.data?.message);
      }
    } else if (error.request) {
      console.error('Network error — backend may be offline:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;

