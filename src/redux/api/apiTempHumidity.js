import axios from 'axios';
import {getTempHumidityFail,getTempHumidityStart,getTempHumiditySuccess,getTempFail,getTempStart,getTempSuccess} from '../tempHumiditySlice'
export const getTempHumidity = async(dispatch,slug) => {
    dispatch(getTempHumidityStart());
    try{
        console.log(process.env.REACT_APP_BACKEND_URL);
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/tempHumidity`,)
        dispatch(getTempHumiditySuccess(res.data))
    }catch(err) {
        dispatch(getTempHumidityFail(err))
    }
};
export const getTempHumiditys = async(dispatch,slug) => {
    dispatch(getTempStart());
    try{
        // console.log(process.env.REACT_APP_BACKEND_URL);
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_PYTHON_URL}predict`,)
        dispatch(getTempSuccess(res.data))
    }catch(err) {
        dispatch(getTempFail(err))
    }
};