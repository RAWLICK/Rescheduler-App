import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "../app/Slice";

export const Store = configureStore({
    reducer: rootReducer
})

// typeof gives you the type of a function.
// ReturnType gives you the type of what the function returns.

export type RootState = ReturnType<typeof Store.getState>