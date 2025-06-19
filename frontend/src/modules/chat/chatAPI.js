import axios from '../../shared/axios';

const getMessages = async (userId, recipientId) => {
  const res = await axios.get(`/chat/${userId}/${recipientId}`);
  return res.data;
};

const sendMessage = async (userId, recipientId, text) => {
  const res = await axios.post(`/chat/${recipientId}`, { text });
  return res.data;
};

export default { getMessages, sendMessage };
