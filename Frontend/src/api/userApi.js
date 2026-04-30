import axiosInstance from './axiosConfig';

export const getUsers = () => axiosInstance.get('/users');
export const getUserById = (id) => axiosInstance.get(`/users/${id}`);
export const addUser = (user) => axiosInstance.post('/users', user);
export const updateUser = (id, user) => axiosInstance.put(`/users/${id}`, user);
export const deleteUser = (id) => axiosInstance.delete(`/users/${id}`);
export const updateUserByUsername = (username, user) => axiosInstance.put(`/users/${username}`, user);

export const loginUser = (username, password) =>
  axiosInstance.post(
    '/api/auth/login',
    new URLSearchParams({ username, password }),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      withCredentials: true
    }
  );

export const forgotPassword = (email) =>
  axiosInstance.post('/api/auth/forgot-password', { email });

export const resetPassword = (token, newPassword) =>
  axiosInstance.post('/api/auth/reset-password', { token, newPassword });

export const logoutUser = () =>
  axiosInstance.post('/api/auth/logout', {}, { withCredentials: true });

export const checkAuth = () =>
  axiosInstance.get('/api/auth/check', { withCredentials: true });




