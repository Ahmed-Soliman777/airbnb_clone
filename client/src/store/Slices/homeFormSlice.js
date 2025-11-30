import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    title: "",
    description: "",
    propertyType: "",
    street: "",
    city: "",
    country: "",
    coordinates: { lat: 0, lng: 0 },
    pricePerNight: 0,
    cleaningFee: 0,
    maxGuests: 1,
    bedrooms: 1,
    bathrooms: 1,
    images: [],
    amenities: [],
    availability: [],
};

const homeFormSlice = createSlice({
    name: "homeForm",
    initialState,
    reducers: {
        updateHomeForm: (state, action) => {
            return { ...state, ...action.payload };
        },
        resetHomeForm: () => initialState,
        addHomeImage: (state, action) => {
            state.images.push(...action.payload);
        },
        removeHomeImage: (state, action) => {
            state.images = state.images.filter((_, i) => i !== action.payload);
        },
    },
});

export const {
    updateHomeForm,
    resetHomeForm,
    addHomeImage,
    removeHomeImage,
} = homeFormSlice.actions;

export default homeFormSlice.reducer;
