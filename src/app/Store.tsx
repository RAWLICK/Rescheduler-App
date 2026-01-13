import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "../app/Slice";
import { persistStore, persistReducer, createMigrate } from 'redux-persist';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const migrations = {
  // ⚠️ Never try to change this version 1, all changes should be done in version 2. 
  // ⚠️ Change the version number in persistConfig below also when making changes.
  1: (state: any) => {
    if (!state) return state;

    return {
      ...state,

      LocalStorageInfoSliceReducer: {
        ...state.LocalStorageInfoSliceReducer,

        // ✅ new keys with safe default values
        "VideoPlayed": false,
        "Schedule_Walkthrough_Completed": false,
        "Statistics_Walkthrough_Completed": false
      }
    }

  }
}

// const migrations = {
//   1: (state: any) => {
//     if (!state) return state;

//     const localSlice = state.LocalStorageInfoSliceReducer || {};
//     const localInfo = localSlice.LocalStorageInfoInitialState || {};

//     return {
//       ...state,

//       LocalStorageInfoSliceReducer: {
//         ...localSlice,

//         LocalStorageInfoInitialState: {
//           ...localInfo,

//           // ✅ new keys safely added
//           VideoPlayed: localInfo.VideoPlayed ?? false,
//           Schedule_Walkthrough_Completed: localInfo.Schedule_Walkthrough_Completed ?? false,
//           Statistics_Walkthrough_Completed: localInfo.Statistics_Walkthrough_Completed ?? false,
//         },
//       },
//     };
//   },
// };


const persistConfig = {
    key: 'root',                                    // Key for storage
    version: 1,                                     // Migration Version Number
    storage: AsyncStorage,                          // Use AsyncStorage as storage engine
    whitelist: ['LocalStorageInfoSliceReducer', 'ScheduleArraySliceReducer', 'ExistingSubjectsArraySliceReducer', 'StudentsDataArraySliceReducer', 'StudentInfoSliceReducer'],       // Specify slices to persist
    migrate: createMigrate(migrations, { debug: false }),
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