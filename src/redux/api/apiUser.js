import axios from 'axios'
import { loginFailed, loginStart, loginSuccess, logoutFailed, logoutStart, logoutSuccess, registerFailed, registerStart, registerSuccess } from '../authSlice'

export const loginUser = async(user,dispatch,navigate) => {
    dispatch(loginStart());
    try {
        console.log(process.env.REACT_APP_BACKEND_URL);
        const res  = await axios.post(`${process.env.REACT_APP_BACKEND_URL}api/user/login`, user,
        { withCredentials: true }
        );
        dispatch(loginSuccess(res.data));
        navigate('/')
    }catch(err){
        dispatch(loginFailed());
    }
};
export const registerUser = async(user,dispatch,navigate) => {
    dispatch(registerStart());
    try{
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}api/user/register`, user);
        dispatch(registerSuccess())
        navigate('/login')
    }catch(err){
        dispatch(registerFailed())
    };
};
export const logOut = async (dispatch, id, navigate, accessToken, axiosJWT) => {
    dispatch(logoutStart());
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}api/user/logout`, id, {
        headers: { token: `${accessToken}` },
      });
      dispatch(logoutSuccess());
      navigate("/login");
    } catch (err) {
      dispatch(logoutFailed());
    }
  };