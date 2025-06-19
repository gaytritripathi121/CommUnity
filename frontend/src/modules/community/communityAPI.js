import axios from '../../shared/axios';

// Fetch all communities
export const fetchCommunities = async () => {
  const response = await axios.get('/communities');
  return response.data;
};

// Fetch community by ID
export const fetchCommunityById = async (id) => {
  const response = await axios.get(`/communities/${id}`);
  return response.data;
};

// Create a new community
export const createCommunity = async (data) => {
  const response = await axios.post('/communities', data);
  return response.data;
};

// Fetch communities by cause category
export const fetchCommunitiesByCategory = async (category) => {
  const response = await axios.get(`/communities/category/${encodeURIComponent(category)}`);
  return response.data;
};