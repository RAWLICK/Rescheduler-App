import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "../app/Slice";
import { persistStore, persistReducer } from 'redux-persist';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
    key: 'root',                                    // Key for storage
    storage: AsyncStorage,                          // Use AsyncStorage as storage engine
    whitelist: ['LocalStorageInfoSliceReducer', 'ScheduleArraySliceReducer', 'ExistingSubjectsArraySliceReducer', 'StudentsDataArraySliceReducer', 'DemoArraySliceReducer', 'StudentInfoSliceReducer']       // Specify slices to persist
  };

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const Store = configureStore({
    reducer: persistedReducer,
    // Used this middleware because getting "non-serializable values" warning. Don't know why
    // Non-serializable values are the ones which cannot be easily converted into JSON or string format
    // JSON-safe means (objects, arrays, strings, numbers, etc.).
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore these actions
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
          // ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          // Optionally ignore specific paths in the state
          ignoredPaths: ['register'],
        },
      }),
})

// typeof gives you the type of a function.
// ReturnType gives you the type of what the function returns.

export type RootState = ReturnType<typeof Store.getState>

export const persistor = persistStore(Store);