// src/api/stockApi.js
import axiosInstance from './axiosConfig';

const BASE_URL = 'http://localhost:8099/stocks';

export const getAllStocks = () => axiosInstance.get(BASE_URL);
export const createStock = (stockData) => axiosInstance.post(BASE_URL, stockData);
export const deleteStock = (id) => axiosInstance.delete(`${BASE_URL}/${id}`);
export const updateStock = (id, stockData) => axiosInstance.put(`${BASE_URL}/${id}`, stockData);
export const getStocksByUser = (userId) => axiosInstance.get(`${BASE_URL}/user/${userId}`);
export const getStocksByMonth = (userId, month, year) => axiosInstance.get(`${BASE_URL}/by-month/${userId}/${month}/${year}`);

// Stock Transactions CRUD
export const getAllStockTransactions = () => axiosInstance.get('/stock-transactions');
export const createStockTransaction = (data) => axiosInstance.post('/stock-transactions', data);
export const updateStockTransaction = (id, data) => axiosInstance.put(`/stock-transactions/${id}`, data);
export const deleteStockTransaction = (id) => axiosInstance.delete(`/stock-transactions/${id}`);
export const getStockTransactionById = (id) => axiosInstance.get(`/stock-transactions/${id}`);




