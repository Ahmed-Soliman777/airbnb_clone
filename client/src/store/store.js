import { configureStore } from "@reduxjs/toolkit";
import listingReducer from "./Slices/listingSlice";
import amenityReducer from "./Slices/amenitySlice";
import authReducer from "./Slices/authslice";
import languageReducer from "./Slices/languageSlice";
import wishlistReducer from "./Slices/wishlistSlice";
import paymentReducer from "./Slices/paymentSlice";
import experienceReducer from "./Slices/experienceSlice";
import serviceReducer from "./Slices/serviceSlice";
import reviewReducer from "./Slices/reviewSlice";

const store = configureStore({
  reducer: {
    listing: listingReducer,
    wishlist: wishlistReducer,
    amenity: amenityReducer,
    auth: authReducer,
    lang: languageReducer,
    payment: paymentReducer,
    experience: experienceReducer,
    service: serviceReducer,
    review: reviewReducer,
  },
});

export default store;
