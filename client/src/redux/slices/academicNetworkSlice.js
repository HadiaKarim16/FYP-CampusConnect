import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getNetworkProfiles,
  sendConnectionRequest as sendConnectionRequestApi,
  acceptConnectionRequest as acceptConnectionRequestApi,
  rejectConnectionRequest as rejectConnectionRequestApi,
  getPendingRequests as getPendingRequestsApi,
} from '../../api/networkApi';

export const fetchProfiles = createAsyncThunk(
  'academicNetwork/fetchProfiles',
  async (_, { rejectWithValue }) => {
    try {
      return await getNetworkProfiles();
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch network profiles');
    }
  }
);

export const sendConnectionRequest = createAsyncThunk(
  'academicNetwork/sendConnectionRequest',
  async (profileId, { rejectWithValue }) => {
    try {
      const response = await sendConnectionRequestApi(profileId);
      return response.profileId;
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to send connection request');
    }
  }
);

export const fetchPendingRequests = createAsyncThunk(
  'academicNetwork/fetchPendingRequests',
  async (_, { rejectWithValue }) => {
    try {
      return await getPendingRequestsApi();
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch pending requests');
    }
  }
);

export const acceptConnection = createAsyncThunk(
  'academicNetwork/acceptConnection',
  async (connectionId, { rejectWithValue }) => {
    try {
      await acceptConnectionRequestApi(connectionId);
      return connectionId;
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to accept connection');
    }
  }
);

export const rejectConnection = createAsyncThunk(
  'academicNetwork/rejectConnection',
  async (connectionId, { rejectWithValue }) => {
    try {
      await rejectConnectionRequestApi(connectionId);
      return connectionId;
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to reject connection');
    }
  }
);

const initialState = {
  items: [],
  filteredItems: [],
  pendingRequests: [],
  status: 'idle',
  error: null,
  actionLoading: {},
  filters: {
    search: '',
    department: 'All',
    interests: 'All',
    society: 'All',
    role: 'All',
    sortBy: 'name',
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 6,
  },
};

const applyFilters = (items, filters) => {
  let result = [...items];

  // 1. Search
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.department?.toLowerCase().includes(q) ||
      p.bio?.toLowerCase().includes(q)
    );
  }
  // 2. Department
  if (filters.department !== 'All') {
    result = result.filter(p => p.department === filters.department);
  }
  // 3. Role
  if (filters.role !== 'All') {
    result = result.filter(p => p.role === filters.role);
  }
  // 4. Interests
  if (filters.interests !== 'All') {
    result = result.filter(p => p.academicInterests?.includes(filters.interests));
  }
  // 5. Society
  if (filters.society !== 'All') {
    result = result.filter(p => p.societies?.includes(filters.society));
  }
  // 6. Sort
  result.sort((a, b) => {
    if (filters.sortBy === 'name') return a.name.localeCompare(b.name);
    if (filters.sortBy === 'role') return a.role.localeCompare(b.role);
    if (filters.sortBy === 'department') {
      const depA = a.department || '';
      const depB = b.department || '';
      return depA.localeCompare(depB);
    }
    return 0;
  });

  return result;
};

const academicNetworkSlice = createSlice({
  name: 'academicNetwork',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      const { field, value } = action.payload;
      state.filters[field] = value;
      state.pagination.currentPage = 1;
      state.filteredItems = applyFilters(state.items, state.filters);
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.currentPage = 1;
      state.filteredItems = applyFilters(state.items, state.filters);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfiles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProfiles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.filteredItems = applyFilters(state.items, state.filters);
      })
      .addCase(fetchProfiles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      // Send connection request
      .addCase(sendConnectionRequest.pending, (state, action) => {
        state.actionLoading[action.meta.arg] = true;
      })
      .addCase(sendConnectionRequest.fulfilled, (state, action) => {
        state.actionLoading[action.payload] = false;
        const profile = state.items.find(p => p.id === action.payload);
        if (profile) profile.connectionStatus = 'pending';
        const filteredProfile = state.filteredItems.find(p => p.id === action.payload);
        if (filteredProfile) filteredProfile.connectionStatus = 'pending';
      })
      .addCase(sendConnectionRequest.rejected, (state, action) => {
        state.actionLoading[action.meta.arg] = false;
      })
      // Fetch pending requests
      .addCase(fetchPendingRequests.fulfilled, (state, action) => {
        state.pendingRequests = action.payload;
      })
      // Accept connection
      .addCase(acceptConnection.fulfilled, (state, action) => {
        state.pendingRequests = state.pendingRequests.filter(r => r._id !== action.payload);
      })
      // Reject connection
      .addCase(rejectConnection.fulfilled, (state, action) => {
        state.pendingRequests = state.pendingRequests.filter(r => r._id !== action.payload);
      });
  },
});

export const { setFilter, setPage, clearFilters } = academicNetworkSlice.actions;

export const selectFilteredProfiles = (state) => state.academicNetwork.filteredItems;
export const selectPaginatedProfiles = (state) => {
  const { filteredItems, pagination } = state.academicNetwork;
  const start = (pagination.currentPage - 1) * pagination.itemsPerPage;
  return filteredItems.slice(start, start + pagination.itemsPerPage);
};
export const selectTotalPages = (state) => {
  const { filteredItems, pagination } = state.academicNetwork;
  return Math.ceil(filteredItems.length / pagination.itemsPerPage) || 1;
};
export const selectFilters = (state) => state.academicNetwork.filters;
export const selectCurrentPage = (state) => state.academicNetwork.pagination.currentPage;
export const selectActionLoading = (state) => state.academicNetwork.actionLoading;
export const selectPendingRequests = (state) => state.academicNetwork.pendingRequests || [];

export default academicNetworkSlice.reducer;
