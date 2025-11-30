import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    title: "",
    description: "",
    experienceType: "",
    street: "",
    city: "",
    country: "",
    coordinates: { lat: 0, lng: 0 },
    pricePerPerson: 0,
    duration: "",
    groupSize: { min: 1, max: 10 },
    schedule: [],
    ageRequirement: "",
    fitnessLevel: "",
    requirements: [],
    images: [],
    inclusions: [],
};

const experienceFormSlice = createSlice({
    name: "experienceForm",
    initialState,
    reducers: {
        updateExperienceForm: (state, action) => {
            return { ...state, ...action.payload };
        },
        resetExperienceForm: () => initialState,
        addExperienceImage: (state, action) => {
            state.images.push(...action.payload);
        },
        removeExperienceImage: (state, action) => {
            state.images = state.images.filter((_, i) => i !== action.payload);
        },
        addExperienceRequirement: (state, action) => {
            state.requirements.push(action.payload);
        },
        removeExperienceRequirement: (state, action) => {
            state.requirements = state.requirements.filter((_, i) => i !== action.payload);
        },
    },
});

export const {
    updateExperienceForm,
    resetExperienceForm,
    addExperienceImage,
    removeExperienceImage,
    addExperienceRequirement,
    removeExperienceRequirement,
} = experienceFormSlice.actions;

export default experienceFormSlice.reducer;
