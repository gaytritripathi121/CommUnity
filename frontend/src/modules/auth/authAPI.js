import axios from '../../shared/axios';

export const loginAPI = async (data) => {
  const res = await axios.post('/auth/login', data);
  return res.data;
};

export const registerAPI = async (data) => {
  const res = await axios.post('/auth/register', data);
  return res.data;
};