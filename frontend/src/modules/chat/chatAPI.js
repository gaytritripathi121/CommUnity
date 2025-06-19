import axios from '../../shared/axios'; // Adjust path as needed

const getMessages = (userId, recipientId) =>
  axios.get(`/chat/${userId}/${recipientId}`).then(res => res.data);

const sendMessage = (userId, recipientId, text) =>
  axios.post(`/chat/${recipientId}`, { text }).then(res => res.data);

export default { getMessages, sendMessage };
