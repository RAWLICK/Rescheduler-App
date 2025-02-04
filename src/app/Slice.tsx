// nanoid helps in generating unique IDs.
import { createSlice} from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import { ScheduleArrayItem } from "../Components/Screens/AddTiming";
import ExistingSubjects from "../Components/Screens/ExistingSubjects";
export type ExistingSubjectsArrayItem = {
    Work: string;
    Duration: string
}
// Initial State could both be array or object but we are using object beacause it can store a lot of things
const initialState = {
    ScheduleArrayInitialState: [] as ScheduleArrayItem[],
    ExistingSubjectsArrayInitialState: [] as ExistingSubjectsArrayItem[]
}

// Slices have name which completely depends on you but keep in mind to make a legitmate name because when you will use redux-toolkit for chrome extension, then this slice name will be the one to be displayed. There will be multiple slices and each slice will have a name, initialState and reducers.

// Inside reducers there are properties and functions. Inside the functions of reducers, you will always get two things. One is state other is action which are from syntax only.

// State gives access to the values which are present currently in initialState as the values in initialState will get to change in future.

// Action is used to perform some action like removing the todo. So the values which will be required to put inside removeToDo like ID comes from action

// Payload is a type of object which is used to store email, ids etc.

export const ScheduleArraySlice = createSlice({
    name: 'ScheduleArray',
    initialState,
    reducers: {
        addScheduleObject: (state, action) => {
            const ScheduleObject = {
                "uniqueID": action.payload.uniqueID,
                "StartTime": action.payload.StartTime,
                "EndTime": action.payload.EndTime,
                "Work": action.payload.Work,
                "StartAngle": action.payload.StartAngle,
                "EndAngle": action.payload.EndAngle,
                "TaskDate": action.payload.TaskDate,
                "Slice_Color":action.payload.Slice_Color
            }
            state.ScheduleArrayInitialState.push(ScheduleObject)
            state.ScheduleArrayInitialState.sort((a, b) => {
                const formatDate = (dateStr: string) => {
                    const [day, month, year] = dateStr.split("/"); // Split dd-mm-yyyy
                    return new Date(`${year}-${month}-${day}`);   // Convert to yyyy-mm-dd
                };
        
                const dateA = formatDate(a.TaskDate);
                const dateB = formatDate(b.TaskDate);
        
                // Compare TaskDate first
                // 1.   return -1:
                // •	Indicates that dateA should come before dateB in the sorted array.
                // 2.	return 1:
                // •	Indicates that dateA should come after dateB in the sorted array.
                // 3.	return 0:
                // •	Indicates that dateA and dateB are considered equal in the sorting order.
            
                if (dateA < dateB) return -1;
                if (dateA > dateB) return 1;
        
                // If TaskDate is the same, compare StartAngle
                return a.StartAngle - b.StartAngle;
            });
        },
        removeScheduleObject: (state, action) => {
            state.ScheduleArrayInitialState = state.ScheduleArrayInitialState.filter((item) => item.uniqueID !== action.payload)
            state.ScheduleArrayInitialState.sort((a, b) => {
                const formatDate = (dateStr: string) => {
                    const [day, month, year] = dateStr.split("/"); // Split dd-mm-yyyy
                    return new Date(`${year}-${month}-${day}`);   // Convert to yyyy-mm-dd
                };
        
                const dateA = formatDate(a.TaskDate);
                const dateB = formatDate(b.TaskDate);
        
                // Compare TaskDate first
                if (dateA < dateB) return -1;
                if (dateA > dateB) return 1;
        
                // If TaskDate is the same, compare StartAngle
                return a.StartAngle - b.StartAngle;
            });
        },
    }
})

export const ExistingSubjectsArraySlice = createSlice({
    name: 'ExistingSubjectsArray',
    initialState,
    reducers: {
        addExistingSubjectsObject: (state, action) => {
            const ExistingSubjectsObject = {
                "Work": action.payload.Work,
                "Duration": action.payload.Duration
            }
            state.ExistingSubjectsArrayInitialState.push(ExistingSubjectsObject)
        },
        removeExistingSubjectsObject: (state, action) => {
            state.ExistingSubjectsArrayInitialState = state.ExistingSubjectsArrayInitialState.filter((item) => item.Work !== action.payload)
        }
    }
})    

// Exporting the functionalities(reducers) of slice individually because we will be using them individaully to update the states using them in components
export const { addScheduleObject, removeScheduleObject } = ScheduleArraySlice.actions
export const { addExistingSubjectsObject, removeExistingSubjectsObject } = ExistingSubjectsArraySlice.actions

// Exporting reducers like this so that Store can have access to it because store also restricts access to the places from where the state could be updated.

const rootReducer = combineReducers({
    ScheduleArraySliceReducer: ScheduleArraySlice.reducer,
    ExistingSubjectsArraySliceReducer: ExistingSubjectsArraySlice.reducer
})

export { rootReducer };