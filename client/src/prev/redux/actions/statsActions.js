import axios from "axios";
import { formatDate } from "../../utils/MiscFunctions";
import { axiosInstanceCreator } from "../misc";
import {
  SET_DCU_SETTINGS, SET_ERRORS,
  SET_METER_STATS, SET_STATS_LOADING
} from "../types";
import { getSystemServices } from "./SystemServiceActions";

export const getDashboardData = () => (dispatch, getState) => {
  dispatch(setLoading("hesStats", true));
  const dcu = getState().data.dcu;
  axiosInstanceCreator(dcu, "get", "/api/dashboard")
    .then((res) => {
      const newState = res.data;
      if (newState.dcu && newState.dcu.length) {
        const datas = newState.dcu.map((x) => {
          return { ...x, online: null, loading: true, ping: null };
        });
        newState.dcu = datas;
      }
      if (res.data.dcu_generic && res.data.dcu_generic.settings) {
        dispatch({
          type: SET_DCU_SETTINGS,
          payload: res.data.dcu_generic.settings,
        });
      }
      dispatch({
        type: SET_METER_STATS,
        payload: { statItem: "hesStats", data: newState },
      });
      dispatch(setLoading("hesStats", false));
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ERRORS,
        payload: { notification: err.response.data.error },
      });
      dispatch(setLoading("hesStats", false));
    })
    .finally(() => {
      if (!getState().services.services) {
        dispatch(getSystemServices());
      }
    });
};

const setLoading = (item, state) => (dispatch) => {
  dispatch({
    type: SET_STATS_LOADING,
    payload: { statItem: item, state: state },
  });
};

export const pingDcu = (url) => (dispatch) => {
  //console.log(userData);
  return axios.post("/api/dcuping", { url: url });
};
export const checkDcuAlive = (dcu) => (dispatch) => {
  //console.log(userData);
  //return axios.get(`${dcu.api_url}/api/env`);
  return axiosInstanceCreator(dcu, "get", `/api/env`);
};

export const getPushEvents = (url) => (dispatch) => {
  //console.log(userData);

  const date = localStorage.getItem("alertdt");
  return axios.post("/api/dashboardalarms", {
    date: date ? formatDate(parseInt(date)) : formatDate(new Date()),
  });
};
