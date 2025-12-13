import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/api";

// Fetch user's bookings/reservations
export const fetchUserBookings = createAsyncThunk(
    "booking/fetchUserBookings",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/booking/user/${userId}`, {
                withCredentials: true
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Fetch single booking by ID
export const fetchBookingById = createAsyncThunk(
    "booking/fetchBookingById",
    async (bookingId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/booking/${bookingId}`, {
                withCredentials: true
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Create booking
export const createBooking = createAsyncThunk(
    "booking/createBooking",
    async (bookingData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/booking`, bookingData, {
                withCredentials: true
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Update booking status
export const updateBookingStatus = createAsyncThunk(
    "booking/updateBookingStatus",
    async ({ bookingId, status }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(
                `${API_URL}/booking/update/${bookingId}`,
                { status },
                { withCredentials: true }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Cancel booking
export const cancelBooking = createAsyncThunk(
    "booking/cancelBooking",
    async (bookingId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_URL}/booking/${bookingId}`, {
                withCredentials: true
            });
            return { bookingId, ...response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
export const fetchHostBookings = createAsyncThunk(
    "booking/fetchHostBookings",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/bookings/host`, {
                withCredentials: true
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const bookingSlice = createSlice({
    name: "booking",
    initialState: {
        bookings: [],
        hostBookings: [],
        currentBooking: null,
        status: "idle",
        error: null,
    },
    reducers: {
        clearCurrentBooking: (state) => {
            state.currentBooking = null;
        },
        clearBookingError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch user bookings
            .addCase(fetchUserBookings.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchUserBookings.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.bookings = action.payload;
            })
            .addCase(fetchUserBookings.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            // Fetch single booking
            .addCase(fetchBookingById.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchBookingById.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.currentBooking = action.payload;
            })
            .addCase(fetchBookingById.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            // Create booking
            .addCase(createBooking.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(createBooking.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.bookings.unshift(action.payload);
                state.currentBooking = action.payload;
            })
            .addCase(createBooking.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            // Update booking status
            .addCase(updateBookingStatus.fulfilled, (state, action) => {
                const index = state.bookings.findIndex(b => b._id === action.payload._id);
                if (index !== -1) {
                    state.bookings[index] = action.payload;
                }
                // Also update in hostBookings if it exists
                const hostIndex = state.hostBookings.findIndex(b => b._id === action.payload._id);
                if (hostIndex !== -1) {
                    state.hostBookings[hostIndex] = action.payload;
                }
                if (state.currentBooking?._id === action.payload._id) {
                    state.currentBooking = action.payload;
                }
            })
            // Cancel booking
            .addCase(cancelBooking.fulfilled, (state, action) => {
                state.bookings = state.bookings.filter(b => b._id !== action.payload.bookingId);
                state.hostBookings = state.hostBookings.filter(b => b._id !== action.payload.bookingId);
                if (state.currentBooking?._id === action.payload.bookingId) {
                    state.currentBooking = null;
                }
            })
            // Fetch host bookings
            .addCase(fetchHostBookings.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchHostBookings.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.hostBookings = action.payload;
            })
            .addCase(fetchHostBookings.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export const { clearCurrentBooking, clearBookingError } = bookingSlice.actions;
export default bookingSlice.reducer;