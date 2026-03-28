import { mockStorage, delay } from './mockStorage';

export const tasksApi = {
  getAll: async () => {
    await delay();
    return mockStorage.get('tasks') || [];
  },

  createTask: async (taskData) => {
    await delay();
    const newTask = {
      _id: `task_${Date.now()}`,
      title: taskData.title,
      priority: taskData.priority || 'medium',
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    return mockStorage.addItem('tasks', newTask);
  },

  updateTaskStatus: async (taskId, status) => {
    await delay();
    const task = mockStorage.updateItem('tasks', taskId, { status });
    if (!task) throw new Error("Task not found");
    return task;
  },

  deleteTask: async (taskId) => {
    await delay();
    const success = mockStorage.removeItem('tasks', taskId);
    if (!success) throw new Error("Task not found");
    return taskId;
  }
};
