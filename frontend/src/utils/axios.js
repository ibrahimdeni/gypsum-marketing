import axios from 'axios';

const api = axios.create({
  baseURL: '', // Kosong karena pake Vite proxy
});

// Auto-attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Optional: redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;