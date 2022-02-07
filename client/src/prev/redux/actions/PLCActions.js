import { axiosInstanceCreator } from "../misc";
import {
    CLEAR_ERRORS, SET_ERRORS, SET_PLC_LOADING,
    SET_PLC_PRE_SHARED_KEYS
} from "../types";

export const getMeterPlcSpectrum = (ids, dateFrom, dateTo) => {
  return (dispatch, getState) => {
    const dcu = getState().data.dcu;
    return axiosInstanceCreator(dcu, "post", "/api/plcspectrum", {
      meterId: ids,
      dateFrom: dateFrom,
      dateTo: dateTo,
    });
  };
};

export const getRxSpectrumStatus = (data) => {
  return (dispatch, getState) => {
    const dcu = getState().data.dcu;
    return axiosInstanceCreator(dcu, "get", "/api/rxspectrum");
  };
};

export const setRxSpectrumStatus = (state) => {
  return (dispatch, getState) => {
    const dcu = getState().data.dcu;
    return axiosInstanceCreator(dcu, "post", "/api/rxspectrum", {
      enabled: state,
    });
  };
};

export const getPreSharedKeys = () => (dispatch, getState) => {
  dispatch({ type: SET_PLC_LOADING, payload: "plckeys" });
  dispatch({ type: CLEAR_ERRORS });
  //console.log(userData);

  const dcu = getState().data.dcu;
  axiosInstanceCreator(dcu, "get", "/api/plckeys")
    .then((res) => {
      dispatch({ type: SET_PLC_PRE_SHARED_KEYS, payload: res.data });
      dispatch({ type: SET_PLC_LOADING, payload: false });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ERRORS,
        payload: {
          notification: err.response ? err.response.data : "System error",
        },
      });
      dispatch({ type: SET_PLC_LOADING, payload: false });
      // dispatch({ type: STOP_LOADING_USER });
      // dispatch({ type: STOP_LOADING_UI });
    });
};

export const savePreSharedKey = (obj) => {
  return (dispatch, getState) => {
    const dcu = getState().data.dcu;
    return axiosInstanceCreator(dcu, "post", "/api/plckeys", obj);
  };
};

export const deletePreSharedKeys = (keysArr, cb) => (dispatch, getState) => {
  dispatch({ type: SET_PLC_LOADING, payload: "plckeys" });
  dispatch({ type: CLEAR_ERRORS });
  //console.log(userData);

  const dcu = getState().data.dcu;
  axiosInstanceCreator(dcu, "delete", "/api/plckeys", keysArr)
    .then((res) => {
      const newState = [...getState().plc.preSharedKeys];

      for (let index = 0; index < keysArr.length; index++) {
        const key = keysArr[index];
        const findex = newState.findIndex((x) => parseInt(x.id) === key);
        newState.splice(findex, 1);
      }
      dispatch({ type: SET_PLC_PRE_SHARED_KEYS, payload: newState });
      dispatch({ type: SET_PLC_LOADING, payload: false });
      cb && cb();
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ERRORS,
        payload: {
          notification: err.response ? err.response.data : "System error",
        },
      });
      dispatch({ type: SET_PLC_LOADING, payload: false });
      // dispatch({ type: STOP_LOADING_USER });
      // dispatch({ type: STOP_LOADING_UI });
    });
};
