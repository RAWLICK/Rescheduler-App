// nanoid helps in generating unique IDs.
import { createSlice, nanoid } from "@reduxjs/toolkit";

// Initial State could both be array or object but we are using object beacause it can store a lot of things
const initialState = {
    todos: [{id: 1, text: "Hello World"}]
}

function sayHello () {
    console.log("Say Hello");
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
        removeTodo: () => {}
    }
})