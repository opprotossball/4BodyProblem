import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {lightTimeApi} from "../../api/lightTimeApi";

const SLICE_NAME = 'lightTime';

export const fetchLightTime = createAsyncThunk(
    'lightTime/fetchLightTime',
    async () => {
        return await lightTimeApi.getLightTime();
    }
);

const initialState = {
    lightTime: 0,
    error: null,
    loading: false
}

const lightTimeSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchLightTime.pending, state => {
                state.loading = true;
            })
            .addCase(fetchLightTime.fulfilled, (state, action) => {
                state.loading = false;
                state.lightTime = action.payload.light_minutes;
            })
            .addCase(fetchLightTime.rejected, (state, action) => {
                state.loading = false;
                state.error = action;
                state.lightTime = initialState.lightTime;
            })
    }
})

export const lightTimeReducer = lightTimeSlice.reducer;
