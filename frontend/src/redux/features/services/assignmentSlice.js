import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    assignmentInfo: localStorage.getItem("assignmentInfo")
    ? JSON.parse(localStorage.getItem("assignmentInfo"))
    : null,

    assignmentId: localStorage.getItem("assignmentId")
    ? JSON.parse(localStorage.getItem("assignmentId"))
    : null,
};

const assignmentSlice = createSlice({
    name: "assignment",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.assignmentInfo = action.payload;
            localStorage.setItem("assignmentInfo", JSON.stringify(action.payload));
            const expirationTimeAs = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
            localStorage.setItem("expirationTimeAs", expirationTimeAs);
        },

        setAssignmentId: (state, action) => {
            state.assignmentId = action.payload;
            localStorage.setItem("assignmentId", JSON.stringify(action.payload));
            const expirationTimeAsId = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
            localStorage.setItem("expirationTimeAsId", expirationTimeAsId);
        },

        logout: (state) => {
            state.assignmentInfo = null;
            state.assignmentId=null;
            localStorage.removeItem("assignmentInfo");
            localStorage.removeItem("assignmentId");
            localStorage.removeItem("expirationTimeAs");
            localStorage.removeItem("expirationTimeAsId");
            
        },

      
    },
});

export const {setCredentials, logout,setAssignmentId} = assignmentSlice.actions;

export default assignmentSlice.reducer;