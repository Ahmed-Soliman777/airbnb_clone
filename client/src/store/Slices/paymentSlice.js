import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const handlePayment = createAsyncThunk(
  "payment/handlePayment",
  async ({ reservationData }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reservationData),
        }
      );

      const data = await response.json();

      if (!response.ok) return rejectWithValue(data.message);

      return data.checkoutUrl; 
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: { loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(handlePayment.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(handlePayment.fulfilled, (state) => { state.loading = false; state.error = null; })
      .addCase(handlePayment.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default paymentSlice.reducer;
