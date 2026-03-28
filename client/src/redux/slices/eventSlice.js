import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllEvents } from '../../api/eventApi';

// ===== ASYNC THUNKS =====
export const fetchUpcomingEvents = createAsyncThunk(
  'events/fetchUpcoming',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await getAllEvents({ ...filters, limit: 5 });
      // The API uses pagination, so the array is in response.data or response directly.
      // Usually it's response.data or response array.
      const data = response.data || response;
      if (data && Array.isArray(data.docs)) return data.docs;
      if (data && Array.isArray(data.items)) return data.items;
      if (data && Array.isArray(data)) return data;
      return [];
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch events');
    }
  }
);

const initialState = {
  events: [],
  upcomingEvents: [],
  registeredEvents: [],
  selectedEvent: null,
  loading: false,
  error: null,
};

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents: (state, action) => {
      state.events = action.payload;
    },
    setUpcomingEvents: (state, action) => {
      state.upcomingEvents = action.payload;
    },
    setRegisteredEvents: (state, action) => {
      state.registeredEvents = action.payload;
    },
    addEvent: (state, action) => {
      state.events.push(action.payload);
    },
    updateEvent: (state, action) => {
      const index = state.events.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = { ...state.events[index], ...action.payload };
      }
    },
    removeEvent: (state, action) => {
      state.events = state.events.filter((e) => e.id !== action.payload);
    },
    registerForEvent: (state, action) => {
      const event = state.events.find((e) => e.id === action.payload);
      if (event && !state.registeredEvents.find((e) => e.id === action.payload)) {
        state.registeredEvents.push(event);
      }
    },
    unregisterFromEvent: (state, action) => {
      state.registeredEvents = state.registeredEvents.filter(
        (e) => e.id !== action.payload
      );
    },
    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload;
    },
    setEventLoading: (state, action) => {
      state.loading = action.payload;
    },
    setEventError: (state, action) => {
      state.error = action.payload;
    },
    clearEventError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUpcomingEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.upcomingEvents = action.payload;
      })
      .addCase(fetchUpcomingEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Actions
export const {
  setEvents,
  setUpcomingEvents,
  setRegisteredEvents,
  addEvent,
  updateEvent,
  removeEvent,
  registerForEvent,
  unregisterFromEvent,
  setSelectedEvent,
  setEventLoading,
  setEventError,
  clearEventError,
} = eventSlice.actions;

// Selectors
export const selectAllEvents = (state) => state.events.events;
export const selectUpcomingEvents = (state) => state.events.upcomingEvents;
export const selectRegisteredEvents = (state) => state.events.registeredEvents;
export const selectSelectedEvent = (state) => state.events.selectedEvent;
export const selectEventLoading = (state) => state.events.loading;
export const selectEventError = (state) => state.events.error;
export const selectEventById = (eventId) => (state) =>
  state.events.events.find((event) => event.id === eventId);

// Reducer
export default eventSlice.reducer;
