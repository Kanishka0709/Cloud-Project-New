import axiosInstance from './axiosConfig';

export const addExpense = (expense) => axiosInstance.post('/expenses', expense);
export const getAllExpenses = () => axiosInstance.get('/expenses');
export const getExpenseById = (id) => axiosInstance.get(`/expenses/${id}`);
export const deleteExpense = (id) => axiosInstance.delete(`/expenses/${id}`);
export const updateExpense = (id, expense) => axiosInstance.put(`/expenses/${id}`, expense);
export const getExpensesByDate = (date) => axiosInstance.get(`/expenses/by-date/${date}`);
export const getExpensesByMonth = (month, year) => axiosInstance.get(`/expenses/by-month/${month}/${year}`);
export const getExpensesByYear = (year) => axiosInstance.get(`/expenses/by-year/${year}`);
export const getExpensesByMonthRange = (start, end, year) => axiosInstance.get(`/expenses/by-month-range?start=${start}&end=${end}&year=${year}`);




