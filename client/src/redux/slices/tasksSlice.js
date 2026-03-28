import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tasksApi } from '../../api/mock/tasksApi';

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async () => {
  return await tasksApi.getAll();
});

export const createTask = createAsyncThunk('tasks/create', async (taskData) => {
  return await tasksApi.createTask(taskData);
});

export const updateTaskStatus = createAsyncThunk('tasks/updateStatus', async ({ taskId, status }) => {
  return await tasksApi.updateTaskStatus(taskId, status);
});

export const deleteTask = createAsyncThunk('tasks/delete', async (taskId) => {
  return await tasksApi.deleteTask(taskId);
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    actionLoading: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    // fetch
    builder.addCase(fetchTasks.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchTasks.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload; })
      .addCase(fetchTasks.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message; });
    
    // create
    builder.addCase(createTask.pending, (state) => { state.status = 'loading'; })
      .addCase(createTask.fulfilled, (state, action) => { 
        state.status = 'succeeded'; 
        state.items.push(action.payload); // Optimistic addition
      })
      .addCase(createTask.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message; });

    // updateStatus
    builder.addCase(updateTaskStatus.pending, (state, action) => { state.actionLoading[action.meta.arg.taskId] = true; })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.actionLoading[action.meta.arg.taskId] = false;
        const index = state.items.findIndex(t => t._id === action.payload._id);
        if (index !== -1) Object.assign(state.items[index], action.payload);
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.actionLoading[action.meta.arg.taskId] = false;
        state.error = action.error.message;
      });

    // delete
    builder.addCase(deleteTask.pending, (state, action) => { state.actionLoading[action.meta.arg] = true; })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.actionLoading[action.meta.arg] = false; // arg is taskId
        state.items = state.items.filter(t => t._id !== action.meta.arg);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.actionLoading[action.meta.arg] = false;
        state.error = action.error.message;
      });
  }
});

export default tasksSlice.reducer;

// Selectors
export const selectAllTasks = (state) => state.tasks.items;
export const selectTasksByStatus = (status) => (state) => state.tasks.items.filter(t => t.status === status);
export const selectTaskActionLoading = (state, taskId) => !!state.tasks.actionLoading[taskId];
