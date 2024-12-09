// nanoid helps in generating unique IDs.
import { createSlice, nanoid } from "@reduxjs/toolkit";

// Initial State could both be array or object but we are using object beacause it can store a lot of things
const initialState = {
    todos: [{id: "1", text: "Hello World"}],
    colorInitialState: [{id: "1", text: "Blue"}]
}

// Slices have name which completely depends on you but keep in mind to make a legitmate name because when you will use redux-toolkit for chrome extension, then this slice name will be the one to be displayed. There will be multiple slices and each slice will have a name, initialState and reducers.
// Inside reducers there are properties and functions. Inside the functions of reducers, you will always get two things. One is state other is action which are from syntax only.
// State gives access to the values which are present currently in initialState as the values in initialState will get to change in future.
// Action is used to perform some action like removing the todo. So the values which will be required to put inside removeToDo like ID comes from action
// Payload is a type of object which is used to store email, ids etc.

export const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        addTodo: (state, action) => {
            const todo = {
                id: nanoid(),
                text: action.payload
            }
            state.todos.push(todo)
        },
        removeTodo: (state, action) => {
            state.todos = state.todos.filter((todo) => todo.id !== action.payload)
        }
    }
})

export const colorSlice = createSlice({
    name: 'colorNaming',
    initialState,
    reducers: {
        addColorReducer: (state, action) => {
            const color = {
                id: nanoid(),
                text: action.payload
            }
            state.colorInitialState.push(color)
        }
    }
})

// Exporting the functionalities(reducers) of slice individually because we will be using them individaully to update the states using them in components
export const {addTodo, removeTodo} = todoSlice.actions
export const { addColorReducer } = colorSlice.actions

// Exporting reducers like this so that Store can have access to it because store also restricts access to the places from where the state could be updated.
export default todoSlice.reducer
// export 