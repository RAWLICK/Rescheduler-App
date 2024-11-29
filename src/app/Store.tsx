import { configureStore } from "@reduxjs/toolkit";
import todoReducer from '../app/Slice';

export const Store = configureStore({
    reducer: todoReducer
})