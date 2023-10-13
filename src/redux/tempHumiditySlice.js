import { createSlice } from "@reduxjs/toolkit";

const tempHumiditySlide = createSlice(
    {
        name: "tempHumiditys",
        initialState: {
            tempHumiditys: {
                tempHumidity: null,
                isFetching: false,
                error: false
            },
            temps: {
                temp: [],
                isFetching: false,
                error: false
            },
        },
        reducers: {
            getTempHumidityStart: (state) => {
                state.tempHumiditys.isFetching = true;
            },
            getTempHumiditySuccess: (state, action) => {
                state.tempHumiditys.isFetching = true;
                state.tempHumiditys.tempHumidity = action.payload;
            },
            getTempHumidityFail: (state) => {
                state.tempHumiditys.isFetching = false;
                state.tempHumiditys.error = true;
            },

            getTempStart: (state) => {
                state.temps.isFetching = true;
            },
            getTempSuccess: (state, action) => {
                state.temps.isFetching = true;
                state.temps.temp = action.payload;
            },
            getTempFail: (state) => {
                state.temps.isFetching = false;
                state.temps.error = true;
            }
        }

    }
)
export const {
    getTempHumidityStart,
    getTempHumiditySuccess,
    getTempHumidityFail,
    getTempFail,
    getTempStart,
    getTempSuccess
} = tempHumiditySlide.actions

export default tempHumiditySlide.reducer