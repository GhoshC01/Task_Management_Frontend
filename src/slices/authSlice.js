import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Your API URL

// Async thunk for registering a user
export const registerUser = createAsyncThunk('auth/registerUser', async ({ username, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { username, password });

    // Save the token to local storage
    localStorage.setItem('token', response.data.token);

    return response.data; // Return user data
  } catch (error) {
    // Handle error properly by using rejectWithValue to return custom error message
    console.error("Registration error:", error);
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Async thunk for logging in a user
export const loginUser = createAsyncThunk('auth/loginUser', async ({ username, password }) => {
  const response = await axios.post(`${API_URL}/login`, { username, password });
  localStorage.setItem('token', response.data.token); // Save the token to local storage
  return response.data; // Return user data
});

// Async thunk for logging out a user
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  localStorage.removeItem('token'); // Clear token from local storage
});

// Create an authentication slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null, // Holds user info
    status: null, // Status of login/logout/register
    error: null, // Holds error messages
  },
  reducers: {
    clearError: (state) => {
      state.error = null; // Clear error message
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; // Set error message returned from rejectWithValue
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = null;
      });
  },
});

// Export the reducer
export default authSlice.reducer;

// Export actions
export const { clearError } = authSlice.actions;
