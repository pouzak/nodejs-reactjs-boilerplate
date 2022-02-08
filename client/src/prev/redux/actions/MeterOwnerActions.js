import axios from "axios";
import {
    CLEAR_ERRORS,
    SET_ERRORS, SET_LOADING_DATA, SET_METERS_LIST, SET_METER_OWNER_LIST
} from "../types";

export const getOwnersList = () => {
  return axios.get(`/api/meterowners/`);
};

export const getMeterOwnerList = () => (dispatch) => {
  dispatch({ type: SET_LOADING_DATA, payload: "meterOwner" });
  dispatch({ type: CLEAR_ERRORS });
  axios
    .get(`/api/meterowners`)
    .then((res) => {
      dispatch({ type: SET_METER_OWNER_LIST, payload: res.data });
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

export const editMeterOwner =
  (meters, owner, close) => (dispatch, getState) => {
    dispatch({ type: SET_LOADING_DATA, payload: "meterOwner" });
    dispatch({ type: CLEAR_ERRORS });
    const ownerObj = owner ? owner : { id: null };
    axios
      .post(`/api/editmeterowner`, { meters, owner: ownerObj.id })
      .then((res) => {
        const meterList = [...getState().data.meters];
        for (let index = 0; index < meters.length; index++) {
          const meterId = meters[index];
          const find = meterList.findIndex((x) => x.id === meterId);
          if (find > -1) {
            meterList[find].meter_owner_name = ownerObj.name;
          }
        }

        dispatch({ type: SET_METERS_LIST, payload: meterList });
        dispatch({ type: SET_LOADING_DATA, payload: false });
        close();
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

export const addMeterOwner = (ownerObj, close) => (dispatch, getState) => {
  dispatch({ type: SET_LOADING_DATA, payload: "meterOwner" });
  dispatch({ type: CLEAR_ERRORS });
  axios
    .post(`/api/addmeterowner`, ownerObj)
    .then((res) => {
      const newList = [res.data, ...getState().data.ownerList];
      dispatch({ type: SET_METER_OWNER_LIST, payload: newList });
      dispatch({ type: SET_LOADING_DATA, payload: false });
      close();
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

export const updateMeterOwnerData =
  (ownerObj, close) => (dispatch, getState) => {
    dispatch({ type: SET_LOADING_DATA, payload: "meterOwner" });
    dispatch({ type: CLEAR_ERRORS });
    axios
      .post(`/api/updatemeterowner`, ownerObj)
      .then((res) => {
        const newList = [...getState().data.ownerList];
        const index = newList.findIndex((x) => x.id === ownerObj.id);
        const assigned_users = newList[index].assigned_users;
        newList[index] = { ...res.data, assigned_users: assigned_users };

        dispatch({ type: SET_METER_OWNER_LIST, payload: newList });
        dispatch({ type: SET_LOADING_DATA, payload: false });
        close();
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

export const deleteMeterOwner = (ids, close) => (dispatch, getState) => {
  dispatch({ type: SET_LOADING_DATA, payload: "meterOwner" });
  dispatch({ type: CLEAR_ERRORS });
  axios
    .post(`/api/deletemeterowner/`, { ids: ids })
    .then((res) => {
      const newList = [
        ...getState().data.ownerList.filter((x) => ids.indexOf(x.id) < 0),
      ];
      // const index = newList.findIndex((x) => x.id === id);
      // newList.splice(index, 1);
      dispatch({ type: SET_METER_OWNER_LIST, payload: newList });
      dispatch({ type: SET_LOADING_DATA, payload: false });
      close();
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
