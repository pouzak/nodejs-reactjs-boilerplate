import axios from "axios";
import Cookie from "js-cookie";
import { axiosInstanceCreator } from "../misc";
import store from "../store";
import {
  CLEAR_DATA, CLEAR_ERRORS, LOADING_UI, LOADING_USER, SET_ERRORS, SET_LOADING_DATA, SET_SYSTEM_USERS, SET_UNAUTHENTICATED,
  SET_USER, SET_USERS, STOP_LOADING_UI, STOP_LOADING_USER
} from "../types";

const setAuthHeader = (data) => {
  const dcuToken = `Bearer ${data.token}`;
  const refreshToken = `Bearer ${data.refreshToken}`;
  // localStorage.setItem("dcuToken", dcuToken);
  Cookie.set("dcuToken", dcuToken, { expires: 7 });
  Cookie.set("refreshToken", refreshToken, { expires: 7 });
  axios.defaults.headers.common["Authorization"] = dcuToken;
};

export const loginUser = (userData, history) => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
  dispatch({ type: LOADING_UI });
  //console.log(userData);
  axios
    .post("/api/login", userData)
    .then((res) => {
      localStorage.setItem("lou", res.data.logout);
      setAuthHeader(res.data);
      dispatch({ type: SET_USER, payload: res.data.user });
      dispatch({ type: STOP_LOADING_UI });
      dispatch({ type: CLEAR_ERRORS });

      history.push("/");
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ERRORS,
        payload: err.response ? err.response.data : "System error",
      });
      // dispatch({ type: STOP_LOADING_USER });
      // dispatch({ type: STOP_LOADING_UI });
    });
};

export const changeUserPassword = (userPass, history) => (dispatch) => {
  return axios.post("/api/resetpassword", { password: userPass });
};

export const checkUser = (history) => (dispatch) => {
  dispatch({ type: LOADING_USER });

  axios
    .get("/api/user")
    .then((res) => {
      // dispatch({ type: SET_AUTHENTICATED });
      localStorage.removeItem("lou");
      localStorage.setItem("lou", res.data.leftTime);
      dispatch({ type: SET_USER, payload: res.data.user });

      // setAuthHeader(res.data.token);
      //   dispatch({
      //     type: CLEAR_ERRORS
      //   });
      //   dispatch(getUserData());

      // history.push("/");
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload:
          err.response && err.response.data.error
            ? err.response.data.error
            : "System error",
      });
      dispatch({ type: STOP_LOADING_USER });
      // if (err.response.data.error === "Token expired") {
      //   dispatch(logoutUser());
      // }
      // console.log(err.response.data);
      //   dispatch({
      //     type: SET_ERRORS,
      //     payload: err.response.data
      //   });
    });
};

export const logoutUser = () => (dispatch) => {
  console.log("loging out");
  // localStorage.removeItem("dcuToken");
  localStorage.removeItem("lou");
  Cookie.remove("dcuToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: SET_UNAUTHENTICATED });
  dispatch({ type: CLEAR_DATA });
  // dispatch({ type: CLEAR_DB_DATA });
  // dispatch({ type: CLEAR_METERS_LIST });
};

export const logoutIfTokenExpired = (err) => (dispatch) => {
  if (err.response.data.error === "Token expired") {
    dispatch(logoutUser());
  }
};

export const getSocketUsers = (data) => (dispatch) => {
  dispatch({ type: SET_SYSTEM_USERS, payload: data });
};

export const isAdmin = () => {
  const user = store.getState().user.user;
  return user.userType <= 1;
};

export const editUser = (newData) => {
  return (dispatch, getState) => {
    const dcu = getState().data.dcu;
    return axiosInstanceCreator(dcu, "put", "/api/user", newData);
  };
};

export const getUser = (userId) => {
  return (dispatch, getState) => {
    return axiosInstanceCreator(null, "post", "/api/getuserdata", {
      id: userId,
    });
  };
};

export const toggleUserActive = (id, value) => (dispatch, getState) => {
  dispatch({ type: SET_LOADING_DATA, payload: true });
  dispatch({ type: CLEAR_ERRORS });
  //console.log(userData);
  const newval = !JSON.parse(value);
  const dcu = getState().data.dcu;
  axiosInstanceCreator(dcu, "post", "/api/toggleuseractive", {
    id: id,
    value: newval,
  })
    // .post("/api/toggleuseractive", { id: id, value: newval })
    .then((res) => {
      console.log(res);
      if (res.data && res.data === "ok") {
        const userList = [...getState().data.users];
        const foundIndex = userList.findIndex((x) => x.id === id);
        userList[foundIndex].is_active = newval;
        dispatch({
          type: SET_USERS,
          payload: userList,
        });
        dispatch({ type: SET_LOADING_DATA, payload: false });
      }
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: { notification: err.response.data },
      });
      dispatch({ type: SET_LOADING_DATA, payload: false });
      // dispatch({ type: STOP_LOADING_USER });
      // dispatch({ type: STOP_LOADING_UI });
    });
};

export const rememberPassword = (userName, email) => {
  return (dispatch, getState) => {
    return axiosInstanceCreator(null, "post", "/api/passrecover", {
      userName: userName,
      email: email,
    });
  };
};

export const toggleReceivingMail = (id, value) => (dispatch, getState) => {
  dispatch({ type: SET_LOADING_DATA, payload: true });
  dispatch({ type: CLEAR_ERRORS });
  const newval = !JSON.parse(value);
  const dcu = getState().data.dcu;
  axiosInstanceCreator(dcu, "post", "/api/togglereceivingmail", {
    id: id,
    value: newval,
  })
    .then((res) => {
      console.log(res);
      if (res.data && res.data === "ok") {
        const userList = [...getState().data.users];
        const foundIndex = userList.findIndex((x) => x.id === id);
        userList[foundIndex].receiving_mail = newval;
        dispatch({
          type: SET_USERS,
          payload: userList,
        });
        dispatch({ type: SET_LOADING_DATA, payload: false });
      }
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: { notification: err.response.data },
      });
      dispatch({ type: SET_LOADING_DATA, payload: false });
    });
};
