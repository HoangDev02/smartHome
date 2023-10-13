import axios from 'axios';
import {getPanFail,getPanStart,getPanSuccess,updatePanFail,updatePanStart,updatePanSuccess} from '../panSice'

export const updatePan = async (id, dispatch, status,navigate) => {
    dispatch(updatePanStart());
    try {
      console.log(process.env.REACT_APP_BACKEND_URL);
      const res = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}api/devices/manually/${id}`, status);
      dispatch(updatePanSuccess(res.data));
      navigate('/')
    } catch (err) {
      dispatch(updatePanFail(err));
    }
};
export const updateLCD = async (id, dispatch, type,navigate) => {
  dispatch(updatePanStart());
  try {
    console.log(process.env.REACT_APP_BACKEND_URL);
    const res = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}api/devices/lcd/${id}`, type);
    dispatch(updatePanSuccess(res.data));
    navigate('/')
  } catch (err) {
    dispatch(updatePanFail(err));
  }
};
export const getPans = async(dispatch) => {
    dispatch(getPanStart());
    try{
        console.log(process.env.REACT_APP_BACKEND_URL);
        const res  = await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/devices`);
        dispatch(getPanSuccess(res.data))
    }catch(err) {
        dispatch(getPanFail(err))
    }
};