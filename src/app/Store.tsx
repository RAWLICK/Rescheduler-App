import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "../app/Slice";
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';


const persistConfig = {
    key: 'root',                                    // Key for storage
    storage: AsyncStorage,                          // Use AsyncStorage as storage engine
    whitelist: ['ScheduleArraySliceReducer', 'ExistingSubjectsArraySliceReducer']       // Specify slices to persist
  };

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const Store = configureStore({
    reducer: persistedReducer
})

// typeof gives you the type of a function.
// ReturnType gives you the type of what the function returns.

export type RootState = ReturnType<typeof Store.getState>

export const persistor = persistStore(Store);