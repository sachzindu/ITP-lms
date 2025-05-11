import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "../api/apiSlice.js";
import authReducer from "../features/auth/authSlice.js"
import courseReducer from '../features/services/courseSlice.js'
import classIdReducer from '../features/services/classIdSlice.js'
import lecReducer from '../features/services/lecSlice.js'
import assignmentReducer from '../features/services/assignmentSlice.js'

const store = configureStore({
    reducer: { 
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        course:courseReducer,
        classId:classIdReducer,
        lec:lecReducer,
        assignment:assignmentReducer
        
    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});

setupListeners(store.dispatch);
export default store;