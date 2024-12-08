import {configureStore} from "@reduxjs/toolkit";
import {lightTimeReducer} from "./slices/lightTimeSlice";


export const store = configureStore({
    reducer: {
        lightTime: lightTimeReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});