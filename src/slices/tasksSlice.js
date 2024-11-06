import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Fetch tasks from the API
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { rejectWithValue }) => {
  const token = localStorage.getItem('token'); // Get the token from local storage
  try {
    const response = await axios.get(`${API_URL}/tasks`, {
      headers: { Authorization: `Bearer ${token}` }, // Include token in headers
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data); // Return error response
  }
});

// Create a new task
export const createTask = createAsyncThunk('tasks/createTask', async (taskData, { rejectWithValue }) => {
  const token = localStorage.getItem('token'); // Get the token from local storage
  console.log(token);
  
  try {
    const response = await axios.post(`${API_URL}/tasks`, taskData, {
      headers: { Authorization: `Bearer ${token}` }, // Include token in headers
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data); // Return error response
  }
});

// Update an existing task
export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, updatedData }, { rejectWithValue }) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.put(`${API_URL}/tasks/${id}`, updatedData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Delete a task
export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id, { rejectWithValue }) => {
  const token = localStorage.getItem('token');
  try {
    await axios.delete(`${API_URL}/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id; // Return the ID of the deleted task
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: { tasks: [], status: 'idle', error: null },
  reducers: {
    clearError: (state) => {
      state.error = null; // Clear error message
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading'; // Set status to loading
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload; // Populate tasks with fetched data
        state.status = 'succeeded'; // Set status to succeeded
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed'; // Set status to failed
        state.error = action.payload; // Set error message
      })
      .addCase(createTask.pending, (state) => {
        state.status = 'loading'; // Set status to loading
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload); // Add new task to the state
        state.status = 'succeeded'; // Set status to succeeded
      })
      .addCase(createTask.rejected, (state, action) => {
        state.status = 'failed'; // Set status to failed
        state.error = action.payload; // Set error message
      })
      .addCase(updateTask.pending, (state) => {
        state.status = 'loading'; // Set status to loading
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload; // Update the task
        }
        state.status = 'succeeded'; // Set status to succeeded
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.status = 'failed'; // Set status to failed
        state.error = action.payload; // Set error message
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload); // Remove the deleted task
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.status = 'failed'; // Set status to failed
        state.error = action.payload; // Set error message
      });
  },
});

// Export the clearError action
export const { clearError } = tasksSlice.actions;

export default tasksSlice.reducer;
