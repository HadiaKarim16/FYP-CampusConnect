/**
 * src/api/mock/mockStorage.js
 * Centralized utility for reading and writing to localStorage
 * to simulate a database. Includes simulated network delay.
 */

const STORAGE_KEY_PREFIX = 'cc_mock_';
const DEFAULT_DELAY_MS = 300;

export const delay = (ms = DEFAULT_DELAY_MS) => new Promise(res => setTimeout(res, ms));

export const mockStorage = {
  // Get all items for a key
  get: (key) => {
    try {
      const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}${key}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error(`Error reading ${key} from storage:`, e);
      return null;
    }
  },

  // Set replacing all items for a key
  set: (key, data) => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${key}`, JSON.stringify(data));
    } catch (e) {
      console.error(`Error writing ${key} to storage:`, e);
    }
  },

  // Initialize data ONLY IF it doesn't already exist
  initialize: (key, initialData) => {
    if (!localStorage.getItem(`${STORAGE_KEY_PREFIX}${key}`)) {
      mockStorage.set(key, initialData);
    }
  },

  // Update a specific item by ID
  updateItem: (key, itemId, updates) => {
    const list = mockStorage.get(key) || [];
    const index = list.findIndex(item => item._id === itemId || item.id === itemId);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      mockStorage.set(key, list);
      return list[index];
    }
    return null;
  },

  // Add a new item
  addItem: (key, newItem) => {
    const list = mockStorage.get(key) || [];
    const itemWithId = { ...newItem, _id: newItem._id || `id_${Date.now()}` };
    list.push(itemWithId);
    mockStorage.set(key, list);
    return itemWithId;
  },

  // FIX BUG 1: Generic update method — reads current data, applies a transform fn, writes back.
  // Used by notificationsApi for markAsRead / markAllAsRead / delete operations.
  update: (key, transformFn) => {
    try {
      const current = mockStorage.get(key);
      const updated = transformFn(current);
      mockStorage.set(key, updated);
      return updated;
    } catch (e) {
      console.error(`Error updating ${key} in storage:`, e);
      return null;
    }
  },

  // Remove an item by ID
  removeItem: (key, itemId) => {
    const list = mockStorage.get(key) || [];
    const filtered = list.filter(item => item._id !== itemId && item.id !== itemId);
    mockStorage.set(key, filtered);
    return true;
  }
};
