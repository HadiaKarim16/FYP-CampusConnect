import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllSocieties, joinSociety as joinSocietyApi, leaveSociety as leaveSocietyApi, getSocietyById } from '../../api/societyApi';

// Thunks — now calling the real backend at /api/v1/societies
export const fetchSocieties = createAsyncThunk('societies/fetchAll', async (filters = {}, { rejectWithValue }) => {
  try {
    const response = await getAllSocieties(filters);
    // Backend returns ApiResponse: { statusCode, data, message, success }
    return response.data;
  } catch (error) {
    return rejectWithValue(error?.message || 'Failed to fetch societies');
  }
});

export const fetchSocietyById = createAsyncThunk('societies/fetchById', async (societyId, { rejectWithValue }) => {
  try {
    const response = await getSocietyById(societyId);
    return response.data;
  } catch (error) {
    return rejectWithValue(error?.message || 'Failed to fetch society');
  }
});

export const joinSociety = createAsyncThunk('societies/join', async (societyId, { rejectWithValue }) => {
  try {
    const response = await joinSocietyApi(societyId);
    // Return both the response and societyId so the reducer can update the right item
    return { societyId, data: response.data };
  } catch (error) {
    return rejectWithValue(error?.message || 'Failed to join society');
  }
});

export const leaveSociety = createAsyncThunk('societies/leave', async (societyId, { rejectWithValue }) => {
  try {
    await leaveSocietyApi(societyId);
    return { societyId };
  } catch (error) {
    return rejectWithValue(error?.message || 'Failed to leave society');
  }
});

const societiesSlice = createSlice({
  name: 'societies',
  initialState: {
    items: [],
    currentSociety: null,
    status: 'idle',
    error: null,
    actionLoading: {},
  },
  reducers: {
    clearCurrentSociety: (state) => {
      state.currentSociety = null;
    },
  },
  extraReducers: (builder) => {
    // fetchSocieties
    builder
      .addCase(fetchSocieties.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchSocieties.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = Array.isArray(action.payload) ? action.payload : (action.payload?.docs || action.payload?.societies || []);
      })
      .addCase(fetchSocieties.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });

    // fetchSocietyById
    builder
      .addCase(fetchSocietyById.pending, (state) => { state.actionLoading.currentSociety = true; })
      .addCase(fetchSocietyById.fulfilled, (state, action) => {
        state.actionLoading.currentSociety = false;
        state.currentSociety = action.payload;
      })
      .addCase(fetchSocietyById.rejected, (state, action) => {
        state.actionLoading.currentSociety = false;
        state.error = action.payload || action.error.message;
      });

    // joinSociety
    builder
      .addCase(joinSociety.pending, (state, action) => { state.actionLoading[action.meta.arg] = true; })
      .addCase(joinSociety.fulfilled, (state, action) => {
        state.actionLoading[action.meta.arg] = false;
        // Mark the society as joined in the local items list
        const index = state.items.findIndex(s => s._id === action.payload.societyId);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], isMember: true };
        }
      })
      .addCase(joinSociety.rejected, (state, action) => {
        state.actionLoading[action.meta.arg] = false;
        state.error = action.payload || action.error.message;
      });

    // leaveSociety
    builder
      .addCase(leaveSociety.pending, (state, action) => { state.actionLoading[action.meta.arg] = true; })
      .addCase(leaveSociety.fulfilled, (state, action) => {
        state.actionLoading[action.meta.arg] = false;
        const index = state.items.findIndex(s => s._id === action.payload.societyId);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], isMember: false };
        }
      })
      .addCase(leaveSociety.rejected, (state, action) => {
        state.actionLoading[action.meta.arg] = false;
        state.error = action.payload || action.error.message;
      });
  }
});

export const { clearCurrentSociety } = societiesSlice.actions;
export default societiesSlice.reducer;

// Selectors
export const selectAllSocieties = (state) => state.societiesLegacy?.items || [];
export const selectCurrentSociety = (state) => state.societiesLegacy?.currentSociety || null;
export const selectMySocieties = (state) => (state.societiesLegacy?.items || []).filter(s => s.isMember);
export const selectDiscoverSocieties = (state) => (state.societiesLegacy?.items || []).filter(s => !s.isMember);
export const selectSocietiesStatus = (state) => state.societiesLegacy?.status || 'idle';
export const selectSocietyActionLoading = (state, societyId) => !!state.societiesLegacy?.actionLoading?.[societyId];
