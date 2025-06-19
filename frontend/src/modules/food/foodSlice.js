import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchFoodPosts = createAsyncThunk('food/fetchFoodPosts', async () => {
  const { data } = await axios.get('/api/food');
  return data;
});

const foodSlice = createSlice({
  name: 'food',
  initialState: {
    foodPosts: [],
    loading: false,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchFoodPosts.pending, state => {
        state.loading = true;
      })
      .addCase(fetchFoodPosts.fulfilled, (state, action) => {
        state.foodPosts = action.payload;
        state.loading = false;
      });
  },
});

export default foodSlice.reducer;