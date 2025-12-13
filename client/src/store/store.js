import { configureStore } from "@reduxjs/toolkit";
import listingReducer from "./Slices/listingSlice";
import amenityReducer from "./Slices/amenitySlice";
import authReducer from "./Slices/authslice";
import languageReducer from './Slices/languageSlice';
import paymentReducer from './Slices/paymentSlice';
import experienceReducer from './Slices/experienceSlice';
import serviceReducer from './Slices/serviceSlice';
import experienceFormReducer from './Slices/experienceFormSlice';
import serviceFormReducer from './Slices/serviceFormSlice';
import homeFormReducer from './Slices/homeFormSlice';
import wishlistReducer from './Slices/wishlistSlice';
import messagesReducer from './Slices/messagesSlice';
import bookingReducer from "./Slices/bookingSlice";

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
    experienceForm: experienceFormReducer,
    serviceForm: serviceFormReducer,
    homeForm: homeFormReducer,
    messages: messagesReducer,
    booking: bookingReducer,
  },
});

export default store;
