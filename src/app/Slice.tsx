// nanoid helps in generating unique IDs.
import { createSlice} from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import { ScheduleArrayItem } from "../Components/Screens/AddTiming";

export type LocalStorageInfoDataType = {
    "IsLoggedIn": boolean,
    "IsFirstLaunch": boolean,
}

export type StudentInfoDataType = {
    "uniqueID": string,
    "Name": string,
    "Phone Number": string | undefined,
    "Date Joined": string,
    "Email ID": string,
    "Gender": string,
    "Streak": number,
    "Subscription Type": string,
    "Distribution Name": string,
    "Distribution Branch": string,
    "Distribution ID": string,
    "City": string,
    "State": string,
    "Country": string
    "Type of Account": string,
    "RescheduledTimes": number
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
    LocalStorageInfoInitialState: [{
        "IsLoggedIn": false,
        "IsFirstLaunch": true
    }] as LocalStorageInfoDataType[],
    StudentInfoInitialState : [] as StudentInfoDataType[],
    ScheduleArrayInitialState: [] as ScheduleArrayItem[],
    ExistingSubjectsArrayInitialState: [] as ExistingSubjectsArrayItem[],
    StudentsDataArrayInitialState: [] as StudentsDataArrayType[],
    DemoArrayInitialState: {"DemoStatus": true} as { "DemoStatus": boolean }
}

// Slices have name which completely depends on you but keep in mind to make a legitmate name because when you will use redux-toolkit for chrome extension, then this slice name will be the one to be displayed. There will be multiple slices and each slice will have a name, initialState and reducers.

// Inside reducers there are properties and functions. Inside the functions of reducers, you will always get two things. One is state other is action which are from syntax only.

// State gives access to the values which are present currently in initialState as the values in initialState will get to change in future.

// Action is used to perform some action like removing the todo. So the values which will be required to put inside removeToDo like ID comes from action

// Payload is a type of object which is used to store email, ids etc.

export const LocalStorageInfoSlice = createSlice({
    name: 'LocalStorageInfo',
    initialState: initialState.LocalStorageInfoInitialState,
    reducers: {
        updateLocalStorageInfo: (state, action) => {
            if (action.payload == "Login") {
                state[0]["IsLoggedIn"] = true
            }
            else if (action.payload == "Logout") {
                state[0]["IsLoggedIn"] = false
            }
            else if (action.payload == "FirstLaunch") {
                state[0]["IsFirstLaunch"] = false
            }
        }
    }
})

export const StudentInfoSlice = createSlice({
    name: 'StudentInfo',
    initialState: initialState.StudentInfoInitialState,
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
                "Type of Account": action.payload['Type of Account'],
                "RescheduledTimes": action.payload['RescheduledTimes'] || 0 // Default to 0 if not provided
            }
            state[0] = Info;
        },
        updateStreakInfo: (state, action) => {
            if (action.payload == "Increase") {
                state[0]["Streak"] += 1
            }
            else if (action.payload == "Vanish") {
                state[0]["Streak"] = 1
            }
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
        addWholeScheduleArray: (state, action) => {
            const ScheduleArray = action.payload;
            state.ScheduleArrayInitialState = []
            for (let index = 0; index < ScheduleArray.length; index++) {
                const element = ScheduleArray[index];
                const ScheduleObject = {
                    "uniqueID": element.uniqueID,
                    "StartTime": element.StartTime,
                    "EndTime": element.EndTime,
                    "Work": element.Work,
                    "StartAngle": element.StartAngle,
                    "EndAngle": element.EndAngle,
                    "TaskDate": element.TaskDate,
                    "Slice_Color": element.Slice_Color
                }
                state.ScheduleArrayInitialState.push(ScheduleObject)
            }
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
        }
    }
})

export const ExistingSubjectsArraySlice = createSlice({
    name: 'ExistingSubjectsArray',
    initialState,
    reducers: {
        addExistingSubjectsObject: (state, action) => {
            const ExistingSubjectsObject = {
                "uniqueID": action.payload.uniqueID,
                "Subject": action.payload.Subject,
                "Current_Duration": action.payload.Current_Duration,
                "Dataframe": []
            }
            state.ExistingSubjectsArrayInitialState.push(ExistingSubjectsObject)
        },
        EditExistingSubjectObject: (state, action) => {
            const foundSubject = state.ExistingSubjectsArrayInitialState.find((item) => item.uniqueID === action.payload.uniqueID);
            if (foundSubject) {
                foundSubject.Subject = action.payload.Subject;
                foundSubject.Current_Duration = action.payload.Current_Duration;
            }
        },
        addExistingSubjectsWorkDoneObject: (state, action) => {
            const PercentageArray = action.payload
            for (let index = 0; index < PercentageArray.length; index++) {
                const element = PercentageArray[index];
                const findInSubject = state.ExistingSubjectsArrayInitialState.find((item) => item["uniqueID"] === element.SubjectUniqueID);
                if (findInSubject) {
                    findInSubject["Dataframe"].push(element.ProgressInfo);
                }
                else {
                    console.log("Not Found")
                }
            }
            for (let index = 0; index < state.ExistingSubjectsArrayInitialState.length; index++) {
                const element = state.ExistingSubjectsArrayInitialState[index];
                if (element["Dataframe"].length >= 2) {
                    element["Dataframe"].sort((a, b) => {
                        const formatDate = (dateStr: string) => {
                            const [day, month, year] = dateStr.split("/"); // Split dd-mm-yyyy
                            return new Date(`${year}-${month}-${day}`);   // Convert to yyyy-mm-dd
                        };

                        const dateA = formatDate(a.Date);
                        const dateB = formatDate(b.Date);
                
                        // Compare Date first
                        if (dateA < dateB) return -1;
                        if (dateA > dateB) return 1;
                        return 0;
                    });
                }
            }
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
        },
        addWholeExistingSubjectsArray: (state, action) => {
            const ExistingSubjectsArray = action.payload;
            state.ExistingSubjectsArrayInitialState = []
            for (let index = 0; index < ExistingSubjectsArray.length; index++) {
                const element = ExistingSubjectsArray[index];
                const ExistingSubjectsObject = {
                    "uniqueID": element.uniqueID,
                    "Subject": element.Subject,
                    "Current_Duration": element.Current_Duration,
                    "Dataframe": element.Dataframe || [] // Ensure Dataframe is initialized as an empty array if not provided
                }
                state.ExistingSubjectsArrayInitialState.push(ExistingSubjectsObject)
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
        },
        addWholeStudentsDataArray: (state, action) => {
            const StudentsDataArray = action.payload;
            state.StudentsDataArrayInitialState = []
            for (let index = 0; index < StudentsDataArray.length; index++) {
                const element = StudentsDataArray[index];
                const NewStudent = {
                    "uniqueID": element.uniqueID,
                    "Student_Name": element.Student_Name,
                    "Phone_Number": element.Phone_Number,
                    "Branch": element.Branch,
                }
                state.StudentsDataArrayInitialState.push(NewStudent)
            }
        }
    }
})

export const DemoArraySlice = createSlice({
    name: 'DemoArray',
    initialState: initialState.DemoArrayInitialState,
    reducers: {
        updateDemoStatus: (state, action) => {
            state.DemoStatus = action.payload;
            console.log("Demo Data Updated")
        }
    }
})

// Exporting the functionalities(reducers) of slice individually because we will be using them individaully to update the states using them in components
export const { updateLocalStorageInfo } = LocalStorageInfoSlice.actions
export const { registerUserInfo, updateStreakInfo } = StudentInfoSlice.actions
export const { addScheduleObject, removeScheduleObject, addWholeScheduleArray } = ScheduleArraySlice.actions
export const { addExistingSubjectsObject, EditExistingSubjectObject, addExistingSubjectsWorkDoneObject, removeExistingSubjectsObject, addWholeExistingSubjectsArray } = ExistingSubjectsArraySlice.actions
export const { addStudentObject, removeStudentObject, addWholeStudentsDataArray } = StudentsDataArraySlice.actions
export const { updateDemoStatus } = DemoArraySlice.actions

// Exporting reducers like this so that Store can have access to it because store also restricts access to the places from where the state could be updated.

const rootReducer = combineReducers({
    LocalStorageInfoSliceReducer: LocalStorageInfoSlice.reducer,
    StudentInfoSliceReducer: StudentInfoSlice.reducer,
    ScheduleArraySliceReducer: ScheduleArraySlice.reducer,
    ExistingSubjectsArraySliceReducer: ExistingSubjectsArraySlice.reducer,
    StudentsDataArraySliceReducer: StudentsDataArraySlice.reducer,
    DemoArraySliceReducer: DemoArraySlice.reducer
})

export { rootReducer };