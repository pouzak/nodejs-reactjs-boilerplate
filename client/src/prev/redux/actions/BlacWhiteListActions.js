import { axiosInstanceCreator } from "../misc";
import {
    CLEAR_ERRORS, SET_BLACK_LIST, SET_BLACK_WHITE_LIST_FILTERING_MODE, SET_ERRORS, SET_LOADING_DATA, SET_WHITE_LIST
} from "../types";

export const addCustomMeterToBlacklist = (obj) => (dispatch, getState) => {
  return axiosInstanceCreator(null, "post", `/api/blacklistcustom/`, obj);
};
export const addCustomMeterToWhitelist = (obj) => (dispatch, getState) => {
  return axiosInstanceCreator(null, "post", `/api/whitelistcustom/`, obj);
};

export const getBlackList = () => (dispatch, getState) => {
  dispatch({ type: SET_LOADING_DATA, payload: "blacklist" });
  dispatch({ type: CLEAR_ERRORS });
  const dcu = getState().data.dcu;

  axiosInstanceCreator(dcu, "get", "/api/blacklist")
    .then((res) => {
      dispatch({ type: SET_BLACK_LIST, payload: res.data.data });
      if (res.data.current_filtering_mode !== null) {
        dispatch({
          type: SET_BLACK_WHITE_LIST_FILTERING_MODE,
          payload: res.data.current_filtering_mode,
        });
      }
      dispatch({ type: SET_LOADING_DATA, payload: false });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ERRORS,
        payload: { notification: err.response.data },
      });
      dispatch({ type: SET_LOADING_DATA, payload: false });
    });
};

export const removeFromBlackList = (meters) => {
  return (dispatch, getState) => {
    const dcu = getState().data.dcu;

    return axiosInstanceCreator(dcu, "post", "/api/blacklist", {
      meters,
      enable_blacklist: false,
    });
  };
};

export const getWhiteList = () => (dispatch, getState) => {
  dispatch({ type: SET_LOADING_DATA, payload: "whitelist" });
  dispatch({ type: CLEAR_ERRORS });
  const dcu = getState().data.dcu;

  axiosInstanceCreator(dcu, "get", "/api/whitelist")
    .then((res) => {
      dispatch({ type: SET_WHITE_LIST, payload: res.data.data });
      if (res.data.current_filtering_mode !== null) {
        dispatch({
          type: SET_BLACK_WHITE_LIST_FILTERING_MODE,
          payload: res.data.current_filtering_mode,
        });
      }
      dispatch({ type: SET_LOADING_DATA, payload: false });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ERRORS,
        payload: { notification: err.response.data },
      });
      dispatch({ type: SET_LOADING_DATA, payload: false });
    });
};

export const removeFromWhiteList = (meters) => {
  return (dispatch, getState) => {
    const dcu = getState().data.dcu;

    return axiosInstanceCreator(dcu, "post", "/api/whitelist", {
      meters,
      enable_whitelist: false,
    });
  };
};

export const listFileUpload = (file, data) => {
  return (dispatch, getState) => {
    const dcu = getState().data.dcu;

    const formData = new FormData();
    const fileToSend = file;

    formData.append("file", fileToSend, fileToSend.name);

    formData.append("data", JSON.stringify(data));
    return axiosInstanceCreator(
      dcu,
      "post",
      "/api/blackwhitelistfile",
      formData
    );
  };
};
