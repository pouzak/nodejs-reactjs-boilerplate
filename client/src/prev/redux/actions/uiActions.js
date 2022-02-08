import axios from "axios";
import { formatDate } from "../../utils/MiscFunctions";
import { axiosInstanceCreator, getClientResolution } from "../misc";
import {
  CLEAR_ERRORS, CLEAR_NOTIFICATION, SET_ERRORS, SET_HOST, SET_NOTIFICATION, SET_OPTIONS,
  SET_SYSTEM_MODE, SET_SYSTEM_VERSION
} from "../types";


export const setNotification = (msg) => (dispatch) => {
  dispatch({ type: CLEAR_NOTIFICATION });
  dispatch({
    type: SET_NOTIFICATION,
    payload: msg,
  });
};

export const setErrorMessage = (msg) => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
  // dispatch({
  //   type: SET_ERRORS,
  //   payload: msg,
  // });
  setTimeout(() => {
    dispatch({
      type: SET_ERRORS,
      payload: { notification: msg },
    });
  }, 0.1);
};

export const checkEnv = () => (dispatch) => {
  axiosInstanceCreator(null, "get", "/api/env")
    .then((res) => {
      dispatch({ type: SET_SYSTEM_MODE, payload: res.data.env });
      dispatch({ type: SET_SYSTEM_VERSION, payload: res.data.version });
      if (res.data.host) {
        dispatch({ type: SET_HOST, payload: res.data.host });
      }
      // dispatch({ type: SET_METERS_LIST, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
      setNotification(err.response ? err.response.data : "System error");
      // dispatch({ type: STOP_LOADING_USER });
      // dispatch({ type: STOP_LOADING_UI });
    });
};

export const getOptions = () => (dispatch) => {
  const opt = localStorage.getItem("opt");
  const clientRes = getClientResolution()
  const clientHeight = clientRes.height ? clientRes.height : 1080;
  let options = JSON.parse(opt);
  if (options) {
    options.screenHeight = clientHeight
  } else {
    let obj = {};
    obj.screenHeight = clientHeight;
    options = obj
  }

  opt && dispatch({ type: SET_OPTIONS, payload: options });
};

export const setOptions = (item, state) => (dispatch, getState) => {
  const options = getState().ui.options;
  if (options) {
    options[item] = state;
    dispatch({ type: SET_OPTIONS, payload: options });
    localStorage.setItem("opt", JSON.stringify(options));
  } else {
    const obj = {};
    obj[item] = state;
    dispatch({ type: SET_OPTIONS, payload: obj });
    localStorage.setItem("opt", JSON.stringify(obj));
  }
};

export const getAppStats = () => (dispatch) => {
  const lastSeenAlertsDate = localStorage.getItem("alertdt");

  return axios.post("/api/appstats", {
    date: lastSeenAlertsDate
      ? formatDate(parseInt(lastSeenAlertsDate))
      : formatDate(new Date()),
  });
};
