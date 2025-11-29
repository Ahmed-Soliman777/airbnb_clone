import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/api/experiences";

// ============= Async thunk actions for experiences =================
export const getAllExperiences = createAsyncThunk(
    "experience/getAllExperiences",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const getExperienceById = createAsyncThunk(
    "experience/getExperienceById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const createExperience = createAsyncThunk(
    "experience/createExperience",
    async (experienceData, { rejectWithValue }) => {
        try {
            const response = await axios.post(API_URL, experienceData, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


export const updateExperience = createAsyncThunk(
    "experience/updateExperience",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, data, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deleteExperience = createAsyncThunk(
    "experience/deleteExperience",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/${id}`, {
                withCredentials: true
            });
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const getHostExperiences = createAsyncThunk(
    "experience/getHostExperiences",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/host/my-experiences`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// ============= Experience Slice =================
const experienceSlice = createSlice({
    name: "experience",
    initialState: {
        experiences: [],
        experience: null,
        hostExperiences: [],
        status: "active",
        error: null,
    },
    reducers: {
        clearExperienceError: (state) => {
            state.error = null;
        },
        clearCurrentExperience: (state) => {
            state.experience = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get all experiences
            .addCase(getAllExperiences.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getAllExperiences.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.experiences = action.payload;
            })
            .addCase(getAllExperiences.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            // Get experience by ID
            .addCase(getExperienceById.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getExperienceById.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.experience = action.payload;
            })
            .addCase(getExperienceById.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            // Create experience
            .addCase(createExperience.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createExperience.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.experiences.push(action.payload);
            })
            .addCase(createExperience.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            // Update experience
            .addCase(updateExperience.fulfilled, (state, action) => {
                const index = state.experiences.findIndex(
                    (exp) => exp._id === action.payload._id
                );
                if (index !== -1) state.experiences[index] = action.payload;
            })
            // Delete experience
            .addCase(deleteExperience.fulfilled, (state, action) => {
                state.experiences = state.experiences.filter(
                    (exp) => exp._id !== action.payload
                );
            })
            // Get host experiences
            .addCase(getHostExperiences.fulfilled, (state, action) => {
                state.hostExperiences = action.payload;
            });
    },
});

export const { clearExperienceError, clearCurrentExperience } =
    experienceSlice.actions;
export default experienceSlice.reducer;
