import axiosInstance from './axiosConfig';

export const getInvestments = () => axiosInstance.get('/goals');
export const getInvestmentById = (id) => axiosInstance.get(`/goals/${id}`);
export const addInvestment = (investment) => axiosInstance.post('/goals', investment);
export const updateInvestment = (id, investment) => axiosInstance.put(`/goals/${id}`, investment);
export const deleteInvestment = (id) => axiosInstance.delete(`/goals/${id}`);
export const getInvestmentsByMonth = (userId, month, year) => axiosInstance.get(`/investments/by-month/${userId}/${month}/${year}`);

// Investment Transaction CRUD
export const getTransactions = () => axiosInstance.get('/transactions');
export const getTransactionById = (id) => axiosInstance.get(`/transactions/${id}`);
export const addTransaction = (tx) => axiosInstance.post('/transactions', tx);
export const updateTransaction = (id, data) => axiosInstance.put(`/transactions/${id}`, data);
export const deleteTransaction = (id) => axiosInstance.delete(`/transactions/${id}`);




