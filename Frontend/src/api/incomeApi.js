import axiosInstance from './axiosConfig';

export const getIncome = () => axiosInstance.get('/incomes');
export const setOrUpdateIncome = (amount) => axiosInstance.post(`/incomes?amount=${amount}`); 