import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/**
 * Tasks are stored in localStorage per-user so each user has their own task list.
 * Key format: cc_tasks_{userId}
 * If no userId is available, tasks are ephemeral (in-memory only).
 */

const getUserTasksKey = () => {
  try {
    const authState = JSON.parse(localStorage.getItem('authState') || '{}');
    const userId = authState?.user?._id || authState?.user?.id;
    return userId ? `cc_tasks_${userId}` : null;
  } catch {
    return null;
  }
};

const loadUserTasks = () => {
  const key = getUserTasksKey();
  if (!key) return [];
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
};

const saveUserTasks = (tasks) => {
  const key = getUserTasksKey();
  if (!key) return;
  try {
    localStorage.setItem(key, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks:', e);
  }
};

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async () => {
  return loadUserTasks();
});

export const createTask = createAsyncThunk('tasks/create', async (taskData) => {
  const newTask = {
    _id: `task_${Date.now()}`,
    title: taskData.title,
    priority: taskData.priority || 'medium',
    status: taskData.status || 'pending',
    dueDate: taskData.dueDate || null,
    createdAt: new Date().toISOString()
  };
  const tasks = loadUserTasks();
  tasks.push(newTask);
  saveUserTasks(tasks);
  return newTask;
});

export const updateTaskStatus = createAsyncThunk('tasks/updateStatus', async ({ taskId, status }) => {
  const tasks = loadUserTasks();
  const index = tasks.findIndex(t => t._id === taskId);
  if (index === -1) throw new Error("Task not found");
  tasks[index] = { ...tasks[index], status };
  saveUserTasks(tasks);
  return tasks[index];
});

export const deleteTask = createAsyncThunk('tasks/delete', async (taskId) => {
  const tasks = loadUserTasks();
  const filtered = tasks.filter(t => t._id !== taskId);
  saveUserTasks(filtered);
  return taskId;
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    actionLoading: {},
  },
  reducers: {
    clearTasks: (state) => {
      state.items = [];
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    // fetch
    builder.addCase(fetchTasks.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchTasks.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload; })
      .addCase(fetchTasks.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message; });

    // create
    builder.addCase(createTask.pending, (state) => { state.status = 'loading'; })
      .addCase(createTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
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
        state.actionLoading[action.meta.arg] = false;
        state.items = state.items.filter(t => t._id !== action.meta.arg);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.actionLoading[action.meta.arg] = false;
        state.error = action.error.message;
      });
  }
});

export const { clearTasks } = tasksSlice.actions;
export default tasksSlice.reducer;

// Selectors
export const selectAllTasks = (state) => state.tasks.items;
export const selectTasksByStatus = (status) => (state) => state.tasks.items.filter(t => t.status === status);
export const selectTaskActionLoading = (state, taskId) => !!state.tasks.actionLoading[taskId];
