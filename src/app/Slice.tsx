// nanoid helps in generating unique IDs.
import { createSlice, nanoid } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";

// Initial State could both be array or object but we are using object beacause it can store a lot of things
const initialState = {
    ScheduleArrayInitialState: [
        {
            "StartTime": "06:00",
            "EndTime": "07:00",
            "Work": "Physics",
            "StartAngle": 180,
            "EndAngle": 210,
            "TaskDate": "01/01/2025",
            "Slice_Color": "Green"
        }
    ]
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
                "StartTime": action.payload.StartTime,
                "EndTime": action.payload.EndTime,
                "Work": action.payload.Work,
                "StartAngle": action.payload.StartAngle,
                "EndAngle": action.payload.EndAngle,
                "TaskDate": action.payload.TaskDate,
                "Slice_Color":action.payload.Slice_Color
            }
            state.ScheduleArrayInitialState.push(ScheduleObject)
        },
        removeScheduleObject: (state, action) => {
            state.ScheduleArrayInitialState = state.ScheduleArrayInitialState.filter((item) => item.Work !== action.payload)
        }
    }
})

// Exporting the functionalities(reducers) of slice individually because we will be using them individaully to update the states using them in components
export const { addScheduleObject, removeScheduleObject } = ScheduleArraySlice.actions

// Exporting reducers like this so that Store can have access to it because store also restricts access to the places from where the state could be updated.

const rootReducer = combineReducers({
    ScheduleArraySliceReducer: ScheduleArraySlice.reducer
})

export { rootReducer };