import { configureStore } from "@reduxjs/toolkit";
import listingReducer from "./Slices/listingSlice";
import amenityReducer from "./Slices/amenitySlice";
import authReducer from "./Slices/authslice";
import languageReducer from './Slices/languageSlice';
import paymentReducer from './Slices/paymentSlice';

const store = configureStore({
  reducer: {
    listing: listingReducer,
    amenity: amenityReducer,
    auth: authReducer,
    lang: languageReducer,
    payment: paymentReducer,
  },
});

export default store;
