import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../shared/axios';  // Use your axios instance with baseURL


// Fetch communities filtered by type
export const fetchCommunitiesByType = createAsyncThunk(
'community/fetchCommunitiesByType',
async (type) => {
const url = type ? '/communities?type=${encodeURIComponent(type)}' : '/communities';
const { data } = await axios.get(url);
return data;
}
);


const communitySlice = createSlice({
name: 'community',
initialState: {
communities: [],
loading: false,
},
reducers: {},
extraReducers: builder => {
builder
.addCase(fetchCommunitiesByType.pending, (state) => {
state.loading = true;
})
.addCase(fetchCommunitiesByType.fulfilled, (state, action) => {
state.communities = Array.isArray(action.payload) ? action.payload : [];
state.loading = false;
});
},
});


export default communitySlice.reducer;