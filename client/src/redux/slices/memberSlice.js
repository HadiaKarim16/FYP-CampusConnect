import { createSlice } from '@reduxjs/toolkit';
import { sendConnectionRequest } from './academicNetworkSlice';

const initialState = {
  members: [],
  filteredMembers: [],
  searchQuery: '',
  loading: false,
  error: null,
};

const memberSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    setMembers: (state, action) => {
      // Ensure all members have connectionStatus if not existing
      const items = action.payload.map(m => ({ ...m, connectionStatus: m.connectionStatus || 'none' }));
      state.members = items;
      state.filteredMembers = items;
    },
    addMember: (state, action) => {
      const newMember = { ...action.payload, connectionStatus: action.payload.connectionStatus || 'none' };
      state.members.push(newMember);
      state.filteredMembers = state.members;
    },
    updateMember: (state, action) => {
      const index = state.members.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) {
        state.members[index] = { ...state.members[index], ...action.payload };
        state.filteredMembers = state.members;
      }
    },
    removeMember: (state, action) => {
      state.members = state.members.filter((m) => m.id !== action.payload);
      state.filteredMembers = state.members;
    },
    searchMembers: (state, action) => {
      state.searchQuery = action.payload;
      if (!action.payload) {
        state.filteredMembers = state.members;
      } else {
        const query = action.payload.toLowerCase();
        state.filteredMembers = state.members.filter(
          (member) =>
            member.name.toLowerCase().includes(query) ||
            member.role.toLowerCase().includes(query) ||
            member.interests.some((interest) =>
              interest.toLowerCase().includes(query)
            )
        );
      }
    },
    clearSearch: (state) => {
      state.searchQuery = '';
      state.filteredMembers = state.members;
    },
    setMemberLoading: (state, action) => {
      state.loading = action.payload;
    },
    setMemberError: (state, action) => {
      state.error = action.payload;
    },
    clearMemberError: (state) => {
      state.error = null;
    },
  },
  // FIX: Make memberSlice listen to the sendConnectionRequest from academicNetworkSlice
  // to update connection statuses locally in the Members page view
  extraReducers: (builder) => {
    builder.addCase(sendConnectionRequest.fulfilled, (state, action) => {
      const memberId = action.meta.arg; // The ID passed to dispatch(sendConnectionRequest(memberId))
      
      const member = state.members.find(m => m.id === memberId || m._id === memberId);
      if (member) {
        member.connectionStatus = 'pending';
      }
      
      const filtered = state.filteredMembers.find(m => m.id === memberId || m._id === memberId);
      if (filtered) {
        filtered.connectionStatus = 'pending';
      }
    });
  }
});

// Actions
export const {
  setMembers,
  addMember,
  updateMember,
  removeMember,
  searchMembers,
  clearSearch,
  setMemberLoading,
  setMemberError,
  clearMemberError,
} = memberSlice.actions;

// Selectors
export const selectAllMembers = (state) => state.members?.members || [];
export const selectFilteredMembers = (state) => state.members?.filteredMembers || [];
export const selectSearchQuery = (state) => state.members?.searchQuery || '';
export const selectMemberLoading = (state) => state.members?.loading || false;
export const selectMemberError = (state) => state.members?.error || null;
export const selectMemberById = (memberId) => (state) =>
  state.members?.members?.find((member) => member.id === memberId) || null;

// Reducer
export default memberSlice.reducer;
