import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Create report
export const reportListing = createAsyncThunk(
  "report/reportListing",
  async ({ listingId, reason, details }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/api/reports`,
        {
          listingId,
          reason,
          details,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to submit report"
      );
    }
  }
);

// Get user's reports
export const getUserReports = createAsyncThunk(
  "report/getUserReports",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/reports/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch reports"
      );
    }
  }
);

const reportSlice = createSlice({
  name: "report",
  initialState: {
    reports: [],
    currentReport: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearReportError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Report listing
      .addCase(reportListing.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(reportListing.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentReport = action.payload.report;
        state.reports.unshift(action.payload.report);
      })
      .addCase(reportListing.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Get user reports
      .addCase(getUserReports.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getUserReports.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reports = action.payload.reports;
      })
      .addCase(getUserReports.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearReportError } = reportSlice.actions;
export default reportSlice.reducer;
