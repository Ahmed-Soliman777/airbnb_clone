import { configureStore } from "@reduxjs/toolkit";
import listingReducer from "./Slices/listingSlice";
import amenityReducer from "./Slices/amenitySlice";
import authReducer from "./Slices/authslice";
import languageReducer from "./Slices/languageSlice";
import wishlistReducer from "./Slices/wishlistSlice";

const store = configureStore({
  reducer: {
    listing: listingReducer,
    wishlist: wishlistReducer,
    amenity: amenityReducer,
    auth: authReducer,
    lang: languageReducer,
  },
});

export default store;
