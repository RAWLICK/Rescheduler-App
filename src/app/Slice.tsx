// nanoid helps in generating unique IDs.
import { createSlice} from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import { ScheduleArrayItem } from "../Components/Screens/AddTiming";
import ExistingSubjects from "../Components/Screens/ExistingSubjects";
// export type ExistingSubjectsArrayItem = {
//     Work: string;
//     Duration: string
// }

export type StudentInfoDataType = {
    "uniqueID": string,
    "Name": string,
    "Phone Number": string | undefined,
    "Date Joined": string,
    "Email ID": string,
    "Gender": string,
    "Streak": string,
    "Subscription Type": string,
    "Distribution Name": string,
    "Distribution Branch": string,
    "Distribution ID": string,
    "City": string,
    "State": string,
    "Country": string
    "Type of Account": string
}

export type ExistingSubjectsDataframeArrayTypeItem = {
    "Date": string,
    "Percentage": string,
    "Duration": string,
    "Work-Done-For": string
}

export type ExistingSubjectsArrayItem = {
    "uniqueID": string,
    "Subject": string,
    "Current_Duration": string,
    "Dataframe": ExistingSubjectsDataframeArrayTypeItem[]
}

export type StudentsDataArrayType = {
    "uniqueID": string,
    "Student_Name": string,
    "Phone_Number": string,
    "Branch": string
}

// Initial State could both be array or object but we are using object beacause it can store a lot of things
const initialState = {
    StudentInfoInitialState : {} as StudentInfoDataType,
    ScheduleArrayInitialState: [] as ScheduleArrayItem[],
    ExistingSubjectsArrayInitialState: [] as ExistingSubjectsArrayItem[],
    StudentsDataArrayInitialState: [] as StudentsDataArrayType[]
}

// Slices have name which completely depends on you but keep in mind to make a legitmate name because when you will use redux-toolkit for chrome extension, then this slice name will be the one to be displayed. There will be multiple slices and each slice will have a name, initialState and reducers.

// Inside reducers there are properties and functions. Inside the functions of reducers, you will always get two things. One is state other is action which are from syntax only.

// State gives access to the values which are present currently in initialState as the values in initialState will get to change in future.

// Action is used to perform some action like removing the todo. So the values which will be required to put inside removeToDo like ID comes from action

// Payload is a type of object which is used to store email, ids etc.

export const StudentInfoSlice = createSlice({
    name: 'StudentInfo',
    initialState,
    reducers: {
        registerUserInfo: (state, action) => {
            const Info = {
                "uniqueID": action.payload.uniqueID,
                "Name": action.payload.Name,
                "Phone Number": action.payload['Phone Number'],
                "Date Joined": action.payload['Date Joined'],
                "Email ID": action.payload['Email ID'],
                "Gender": action.payload.Gender,
                "Streak": action.payload.Streak,
                "Subscription Type": action.payload['Subscription Type'],
                "Distribution Name": action.payload['Distribution Name'],
                "Distribution Branch": action.payload['Distribution Branch'],
                "Distribution ID": action.payload['Distribution ID'],
                "City": action.payload.City,
                "State": action.payload.State,
                "Country": action.payload.Country,
                "Type of Account": action.payload['Type of Account']
            }
            state.StudentInfoInitialState = Info
        }
    }
})

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
            // const ExistingSubjectsObject = {
            //     "Work": action.payload.Work,
            //     "Duration": action.payload.Duration
            // }
            const ExistingSubjectsObject = {
                "uniqueID": action.payload.uniqueID,
                "Subject": action.payload.Subject,
                "Current_Duration": action.payload.Current_Duration,
                "Dataframe": [{
                    "Date": action.payload.Date,
                    "Percentage": action.payload.Percentage,
                    "Duration": action.payload.Duration,
                    "Work-Done-For": action.payload.Work_Done_For
                }]
            }
            state.ExistingSubjectsArrayInitialState.push(ExistingSubjectsObject)
        },
        removeExistingSubjectsObject: (state, action) => {
            state.ExistingSubjectsArrayInitialState = state.ExistingSubjectsArrayInitialState.filter((item) => item.uniqueID !== action.payload)
        },
        addSubjectStatsForDay: (state, action) => {
            const PerformedStat = {
                "Date": action.payload.Date,
                "Percentage": action.payload.Percentage,
                "Duration": action.payload.Duration,
                "Work-Done-For": action.payload.Work_Done_For
            }
            for (let index = 0; index < state.ExistingSubjectsArrayInitialState.length; index++) {
                const eachSubject = state.ExistingSubjectsArrayInitialState[index];
                if (eachSubject["uniqueID"] == action.payload.uniqueID) {
                    eachSubject["Dataframe"].push(PerformedStat)
                }
            }
        }
    }
})  

export const StudentsDataArraySlice = createSlice({
    name: 'StudentsDataArray',
    initialState,
    reducers: {
        addStudentObject: (state, action) => {
            const NewStudent = {
                "uniqueID": action.payload.uniqueID,
                "Student_Name": action.payload.Student_Name,
                "Phone_Number": action.payload.Phone_Number,
                "Branch": action.payload.Branch,
            }
            state.StudentsDataArrayInitialState.push(NewStudent)
        },

        removeStudentObject: (state, action) => {
            state.StudentsDataArrayInitialState = state.StudentsDataArrayInitialState.filter((item) => item.uniqueID !== action.payload)
        }
    }
})

// Exporting the functionalities(reducers) of slice individually because we will be using them individaully to update the states using them in components
export const { registerUserInfo } = StudentInfoSlice.actions
export const { addScheduleObject, removeScheduleObject } = ScheduleArraySlice.actions
export const { addExistingSubjectsObject, removeExistingSubjectsObject } = ExistingSubjectsArraySlice.actions
export const { addStudentObject, removeStudentObject } = StudentsDataArraySlice.actions

// Exporting reducers like this so that Store can have access to it because store also restricts access to the places from where the state could be updated.

const rootReducer = combineReducers({
    StudentInfoSliceReducer: StudentInfoSlice.reducer,
    ScheduleArraySliceReducer: ScheduleArraySlice.reducer,
    ExistingSubjectsArraySliceReducer: ExistingSubjectsArraySlice.reducer,
    StudentsDataArraySliceReducer: StudentsDataArraySlice.reducer
})

export { rootReducer };