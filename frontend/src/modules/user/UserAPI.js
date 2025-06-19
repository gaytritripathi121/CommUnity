import axios from '../../shared/axios'; // Adjust import path as needed

/**
 * Fetches user profile data by user ID.
 * @param {string} userId
 * @returns {Promise<Object>} user data
 */
const getUser = async (userId) => {
  try {
    const res = await axios.get(`/auth/profile/${userId}`);
    return res.data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error.response?.data || error;
  }
};

/**
 * Updates user profile data (including avatar if present).
 * @param {string} userId
 * @param {FormData} formData
 * @returns {Promise<Object>} updated user data
 */
const updateUser = async (userId, formData) => {
  try {
    const res = await axios.put(`/auth/profile/${userId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (error) {
    console.error('Failed to update user:', error);
    throw error.response?.data || error;
  }
};

export default { getUser, updateUser };
