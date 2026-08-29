import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the JWT to every outgoing request, if we have one
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vh_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Centralize 401 handling: token missing/expired/invalid -> clear it and
// bounce to login. Adjust the redirect to match whatever router you use.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('vh_token');
      localStorage.removeItem('vh_admin');
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
