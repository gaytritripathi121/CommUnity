import axios from '../../shared/axios';

const getUser = async (userId) => {
  const res = await axios.get(`/auth/profile/${userId}`);
  return res.data;
};

const updateUser = async (userId, formData) => {
  const res = await axios.put(`/auth/profile/${userId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

const blockUser = async (userId) => {
  const res = await axios.post(`/auth/block/${userId}`);
  return res.data;
};

export default { getUser, updateUser, blockUser };
