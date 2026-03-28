import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { societyDetailApi } from '../../api/mock/societyDetailApi';

export const fetchSocietyDetail = createAsyncThunk(
  'societyDetail/fetchSocietyDetail',
  async (societyId) => {
    const response = await societyDetailApi.getById(societyId);
    return response;
  }
);

const societyDetailSlice = createSlice({
  name: 'societyDetail',
  initialState: {
    detail: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSocietyDetail.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSocietyDetail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.detail = action.payload;
      })
      .addCase(fetchSocietyDetail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const selectSocietyDetail = (state) => state.societyDetail.detail;
export const selectSocietyDetailStatus = (state) => state.societyDetail.status;
export const selectSocietyDetailError = (state) => state.societyDetail.error;

export default societyDetailSlice.reducer;
