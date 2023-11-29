import { configureStore } from "@reduxjs/toolkit";
import roadcubeReducers from "./reducers/roadcubeSlice";

// Store
export const store = configureStore({
  reducer: {
    roadcube: roadcubeReducers,
  },
});
