import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginAPI, registerAPI } from './authAPI';

// Thunks for login and register
export const loginUser = createAsyncThunk('auth/login', async (data, thunkAPI) => {
  try {
    const response = await loginAPI(data);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (data, thunkAPI) => {
  try {
    const response = await registerAPI(data);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false, error: null },
  reducers: {
    rehydrateUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || action.payload;
        state.error = null;

        if (action.payload && action.payload.token) {
          localStorage.setItem('token', action.payload.token);
        }
        if (action.payload && action.payload.user && action.payload.user._id) {
          localStorage.setItem('userId', action.payload.user._id);
        } else if (action.payload && action.payload._id) {
          localStorage.setItem('userId', action.payload._id);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || action.payload;
        state.error = null;

        if (action.payload && action.payload.token) {
          localStorage.setItem('token', action.payload.token);
        }
        if (action.payload && action.payload.user && action.payload.user._id) {
          localStorage.setItem('userId', action.payload.user._id);
        } else if (action.payload && action.payload._id) {
          localStorage.setItem('userId', action.payload._id);
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      });
  },
});

export const { rehydrateUser, logout } = authSlice.actions;
export default authSlice.reducer;
