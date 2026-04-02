import { configureStore } from "@reduxjs/toolkit";
import aiReducer from "./aiSlice";
import authReducer from "./auth";
import doctorReducer from "./doctor";
import userReducer from "./user";

const sepsis = configureStore({
  reducer: {
    ai: aiReducer,
    auth: authReducer,
    doctor: doctorReducer,
    user: userReducer,
  },
});

export default sepsis;
