import axios from "axios";
import { axiosInstanceCreator } from "../misc";
import {
  CLEAR_DSTAT,
  CLEAR_ERRORS,
  CLEAR_SOCKETS_RESPONSE,
  SET_CONFIG,
  SET_DCUWEB_VERSION,
  SET_DCU_LIST,
  SET_DCU_LOADING,
  SET_DCU_SETTINGS,
  SET_DSTAT,
  SET_ERRORS,
  SET_SOCKETS_RESPONSE,
  SET_STATUS,
} from "../types";
import { setNotification } from "./uiActions";

// const logoutIfTokenExpired = err => dispatch => {
//   if (err.response.data.error === "Token expired") {
//     dispatch(logoutUser());
//   }
// };'

export const saveDcu = (dcu) => (dispatch) => {
  return axios.post("/api/dcu", { dcu });
};

export const getTimeDate = () => (dispatch, getState) => {
  const dcu = getState().data.dcu;
  return axiosInstanceCreator(dcu, "get", "/api/dcudatetime?timezonelist=true");
  // return axios.get("/api/dcudatetime");
};
export const postTimeDate = (time, zone, sync) => (dispatch, getState) => {
  const dcu = getState().data.dcu;
  return axiosInstanceCreator(dcu, "post", "/api/dcudatetime", {
    time: time,
    timezone: zone,
    sync: sync,
  });
  // return axios.post("/api/dcudatetime", {
  //   time: time,
  //   timezone: zone,
  //   sync: sync,
  // });
};

export const getConfig = () => (dispatch, getState) => {
  dispatch({ type: CLEAR_ERRORS });
  dispatch({
    type: SET_DCU_LOADING,
    payload: true,
  });
  const dcu = getState().data.dcu;
  axiosInstanceCreator(dcu, "get", "/api/dcuconfig")
    .then((res) => {
      if (res.data && res.data.config) {
        dispatch({
          type: SET_CONFIG,
          payload: res.data.config,
        });
      }
      if (res.data && res.data.settings) {
        dispatch({
          type: SET_DCU_SETTINGS,
          payload: res.data.settings,
        });
      } else {
        dispatch({
          type: SET_DCU_SETTINGS,
          payload: [],
        });
      }
      dispatch({
        type: SET_DCU_LOADING,
        payload: false,
      });
    })

    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
      dispatch({
        type: SET_DCU_LOADING,
        payload: false,
      });
    });
};

export const getStatus = () => (dispatch, getState) => {
  //   dispatch({ type: LOADING_UI });
  const dcu = getState().data.dcu;
  axiosInstanceCreator(dcu, "get", "/api/dcustatus")
    // axios
    //   .get("/api/dcustatus")
    .then((res) => {
      dispatch({
        type: SET_STATUS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ERRORS,
        payload: err.response && err.response.data,
      });
    });
};

export const saveConfig = (config) => (dispatch, getState) => {
  dispatch({ type: CLEAR_ERRORS });
  dispatch({
    type: SET_DCU_LOADING,
    payload: true,
  });
  const dcu = getState().data.dcu;
  axiosInstanceCreator(dcu, "post", "/api/saveconfig", config)
    // axios
    //   .post("/api/saveconfig", config)
    .then((res) => {
      dispatch({
        type: SET_CONFIG,
        payload: config,
      });
      dispatch(
        setNotification(
          "DCSettings.xml succesfully saved.",
          "success",
          "Settings saved"
        )
      );
      dispatch({
        type: SET_DCU_LOADING,
        payload: false,
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: { notification: JSON.stringify(err.response.data) },
      });
      dispatch({
        type: SET_DCU_LOADING,
        payload: false,
      });
    });
};

export const saveStatus = (status) => (dispatch) => {
  if (Object.entries(status).length > 0) {
    dispatch({
      type: SET_STATUS,
      payload: status,
    });
  }
};

export const getDstat = (status) => (dispatch) => {
  if (
    Object.entries(status).length > 0 &&
    status.cpu.length > 1 &&
    status.disk.length > 1 &&
    status.net.length > 1
  ) {
    dispatch({
      type: SET_DSTAT,
      payload: status,
    });
  }
};

export const getDstatDaily = () => (dispatch) => {
  return axios.get("/api/dstats");
  // axios
  //   .get("/api/getdstatdaily")
  //   .then((res) => {
  //     dispatch({
  //       type: SET_DSTAT_DAILY,
  //       payload: res.data.daily,
  //     });
  //   })
  //   .catch((err) => {
  //     dispatch({
  //       type: SET_ERRORS,
  //       payload: err.response.data,
  //     });
  //   });
};
export const setErrors = (error) => (dispatch) => {
  dispatch({
    type: SET_ERRORS,
    payload: error,
  });
};
export const clearErrors = () => (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
export const clearDstat = () => (dispatch) => {
  dispatch({
    type: CLEAR_DSTAT,
  });
};
export const setWebVersion = (vers) => (dispatch) => {
  axios
    .get("/api/fwversion")
    .then((res) => {
      dispatch({
        type: SET_DCUWEB_VERSION,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_DCUWEB_VERSION,
        payload: "",
      });
    });
};
export const setSocketsResponse = (response) => (dispatch) => {
  dispatch({
    type: SET_SOCKETS_RESPONSE,
    payload: response,
  });
};
export const clearSocketsResponse = () => (dispatch) => {
  dispatch({
    type: CLEAR_SOCKETS_RESPONSE,
  });
};

export const getDcuRestartCron = (data) => (dispatch, getState) => {
  const dcu = getState().data.dcu;
  return axiosInstanceCreator(dcu, "get", "/api/getdcurestartcrontab", data);
  // return axios.get("/api/dcudatetime");
};

export const saveDcuRestartCron = (data) => (dispatch, getState) => {
  const dcu = getState().data.dcu;
  return axiosInstanceCreator(dcu, "post", "/api/setdcurestartcron", data);
  // return axios.get("/api/dcudatetime");
};

export const getModemRestartCron = (data) => (dispatch, getState) => {
  const dcu = getState().data.dcu;
  return axiosInstanceCreator(dcu, "get", "/api/getmodemrestartcrontab", data);
};

export const saveModemRestartCron = (data) => (dispatch, getState) => {
  const dcu = getState().data.dcu;
  return axiosInstanceCreator(dcu, "post", "/api/setmodemrestartcron", data);
};

export const getPlcBandInfo = (data) => (dispatch, getState) => {
  const dcu = getState().data.dcu;
  return axiosInstanceCreator(dcu, "get", "/api/plcbandinfo", data);
};

export const deleteDCUs = (dcus, dataDeleteBool) => {
  return (dispatch, getState) => {
    const dcuList = getState().data.dcuList;
    return axiosInstanceCreator(false, "delete", "/api/dcu", { dcu: dcus, deleteData: dataDeleteBool })
      .then((res) => {
        const newDcuList = dcuList.filter(function (el) {
          return !dcus.includes(el.id);
        });
        dispatch({ type: SET_DCU_LIST, payload: newDcuList });
        return res;
      });
  };
};
