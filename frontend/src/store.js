import { configureStore } from '@reduxjs/toolkit';
import authReducer from './modules/auth/authSlice';
import communityReducer from './modules/community/communitySlice';
import foodReducer from './modules/food/foodSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    community: communityReducer,
    food: foodReducer,
  },
});

export default store;
