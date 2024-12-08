import {configureStore} from "@reduxjs/toolkit";
import {lightTimeReducer} from "./slices/lightTimeSlice";
import {websocketReducer} from "./slices/websocketSlice";


export const store = configureStore({
    reducer: {
        lightTime: lightTimeReducer,
        websocket: websocketReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});