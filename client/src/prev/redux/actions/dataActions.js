import axios from "axios";
import { I18n } from "react-redux-i18n";
import { axiosInstanceCreator } from "../misc";
import {
  CLEAR_ERRORS, SET_ALARM, SET_ALARM_LIST, SET_BILLING, SET_COLLECTION_PARAMS_LIST, SET_CONFIG,
  SET_DAILY_PROFILE, SET_DCU_LIST, SET_ERRORS, SET_EVENT_LOG, SET_INST_VALUES, SET_LOADING_DATA, SET_LOAD_PROFILE, SET_METER, SET_METERS_LIST, SET_METER_FWS, SET_METER_HIERARCHY, SET_METER_TYPES, SET_MSURE_PROFILE, SET_SELECTED_METERS, SET_SELECTED_METERS_DATA, SET_USERS, SET_USERS_TASKS
} from "../types";
import { setNotification } from "./uiActions";


export const getMetersList = () => (dispatch, getState) => {
  dispatch({ type: SET_LOADING_DATA, payload: "meterList" });
  dispatch({ type: CLEAR_ERRORS });
  //console.log(userData);

  const dcu = getState().data.dcu;
  axiosInstanceCreator(dcu, "get", "/api/meterslist")
    .then((res) => {
      dispatch({ type: SET_METERS_LIST, payload: res.data });
      dispatch({ type: SET_LOADING_DATA, payload: false });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ERRORS,
        payload: {
          notification: err.response ? err.response.data : "System error",
        },
      });
      dispatch({ type: SET_LOADING_DATA, payload: false });
    });
};

export const getDcuMetersList = (dcuArr) => (dispatch) => {
  dispatch({ type: SET_LOADING_DATA, payload: true });
  dispatch({ type: CLEAR_ERRORS });
  //console.log(userData);

  axiosInstanceCreator(null, "post", `/api/dcumeterslist`, { dcuArr })
    .then((res) => {
      dispatch({ type: SET_METERS_LIST, payload: res.data });
      dispatch({ type: SET_LOADING_DATA, payload: false });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ERRORS,
        payload: { notification: err.response.data },
      });
      dispatch({ type: SET_LOADING_DATA, payload: false });
      // dispatch({ type: STOP_LOADING_USER });
      // dispatch({ type: STOP_LOADING_UI });
    });
};

export const editMeter = (id, newData) => {
  return (dispatch, getState) => {
    return axios
      .post("/api/editmeter", { id: id, data: newData })
      .then((response) => {
        if (response.data && response.data === "ok") {
          const metersList = [...getState().data.meters];
          var foundIndex = metersList.findIndex((x) => x.id === id);
          metersList[foundIndex] = newData;
          dispatch({ type: SET_METERS_LIST, payload: metersList });
        }
        return response;
      });
  };
};

export const deleteMeter = (id) => {
  return (dispatch, getState) => {
    return axios.post("/api/deletemeter", { id: id }).then((response) => {
      if (response.data && response.data === "ok") {
        const metersList = [...getState().data.meters];
        var foundIndex = metersList.findIndex((x) => x.id === id);
        metersList.splice(foundIndex, 1);
        dispatch({ type: SET_METERS_LIST, payload: metersList });
      }
      return response;
    });
  };
};

export const createMeter = (data, user) => {
  return (dispatch, getState) => {
    return axios
      .post("/api/createmeter", { id: user.id, data: data })
      .then((response) => {
        console.log(response);
        if (response.data && response.data === "ok") {
          const metersList = [...getState().data.meters];
          const newData = { ...data };
          newData.createdbyuserid = user.id;
          newData.creator = user.username;
          const newList = [...metersList, newData];
          dispatch({ type: SET_METERS_LIST, payload: newList });
        }
        return response;
      });
  };
};

// export const getMeterData = (id) => (dispatch) => {
//   dispatch({ type: SET_LOADING_DATA, payload: true });
//   dispatch({ type: CLEAR_ERRORS });
//   //console.log(userData);
//   axios
//     .post("/api/getmeterdata", { id: id })
//     .then((res) => {
//       console.log(res);
//       dispatch({ type: SET_METER_DATA, payload: res.data });
//       dispatch({ type: SET_LOADING_DATA, payload: false });
//     })
//     .catch((err) => {
//       dispatch({
//         type: SET_ERRORS,
//         payload: { notification: err.response.data },
//       });
//       dispatch({ type: SET_LOADING_DATA, payload: false });
//       // dispatch({ type: STOP_LOADING_USER });
//       // dispatch({ type: STOP_LOADING_UI });
//     });
// };

export const getAllUsers = (filters) => (dispatch, getState) => {
  dispatch({ type: SET_LOADING_DATA, payload: true });
  dispatch({ type: CLEAR_ERRORS });
  //console.log(userData);
  const dcu = getState().data.dcu;
  axiosInstanceCreator(dcu, "post", "/api/getallusers", filters)
    .then((res) => {
      dispatch({ type: SET_USERS, payload: res.data });
      dispatch({ type: SET_LOADING_DATA, payload: false });
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: { notification: err.response.data.error },
      });
      dispatch({ type: SET_LOADING_DATA, payload: false });
      // dispatch({ type: STOP_LOADING_USER });
      // dispatch({ type: STOP_LOADING_UI });
    });
};

export const getUsersCsv = () => (dispatch) => {
  axios({
    url: `/api/getuserscsv`, //your url
    method: "GET",
    responseType: "blob", // important
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `data.csv`); //or any other extension
    document.body.appendChild(link);
    link.click();
  });
};


export const getCsv = (dataId, dateFrom, dateTo, id, units) => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
  const lang = I18n._getLocale();
  axios({
    url: `/api/csv`, //your url
    method: "POST",
    responseType: "blob", // important
    data: {
      dataId: dataId,
      dateFrom: dateFrom,
      dateTo: dateTo,
      id: id,
      language: lang,
      units: units,
    },
  })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `data.csv`); //or any other extension
      document.body.appendChild(link);
      link.click();
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ERRORS,
        payload: { notification: "Error on generating CSV" },
      });
    });
};

export const getCustomCsv = (dataId, dateFrom, dateTo, id) => (dispatch) => {
  axios({
    url: `/api/customcsv`, //your url
    method: "POST",
    responseType: "blob", // important
    data: {
      dataId: dataId,
      dateFrom: dateFrom,
      dateTo: dateTo,
      id: id,
    },
  })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `data.csv`); //or any other extension
      document.body.appendChild(link);
      link.click();
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ERRORS,
        payload: { notification: "Error on generating CSV" },
      });
    });
};

export const getMeterDataCsv = (id) => (dispatch) => {
  axios({
    url: `/api/getmeterdatacsv`,
    method: "POST",
    responseType: "blob",
    data: {
      id: id,
    },
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `data.csv`);
    document.body.appendChild(link);
    link.click();
  });
};

export const uploadCsv = (data, id) => (dispatch, getState) => {
  dispatch({ type: SET_LOADING_DATA, payload: "meterscsvupl" });
  dispatch({ type: CLEAR_ERRORS });
  //console.log(userData);

  axios
    .post("/api/uploadmeterscsv", data)
    .then((res) => {
      dispatch(getMetersList());
      dispatch(setNotification(`Meter list updated.`));
      dispatch({ type: SET_LOADING_DATA, payload: false });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ERRORS,
        payload: { notification: err.response.data },
      });
      dispatch({ type: SET_LOADING_DATA, payload: false });
      // dispatch({ type: STOP_LOADING_USER });
      // dispatch({ type: STOP_LOADING_UI });
    });
};

export const getSelectedMeterData = (id) => (dispatch, getState) => {
  dispatch({ type: SET_LOADING_DATA, payload: true });
  dispatch({ type: CLEAR_ERRORS });
  //console.log(userData);
  const ids = getState().data.selectedMeters;
  axios
    .post("/api/getselmeterdata", { ids: ids })
    .then((res) => {
      dispatch({ type: SET_SELECTED_METERS_DATA, payload: res.data });
      dispatch({ type: SET_LOADING_DATA, payload: false });
    })
    .catch((err) => {
      // dispatch({
      //   type: SET_ERRORS,
      //   payload: { notification: err.response.data },
      // });
      dispatch({ type: SET_LOADING_DATA, payload: false });
      // dispatch({ type: STOP_LOADING_USER });
      // dispatch({ type: STOP_LOADING_UI });
    });
};

export const getBilling =
  (id, datefrom, dateto, scaled, history) => (dispatch, getState) => {
    dispatch({ type: SET_LOADING_DATA, payload: "billing" });
    dispatch({ type: CLEAR_ERRORS });
    //console.log(userData);
    const dcu = getState().data.dcu;
    axiosInstanceCreator(dcu, "post", `/api/billing/${id}`, {
      dateFrom: datefrom,
      dateTo: dateto,
      scaled: scaled,
    })
      // axiosInstance
      //   .post(`${dcu ? dcu.api_url : ""}/api/billing/${id}`, {
      //     dateFrom: datefrom,
      //     dateTo: dateto,
      //   })
      .then((res) => {
        if (res.data && !res.data.meter) {
          history.push("/404");
          return;
        }
        dispatch({ type: SET_BILLING, payload: res.data });
        dispatch({ type: SET_LOADING_DATA, payload: false });

        dispatch({ type: SET_METER, payload: res.data.meter });
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

export const getAlarms =
  (id, datefrom, dateto, scaled, history) => (dispatch, getState) => {
    dispatch({ type: SET_LOADING_DATA, payload: "alarms" });
    dispatch({ type: CLEAR_ERRORS });
    //console.log(userData);
    const dcu = getState().data.dcu;
    axiosInstanceCreator(dcu, "post", `/api/alarms/${id}`, {
      dateFrom: datefrom,
      dateTo: dateto,
      scaled: scaled,
    })
      // axiosInstance
      //   .post(`${dcu ? dcu.api_url : ""}/api/billing/${id}`, {
      //     dateFrom: datefrom,
      //     dateTo: dateto,
      //   })
      .then((res) => {
        if (res.data && !res.data.meter) {
          history.push("/404");
          return;
        }
        dispatch({ type: SET_ALARM, payload: res.data });
        dispatch({ type: SET_LOADING_DATA, payload: false });

        dispatch({ type: SET_METER, payload: res.data.meter });
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

export const getLoadProfile =
  (id, datefrom, dateto, scaled, history) => (dispatch, getState) => {
    dispatch({ type: SET_LOADING_DATA, payload: "loadprofile" });
    dispatch({ type: CLEAR_ERRORS });

    //console.log(userData);
    const dcu = getState().data.dcu;
    // const axiosInstance = axiosInstanceCreator(dcu);
    // axiosInstance
    //   .post(`${dcu ? dcu.api_url : ""}/api/loadprofile/${id}`, {
    //     dateFrom: datefrom,
    //     dateTo: dateto,
    //   })
    axiosInstanceCreator(dcu, "post", `/api/loadprofile/${id}`, {
      dateFrom: datefrom,
      dateTo: dateto,
      scaled: scaled,
    })
      .then((res) => {
        if (res.data && !res.data.meter) {
          history.push("/404");
          return;
        }
        dispatch({ type: SET_LOAD_PROFILE, payload: res.data });
        dispatch({ type: SET_LOADING_DATA, payload: false });
        dispatch({ type: SET_METER, payload: res.data.meter });
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

export const getInstantValues =
  (id, datefrom, dateto, history) => (dispatch, getState) => {
    dispatch({ type: SET_LOADING_DATA, payload: "instvalues" });
    dispatch({ type: CLEAR_ERRORS });
    //console.log(userData);
    const dcu = getState().data.dcu;
    // const axiosInstance = axiosInstanceCreator(dcu);
    // axiosInstance
    //   .post(`${dcu ? dcu.api_url : ""}/api/instantvalues/${id}`, {
    //     dateFrom: datefrom,
    //     dateTo: dateto,
    //   })
    axiosInstanceCreator(dcu, "post", `/api/instantvalues/${id}`, {
      dateFrom: datefrom,
      dateTo: dateto,
    })
      .then((res) => {
        if (res.data && !res.data.meter) {
          history.push("/404");
          return;
        }
        dispatch({ type: SET_INST_VALUES, payload: res.data });
        dispatch({ type: SET_LOADING_DATA, payload: false });
        dispatch({ type: SET_METER, payload: res.data.meter });
      })
      .catch((err) => {
        console.log(err);
        dispatch({
          type: SET_ERRORS,
          payload: { notification: err.response.data },
        });
        dispatch({ type: SET_LOADING_DATA, payload: false });
        // dispatch({ type: STOP_LOADING_USER });
        // dispatch({ type: STOP_LOADING_UI });
      });
  };

export const getDcuList = () => (dispatch) => {
  dispatch({ type: SET_LOADING_DATA, payload: "dculist" });
  dispatch({ type: CLEAR_ERRORS });
  //console.log(userData);
  axios
    .get(`/api/dculist`)
    .then((res) => {
      dispatch({ type: SET_DCU_LIST, payload: res.data });
      dispatch({ type: SET_LOADING_DATA, payload: false });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ERRORS,
        payload: { notification: err.response.data },
      });
      dispatch({ type: SET_LOADING_DATA, payload: false });
      // dispatch({ type: STOP_LOADING_USER });
      // dispatch({ type: STOP_LOADING_UI });
    });
};

export const getMeterHierarchyTree = () => (dispatch, getState) => {
  dispatch({ type: SET_LOADING_DATA, payload: "meterhierarchy" });
  dispatch({ type: CLEAR_ERRORS });
  //console.log(userData);
  axios
    .get(`/api/meterhierarchy`)
    .then((res) => {
      dispatch({ type: SET_METER_HIERARCHY, payload: res.data });
      const meters = getState().data.meters;
      if (!meters.length) {
        dispatch(getMetersList());
      } else {
        dispatch({ type: SET_LOADING_DATA, payload: false });
      }
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ERRORS,
        payload: { notification: err.response.data },
      });
      dispatch({ type: SET_LOADING_DATA, payload: false });
      // dispatch({ type: STOP_LOADING_USER });
      // dispatch({ type: STOP_LOADING_UI });
    });
};

// export const getMetersData = (ids, dateFrom, dateTo) => (dispatch) => {
//   return axios.post("/api/updateuser", {
//     ids: ids,
//     dateFrom: datefrom,
//     dateTo: dateto,
//   });
// };

export const getMetersDataByIds = (datatype, ids, dateFrom, dateTo) => {
  return (dispatch) => {
    return axios.post("/api/metersdata", {
      dataType: datatype,
      ids: ids,
      dateFrom: dateFrom,
      dateTo: dateTo,
    });
  };
};

export const getMeterReadings = (dataType, dateFrom, dateTo) => {
  return (dispatch, getState) => {
    const dcu = getState().data.dcu;
    return axiosInstanceCreator(dcu, "post", "/api/metersreadings", {
      dataType: dataType,
      dateFrom: dateFrom,
      dateTo: dateTo,
    });
  };
};

export const checkLocalStorage = (dataType, dateFrom, dateTo) => {
  return (dispatch, getState) => {
    const dcuRow = localStorage.getItem("dcuid");
    if (dcuRow) {
      const item = JSON.parse(atob(dcuRow));
      dispatch({ type: "SET_DCU", payload: item });
    }
  };
};

export const getDcuTkn = (id) => {
  return (dispatch) => {
    return axios.get(`/api/dcutkn/${id}`);
  };
};

export const getPlcTree = () => {
  return (dispatch, getState) => {
    const dcu = getState().data.dcu;
    return axiosInstanceCreator(dcu, "get", "/api/plctree");
  };
};

// export const getMeterReadings = (dataType, dateFrom, dateTo) => {
//   return (dispatch) => {
//     return axios.post("/api/metersreadings", {
//       dataType: dataType,
//       dateFrom: dateFrom,
//       dateTo: dateTo,
//     });
//   };
// };

export const getAlarmList = (dateFrom, dateTo) => (dispatch, getState) => {
  dispatch({ type: SET_LOADING_DATA, payload: "alarmList" });
  dispatch({ type: CLEAR_ERRORS });
  const dcu = getState().data.dcu;

  // axios
  //   .post(`/api/alarmlist`, { dateFrom: dateFrom, dateTo: dateTo })
  axiosInstanceCreator(dcu, "post", "/api/alarmlist", {
    dateFrom: dateFrom,
    dateTo: dateTo,
  })
    .then((res) => {
      dispatch({ type: SET_ALARM_LIST, payload: res.data });
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

export const getEventLog =
  (id, datefrom, dateto, history, lang) => (dispatch, getState) => {
    dispatch({ type: SET_LOADING_DATA, payload: "eventlog" });
    dispatch({ type: CLEAR_ERRORS });
    //console.log(userData);
    const dcu = getState().data.dcu;
    axiosInstanceCreator(dcu, "post", `/api/eventlog/${id}`, {
      dateFrom: datefrom,
      dateTo: dateto,
      language: lang,
    })
      // axiosInstance
      //   .post(`${dcu ? dcu.api_url : ""}/api/billing/${id}`, {
      //     dateFrom: datefrom,
      //     dateTo: dateto,
      //   })
      .then((res) => {
        if (res.data && !res.data.meter) {
          history.push("/404");
          return;
        }
        dispatch({ type: SET_EVENT_LOG, payload: res.data });
        dispatch({ type: SET_LOADING_DATA, payload: false });

        dispatch({ type: SET_METER, payload: res.data.meter });
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

export const getMeterPlcInfo = (id) => {
  return (dispatch) => {
    return axiosInstanceCreator(null, "get", `/api/meterplc/${id}`);
  };
};

export const getMsureProfile =
  (id, datefrom, dateto, history) => (dispatch, getState) => {
    dispatch({ type: SET_LOADING_DATA, payload: "msure" });
    dispatch({ type: CLEAR_ERRORS });
    //console.log(userData);
    const dcu = getState().data.dcu;
    axiosInstanceCreator(dcu, "post", `/api/msureprofile/${id}`, {
      dateFrom: datefrom,
      dateTo: dateto,
    })
      // axiosInstance
      //   .post(`${dcu ? dcu.api_url : ""}/api/billing/${id}`, {
      //     dateFrom: datefrom,
      //     dateTo: dateto,
      //   })
      .then((res) => {
        if (history && res.data && !res.data.meter) {
          history.push("/404");
          return;
        }
        dispatch({ type: SET_MSURE_PROFILE, payload: res.data.data });
        dispatch({ type: SET_LOADING_DATA, payload: false });

        dispatch({ type: SET_METER, payload: res.data.meter });
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

export const deleteMeters = (meters) => {
  return (dispatch, getState) => {
    return axiosInstanceCreator(null, "delete", "/api/meters", meters);
  };
};

export const getMeterExtInfo = (ids) => (dispatch, getState) => {
  dispatch({ type: SET_LOADING_DATA, payload: "meterExtInfo" });
  dispatch({ type: CLEAR_ERRORS });
  const dcu = getState().data.dcu;
  axiosInstanceCreator(dcu, "post", `/api/meterextinfo`, { ids })
    .then((res) => {
      if (res.data.meterTypes) {
        dispatch({ type: SET_METER_TYPES, payload: res.data.meterTypes });
      }
      if (res.data.dcuList) {
        dispatch({ type: SET_DCU_LIST, payload: res.data.dcuList });
      }
      if (res.data.collectionParams) {
        dispatch({
          type: SET_COLLECTION_PARAMS_LIST,
          payload: res.data.collectionParams,
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

export const addNewMeter = (obj, close) => (dispatch, getState) => {
  dispatch({ type: SET_LOADING_DATA, payload: "meterAdd" });
  dispatch({ type: CLEAR_ERRORS });
  axios
    .post(`/api/addmeter`, { data: obj })
    .then((res) => {
      const newMetersList = [res.data.newMeter, ...getState().data.meters];
      dispatch({ type: SET_METERS_LIST, payload: newMetersList });
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

export const editUserOwners = (users, owner, close) => (dispatch, getState) => {
  dispatch({ type: SET_LOADING_DATA, payload: true });
  dispatch({ type: CLEAR_ERRORS });
  //console.log(userData);

  axiosInstanceCreator(null, "post", "/api/userowners", {
    users: users,
    owner_id: owner,
  })
    .then((res) => {
      const owners = [...getState().data.ownerList];
      const index = owners.findIndex((x) => x.id === owner);
      owners[index].assigned_users = res.data;
      dispatch({ type: SET_LOADING_DATA, payload: false });
      close && close();
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: { notification: err.response.data.error },
      });
      dispatch({ type: SET_LOADING_DATA, payload: false });
      // dispatch({ type: STOP_LOADING_USER });
      // dispatch({ type: STOP_LOADING_UI });
    });
};
export const clearDataStore = () => (dispatch) => {
  dispatch({ type: SET_METERS_LIST, payload: [] });
  dispatch({ type: SET_METER, payload: null });
  dispatch({ type: SET_SELECTED_METERS, payload: [] });
  // dispatch({ type: SET_SELECTED_METERS_DATA, payload: null });
  dispatch({ type: SET_ALARM_LIST, payload: [] });
  dispatch({ type: SET_USERS_TASKS, payload: null });
  dispatch({ type: SET_METER_TYPES, payload: [] });
  dispatch({ type: SET_METER_FWS, payload: [] });
  dispatch({ type: SET_COLLECTION_PARAMS_LIST, payload: [] });
  dispatch({ type: SET_CONFIG, payload: null });
};

export const getDailyPorfile =
  (id, datefrom, dateto, scaled, history) => (dispatch, getState) => {
    dispatch({ type: SET_LOADING_DATA, payload: "dailyprofile" });
    dispatch({ type: CLEAR_ERRORS });
    //console.log(userData);
    const dcu = getState().data.dcu;
    axiosInstanceCreator(dcu, "post", `/api/dailyprofile/${id}`, {
      dateFrom: datefrom,
      dateTo: dateto,
      scaled: scaled,
    })
      // axiosInstance
      //   .post(`${dcu ? dcu.api_url : ""}/api/billing/${id}`, {
      //     dateFrom: datefrom,
      //     dateTo: dateto,
      //   })
      .then((res) => {
        if (res.data && !res.data.meter) {
          history.push("/404");
          return;
        }
        dispatch({ type: SET_DAILY_PROFILE, payload: res.data });
        dispatch({ type: SET_LOADING_DATA, payload: false });

        dispatch({ type: SET_METER, payload: res.data.meter });
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

export const getMeterReadingsPercentage = (dateFrom, dateTo, dataType) => {
  return (dispatch, getState) => {
    const dcu = getState().data.dcu;
    return axiosInstanceCreator(dcu, "post", "/api/metersreadingspercentage", {
      dataType: dataType,
      dateFrom: dateFrom,
      dateTo: dateTo,
    });
  };
};
