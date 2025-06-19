// File: src/modules/food/foodAPI.js
import axios from '../../axios';

export const fetchFoodPosts = async () => {
  const response = await axios.get('/api/food');
  return response.data;
};

export const createFoodPost = async (data) => {
  const response = await axios.post('/api/food', data);
  return response.data;
};
