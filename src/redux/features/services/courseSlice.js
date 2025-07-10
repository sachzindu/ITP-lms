import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    courseInfo: localStorage.getItem("courseInfo")
    ? JSON.parse(localStorage.getItem("courseInfo"))
    : null,
};

const courseSlice = createSlice({
    name: "course",
    initialState,
    reducers: {
        setCredientials: (state, action) => {
            state.courseInfo = action.payload;
            localStorage.setItem("courseInfo", JSON.stringify(action.payload));
            const expirationTimeClass = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
            localStorage.setItem("expirationTimeClass", expirationTimeClass);
        },

        logout: (state) => {
            state.courseInfo = null;
            
        },
    },
});

export const {setCredientials, logout} = courseSlice.actions;

export default courseSlice.reducer;