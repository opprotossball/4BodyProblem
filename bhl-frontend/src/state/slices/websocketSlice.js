import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {websocketApi} from "../../api/websocketApi";

const SLICE_NAME = 'websocket';

export const fetchWebsocket = createAsyncThunk(
    'websocket/fetchWebsocket',
    async ({userId}) => {
        return await websocketApi.get(userId);
    }
);

const initialState = {
    websocketUrl: '',
    error: null,
    loading: false
}

const websocketSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchWebsocket.pending, state => {
                state.loading = true;
            })
            .addCase(fetchWebsocket.fulfilled, (state, action) => {
                console.log(action);
                state.loading = initialState.loading;
                state.websocketUrl = action.payload.websocket_url;
            })
            .addCase(fetchWebsocket.rejected, (state, action) => {
                state.loading = initialState.loading;
                state.error = action;
                state.websocketUrl = initialState.websocketUrl;
            })
    }
})

export const websocketReducer = websocketSlice.reducer;
