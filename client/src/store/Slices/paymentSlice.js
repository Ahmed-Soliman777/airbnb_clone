import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getCookie } from "@/utils/cookies";

const API_URL = "http://localhost:3000/api";

// Handle Stripe checkout - creates booking and returns checkout URL
export const handlePayment = createAsyncThunk(
  "payment/handlePayment",
  async (reservationData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/checkout`,
        reservationData,
        { withCredentials: true }
      );

      if (!response.data.checkoutUrl) {
        return rejectWithValue("No checkout URL received");
      }

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Verify payment status after Stripe redirect
export const verifyPayment = createAsyncThunk(
  "payment/verifyPayment",
  async (sessionId, { rejectWithValue }) => {
    try {
      const token = getCookie('token');
      const response = await axios.get(
        `${API_URL}/payment/verify/${sessionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch host payments/profits
export const fetchHostPayments = createAsyncThunk(
  "payment/fetchHostPayments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/payment/host`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    loading: false,
    error: null,
    checkoutUrl: null,
    bookingId: null,
    paymentStatus: null, // 'pending', 'success', 'failed'
    hostPayments: [], // Array of bookings with payment info for host
    hostPaymentsStatus: "idle", // 'idle', 'loading', 'succeeded', 'failed'
  },
  reducers: {
    clearPaymentState: (state) => {
      state.loading = false;
      state.error = null;
      state.checkoutUrl = null;
      state.bookingId = null;
      state.paymentStatus = null;
    },
    setPaymentStatus: (state, action) => {
      state.paymentStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle payment
      .addCase(handlePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handlePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.checkoutUrl = action.payload.checkoutUrl;
        state.bookingId = action.payload.bookingId;
      })
      .addCase(handlePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify payment
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentStatus = action.payload.status;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.paymentStatus = 'failed';
      })
      // Fetch host payments
      .addCase(fetchHostPayments.pending, (state) => {
        state.hostPaymentsStatus = "loading";
        state.error = null;
      })
      .addCase(fetchHostPayments.fulfilled, (state, action) => {
        state.hostPaymentsStatus = "succeeded";
        state.hostPayments = action.payload;
        state.error = null;
      })
      .addCase(fetchHostPayments.rejected, (state, action) => {
        state.hostPaymentsStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearPaymentState, setPaymentStatus } = paymentSlice.actions;
export default paymentSlice.reducer;
