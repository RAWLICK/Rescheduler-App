import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "../app/Slice";

export const Store = configureStore({
    reducer: rootReducer
})