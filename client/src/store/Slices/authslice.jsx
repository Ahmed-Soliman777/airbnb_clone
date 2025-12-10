import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

//  Register
export const registerUser = createAsyncThunk(
  "/register",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      return data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.message);
    }
  }
);

// login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await fetch(`api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

//  Verify email
export const verifyEmail = createAsyncThunk(
  "/verifyEmail",
  async ({ email, code }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Verification failed");

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// forget Password
export const forgetPassword = createAsyncThunk(
  "auth/forgetPassword",
  async (email, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/forget-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Request failed");
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
//resend verify email
export const resendVerification = createAsyncThunk(
  "/resendVerification",
  async (data, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/resend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",

        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to resend code");
      return result;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Fetch current user from token
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/profile`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch user");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/logout`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Logout failed");
      // Clear the token cookie
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Registration successful!";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //  Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.successMessage = "Login successful!";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //  Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;

        state.successMessage = "Email verified successfully!";
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // resend verfify email
      .addCase(resendVerification.pending, (state) => {
        state.loading = true;
      })
      .addCase(resendVerification.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //  Forget Password
      .addCase(forgetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgetPassword.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Reset link sent to your email.";
      })
      .addCase(forgetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch current user
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.successMessage = "Logged out successfully!";
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearMessages } = authSlice.actions;
export default authSlice.reducer;