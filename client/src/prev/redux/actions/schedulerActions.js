import { axiosInstanceCreator } from "../misc";
import {
    CLEAR_ERRORS, SET_METER_FWS, SET_METER_TYPES, SET_SCHED_LIST,
    SET_SCHED_LOADING
} from "../types";
// import { axiosInstanceCreator } from "./dataActions";

// const axiosInstanceCreator = (dcu, method, url, data) => {
//   return new Promise(function (resolve, reject) {
//     try {
//       if (dcu) {
//         const axiosInstance = axios.create();
//         axiosInstance.defaults.headers.common["Authorization"] =
//           "Bearer " + dcu.token;
//         resolve(
//           axiosInstance({
//             method: method,
//             url: dcu.api_url + url,
//             data: data && data,
//           })
//         );
//       } else {
//         resolve(
//           axios({
//             method: method,
//             url: url,
//             data: data && data,
//           })
//         );
//       }
//     } catch (error) {
//       console.log(error);
//       reject(error.message);
//     }
//   });
// };

export const getSchedulerList = () => (dispatch, getState) => {
  dispatch({ type: SET_SCHED_LOADING, payload: "schedlist" });
  dispatch({ type: CLEAR_ERRORS });
  //console.log(userData);
  const dcu = getState().data.dcu;
  axiosInstanceCreator(dcu, "get", "/api/schedulertasklist")
    .then((res) => {
      console.log(res);
      dispatch({ type: SET_SCHED_LIST, payload: res.data.scheduler_list });
      dispatch({ type: SET_METER_FWS, payload: res.data.fw_versions });
      dispatch({ type: SET_METER_TYPES, payload: res.data.meter_types });
      dispatch({ type: SET_SCHED_LOADING, payload: false });
    })
    .catch((err) => {
      // dispatch({
      //   type: SET_ERRORS,
      //   payload: { notification: err.response.data },
      // });
      dispatch({ type: SET_SCHED_LOADING, payload: false });
      // dispatch({ type: STOP_LOADING_USER });
      // dispatch({ type: STOP_LOADING_UI });
    });
};

export const saveSchedulerJob = (job) => (dispatch, getState) => {
  //console.log(userData);
  const dcu = getState().data.dcu;

  if (parseInt(job.jobType) === 40) {
    const formData = new FormData();
    const fileToSend = job.file;

    formData.append("fileUpload", fileToSend, fileToSend.name);
    const jobEdit = job;
    jobEdit.file = null;
    formData.append("data", JSON.stringify(job));
    return axiosInstanceCreator(
      dcu,
      "post",
      "/api/paramteplateupload",
      formData
    );
  }
  return axiosInstanceCreator(dcu, "post", "/api/schedulertask", job);
};
export const editSchedulerJob = (job) => (dispatch, getState) => {
  //console.log(userData);

  const dcu = getState().data.dcu;
  return axiosInstanceCreator(dcu, "put", "/api/schedulertask", job);
};

export const refreshSchedulerList = (job) => (dispatch, getState) => {
  const list = [...getState().scheduler.schedulerList];
  const id = list.findIndex((x) => x.id === job.id);
  if (id !== -1) {
    list[id] = job;
    dispatch({ type: SET_SCHED_LIST, payload: list });
  }
};

export const getWildcardAdds = () => (dispatch, getState) => {
  //console.log(userData);
  const dcu = getState().data.dcu;
  return axiosInstanceCreator(dcu, "get", "/api/scheduleraddons");
};

export const getParamTemplates = () => (dispatch, getState) => {
  const dcu = getState().data.dcu;
  //console.log(userData);
  return axiosInstanceCreator(dcu, "get", "/api/paramtemplate");
};

export const getAllParamTemplates = () => (dispatch, getState) => {
  const dcu = getState().data.dcu;
  //console.log(userData);
  return axiosInstanceCreator(dcu, "get", "/api/paramtemplates");
};

export const toggleParamTemplDelete = (id, state) => (dispatch, getState) => {
  const dcu = getState().data.dcu;
  //console.log(userData);
  return axiosInstanceCreator(dcu, "post", "/api/paramtemplate", {
    id: id,
    state: state,
  });
};
