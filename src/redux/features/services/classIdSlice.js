import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    classIdInfo: localStorage.getItem("classIdInfo")
    ? JSON.parse(localStorage.getItem("classIdInfo"))
    : null,
};

const classIdSlice = createSlice({
    name: "classId",
    initialState,
    reducers: {
        setDetails: (state, action) => {
            state.classIdInfo = action.payload;
            localStorage.setItem("classIdInfo", JSON.stringify(action.payload));
            const expirationTimeClass = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
            localStorage.setItem("expirationTimeClassId", expirationTimeClass);
        },

        logout: (state) => {
            state.classIdInfo = null;
            
        },
    },
});

export const {setDetails, logout} = classIdSlice.actions;

export default classIdSlice.reducer;