import { createSlice } from "@reduxjs/toolkit";

const panSlide = createSlice(
    {
        name: "pans",
        initialState: {
            pans: {
                pan: null,
                isFetching: false,
                error: false
            },
            updatePan: {
                pan: null,
                isFetching: false,
                error: false
            }
        },
        reducers: {
            getPanStart: (state) => {
                state.pans.isFetching = true;
            },
            getPanSuccess: (state, action) => {
                state.pans.isFetching = true;
                state.pans.pan = action.payload;
            },
            getPanFail: (state) => {
                state.pans.isFetching = false;
                state.pans.error = true;
            },

            updatePanStart: (state) => {
                state.updatePan.isFetching = true;
            },
            updatePanSuccess: (state, action) => {
                state.updatePan.isFetching = true;
                state.updatePan.pan = action.payload;
            },
            updatePanFail: (state) => {
                state.updatePan.isFetching = false;
                state.updatePan.error = true;
            }
        }
    }
)
export const {
    getPanFail,
    getPanStart,
    getPanSuccess,
    updatePanFail,
    updatePanStart,
    updatePanSuccess
} = panSlide.actions

export default panSlide.reducer