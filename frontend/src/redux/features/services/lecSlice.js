import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    lecInfo: localStorage.getItem("lecInfo")
    ? JSON.parse(localStorage.getItem("lecInfo"))
    : null,

    lecId: localStorage.getItem("lecId")
    ? JSON.parse(localStorage.getItem("lecId"))
    : null,
};

const lecSlice = createSlice({
    name: "lec",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.lecInfo = action.payload;
            localStorage.setItem("lecInfo", JSON.stringify(action.payload));
            const expirationTimeLec = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
            localStorage.setItem("expirationTimeLec", expirationTimeLec);
        },

        setLecId: (state, action) => {
            state.lecId = action.payload;
            localStorage.setItem("lecId", JSON.stringify(action.payload));
            const expirationTimeLecId = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
            localStorage.setItem("expirationTimeLecId", expirationTimeLecId);
        },

        logout: (state) => {
            state.lecInfo = null;
            state.lecId=null;
            
        },

      
    },
});

export const {setCredentials, logout,setLecId} = lecSlice.actions;

export default lecSlice.reducer;