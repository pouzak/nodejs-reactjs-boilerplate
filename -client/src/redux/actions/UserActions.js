import axios from "axios";
import {
    SET_LOADING_UI, SET_UI_ERROR,
    SET_USER
} from "../types";
import { setCookie, eraseCookie } from '../../utils/cookies'

export const loginUser = (userData, navigate) => (dispatch) => {
    dispatch({ type: SET_UI_ERROR, payload: null });
    dispatch({ type: SET_LOADING_UI, payload: true });
    //console.log(userData);
    axios
        .post("/api/login", userData)
        .then((res) => {
            console.log(res.data);
            axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
            //localStorage.setItem("lou", res.data.logout);
            setCookie('token', res.data.token, null)
            dispatch({ type: SET_USER, payload: res.data });
            dispatch({ type: SET_LOADING_UI, payload: false });
            dispatch({ type: SET_UI_ERROR, payload: null });

            navigate('/');
        })
        .catch((err) => {
            console.log(err);
            dispatch({ type: SET_LOADING_UI, payload: false });
            dispatch({
                type: SET_UI_ERROR,
                payload: err.response.data
            });
            // dispatch({ type: STOP_LOADING_USER });
            // dispatch({ type: STOP_LOADING_UI });
        });
};

export const userCheck = () => (dispatch) => {
    dispatch({ type: SET_UI_ERROR, payload: null });
    dispatch({ type: SET_LOADING_UI, payload: true });
    //console.log(userData);
    axios
        .get("/api/user")
        .then((res) => {
            dispatch({ type: SET_USER, payload: res.data });
            dispatch({ type: SET_LOADING_UI, payload: false });
            dispatch({ type: SET_UI_ERROR, payload: null });
        })
        .catch((err) => {
            console.log(err);
            dispatch({ type: SET_LOADING_UI, payload: false });
            dispatch({
                type: SET_UI_ERROR,
                payload: err.response.data
            });
            // dispatch({ type: STOP_LOADING_USER });
            // dispatch({ type: STOP_LOADING_UI });
        });
};


export const userLogout = () => (dispatch) => {
    dispatch({ type: SET_USER, payload: null });
    eraseCookie('token')
}