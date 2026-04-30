import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8099';

// Log the API base URL for debugging
console.log('API Base URL:', API_BASE_URL);

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies for session-based authentication
});

// Add request interceptor to handle authentication
axiosInstance.interceptors.request.use(
  (config) => {
    // Add any additional headers if needed
    console.log('Making request to:', config.url, 'with method:', config.method);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle authentication errors
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ Response received from:', response.config.url, 'with status:', response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
      message: error.message
    });
    
    if (error.response && error.response.status === 401) {
      // Redirect to login if unauthorized
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (error.code === 'ERR_NETWORK') {
      console.error('🌐 Network Error: Unable to connect to backend server. Please check if the backend is running.');
    } else if (error.response && error.response.status === 404) {
      console.error('🔍 Not Found: The requested API endpoint does not exist.');
    } else if (error.response && error.response.status >= 500) {
      console.error('🚨 Server Error: Backend server encountered an error.');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;




