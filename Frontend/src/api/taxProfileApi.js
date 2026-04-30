import axiosInstance from './axiosConfig';

export const getTaxProfiles = () => axiosInstance.get('/taxprofiles');
export const getTaxProfileById = (id) => axiosInstance.get(`/taxprofiles/${id}`);
export const addTaxProfile = (profile) => axiosInstance.post('/taxprofiles', profile);
export const updateTaxProfile = (id, profile) => axiosInstance.put(`/taxprofiles/${id}`, profile);
export const deleteTaxProfile = (id) => axiosInstance.delete(`/taxprofiles/${id}`);




