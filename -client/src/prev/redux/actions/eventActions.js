import { axiosInstanceCreator } from "../misc";
import {
  CLEAR_ERRORS, SET_ERRORS, SET_EVENTS_LOADING, SET_SYSTEM_EVENTS, SET_SYSTEM_EVENTS_CONFIG
} from "../types";

export const getSystemEvents =
  (dateFrom, dateTo, language) => (dispatch, getState) => {
    dispatch({ type: SET_EVENTS_LOADING, payload: "system" });
    dispatch({ type: CLEAR_ERRORS });
    //console.log(userData);

    const dcu = getState().data.dcu;
    axiosInstanceCreator(dcu, "post", "/api/event/list", {
      dateFrom: dateFrom,
      dateTo: dateTo,
      lang: language,
    })
      .then((res) => {
        dispatch({ type: SET_SYSTEM_EVENTS, payload: res.data });
        dispatch({ type: SET_EVENTS_LOADING, payload: false });
      })
      .catch((err) => {
        console.log(err);
        dispatch({
          type: SET_ERRORS,
          payload: {
            notification: err.response ? err.response.data : "System error",
          },
        });
        dispatch({ type: SET_EVENTS_LOADING, payload: false });
      });
  };

export const getSystemEventsConfig = (language) => (dispatch, getState) => {
  dispatch({ type: SET_EVENTS_LOADING, payload: "config" });
  dispatch({ type: CLEAR_ERRORS });
  //console.log(userData);

  const dcu = getState().data.dcu;
  axiosInstanceCreator(dcu, "get", `/api/event/config/${language}`)
    .then((res) => {
      dispatch({ type: SET_SYSTEM_EVENTS_CONFIG, payload: res.data });
      dispatch({ type: SET_EVENTS_LOADING, payload: false });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ERRORS,
        payload: {
          notification: err.response ? err.response.data : "System error",
        },
      });
      dispatch({ type: SET_EVENTS_LOADING, payload: false });
    });
};

export const setPushState = (data, state) => (dispatch, getState) => {
  const dcu = getState().data.dcu;
  return axiosInstanceCreator(dcu, "post", "/api/event/event", {
    events: data,
    cfg_type: state,
  });
};

export const setPushStateDispatch = (data, state) => (dispatch, getState) => {
  dispatch({ type: SET_EVENTS_LOADING, payload: "config" });
  dispatch({ type: CLEAR_ERRORS });
  //console.log(userData);

  const dcu = getState().data.dcu;
  axiosInstanceCreator(dcu, "post", "/api/event/event", {
    events: data,
    cfg_type: state,
  })
    .then((res) => {
      const newState = [...getState().events.eventsConfig];
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        const indexr = newState.findIndex((x) => x.code === element);
        newState[indexr].cfg_type = state;
        newState[indexr].updated_on = new Date();
      }
      dispatch({ type: SET_SYSTEM_EVENTS_CONFIG, payload: newState });
      dispatch({ type: SET_EVENTS_LOADING, payload: false });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ERRORS,
        payload: {
          notification: err.response ? err.response.data : "System error",
        },
      });
      dispatch({ type: SET_EVENTS_LOADING, payload: false });
    });
};

export const getPushDetails = (id) => (dispatch, getState) => {
  const dcu = getState().data.dcu;
  return axiosInstanceCreator(dcu, "get", `/api/event/pushdetails/${id}`);
};
