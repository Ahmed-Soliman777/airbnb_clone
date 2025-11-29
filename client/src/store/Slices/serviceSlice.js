import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "/api/services";

// ============= Async thunk actions for services =================
export const getAllServices = createAsyncThunk(
  "service/getAllServices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getServiceById = createAsyncThunk(
  "service/getServiceById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createService = createAsyncThunk(
  "service/createService",
  async (serviceData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, serviceData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateService = createAsyncThunk(
  "service/updateService",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, data, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteService = createAsyncThunk(
  "service/deleteService",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        withCredentials: true,
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getHostServices = createAsyncThunk(
  "service/getHostServices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/host/my-services`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ============= Service Slice =================
const serviceSlice = createSlice({
  name: "service",
  initialState: {
    services: [],
    service: null,
    hostServices: [],
    status: "active",
    error: null,
  },
  reducers: {
    clearServiceError: (state) => {
      state.error = null;
    },
    clearCurrentService: (state) => {
      state.service = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all services
      .addCase(getAllServices.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllServices.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.services = action.payload;
      })
      .addCase(getAllServices.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Get service by ID
      .addCase(getServiceById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getServiceById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.service = action.payload;
      })
      .addCase(getServiceById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Create service
      .addCase(createService.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.services.push(action.payload);
      })
      .addCase(createService.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Update service
      .addCase(updateService.fulfilled, (state, action) => {
        const index = state.services.findIndex(
          (svc) => svc._id === action.payload._id
        );
        if (index !== -1) state.services[index] = action.payload;
      })
      // Delete service
      .addCase(deleteService.fulfilled, (state, action) => {
        state.services = state.services.filter(
          (svc) => svc._id !== action.payload
        );
      })
      // Get host services
      .addCase(getHostServices.fulfilled, (state, action) => {
        state.hostServices = action.payload;
      });
  },
});

export const { clearServiceError, clearCurrentService } = serviceSlice.actions;
export default serviceSlice.reducer;
