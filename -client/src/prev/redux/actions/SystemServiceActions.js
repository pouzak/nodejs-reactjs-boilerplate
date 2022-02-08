import { axiosInstanceCreator } from "../misc";
import {
    SET_SERVICES_ERROR, SET_SERVICES_LOADING, SET_SYSTEM_SERVICES
} from "../types";

export const getSystemServices = () => (dispatch, getState) => {
  dispatch({ type: SET_SERVICES_LOADING, payload: true });
  dispatch({ type: SET_SERVICES_ERROR, payload: null });
  //console.log(userData);
  const dcu = getState().data.dcu;
  axiosInstanceCreator(dcu, "get", `/api/systemservices`)
    .then((res) => {
      if (typeof res.data === "object") {
        dispatch({ type: SET_SYSTEM_SERVICES, payload: res.data });
      }

      dispatch({ type: SET_SERVICES_LOADING, payload: false });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_SERVICES_ERROR,
        payload: err.response ? err.response.data : "System error",
      });
      dispatch({ type: SET_SERVICES_LOADING, payload: false });
      // dispatch({ type: STOP_LOADING_USER });
      // dispatch({ type: STOP_LOADING_UI });
    });
};
