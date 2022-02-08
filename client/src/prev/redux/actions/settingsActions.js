import axios from "axios";
import { axiosInstanceCreator } from "../misc";
import {
  CLEAR_ERRORS,
  SET_COLLECTION_PARAMS_LIST,
  SET_COLLECTOR_SETTINGS,
  SET_COMPANY_DETAILS,
  SET_DCU_LOADING,
  SET_DCU_SETTINGS,
  SET_DEBUG_LEVEL,
  SET_G3_PLC_SETTINGS,
  SET_HES_SETTINGS,
  SET_LOADING_SETTINGS,
  SET_METERS_LIST,
  SET_METER_TYPES,
  SET_MSURE_SETTINGS,
  SET_PUSH_EVENT_SETTINGS,
  SET_SCHEDULER_CLEANUP_SETTINGS,
  SET_SETTINGS_ERROR,
  SET_SMTP_SETTINGS,
  SET_USER_AUTH_SETTINGS,
} from "../types";
import { setErrorMessage } from "./uiActions";

const clearErrors = (dispatch, getState) => {
  const errors = getState().ui.errors;
  if (Object.keys(errors).length > 0) {
    dispatch({ type: CLEAR_ERRORS });
  }
};

const setSettingsErrorFalse = (dispatch, getState) => {
  const error = getState().settings.error;
  if (error) {
    dispatch({ type: SET_SETTINGS_ERROR, payload: false });
  }
};

export const getPushEventsSettings = () => (dispatch, getState) => {
  dispatch({ type: SET_LOADING_SETTINGS, payload: "pushevents" });

  clearErrors(dispatch, getState);
  const dcu = getState().data.dcu;
  return axiosInstanceCreator(dcu, "get", "/api/settings/pushevents")
    .then((res) => {
      setSettingsErrorFalse(dispatch, getState, res);
      dispatch({ type: SET_PUSH_EVENT_SETTINGS, payload: res.data });
      return res;
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: SET_SETTINGS_ERROR, payload: true });
      dispatch(
        setErrorMessage(err.response ? err.response.data : "System error.")
      );
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
      throw err;
    });
};

export const savePushEventsSubscriber =
  (index, id, json) => (dispatch, getState) => {
    dispatch({ type: SET_LOADING_SETTINGS, payload: "pushevents" });
    clearErrors(dispatch, getState);

    const dcu = getState().data.dcu;
    let pushEventSettings = [...getState().settings.pushEvents.subscribers];
    pushEventSettings[index] = { ...pushEventSettings[index], ...json };

    return axiosInstanceCreator(
      dcu,
      "patch",
      "/api/settings/pushevents/" + id,
      json
    )
      .then((res) => {
        dispatch({
          type: SET_PUSH_EVENT_SETTINGS,
          payload: { subscribers: pushEventSettings },
        });
        return res;
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          setErrorMessage(err.response ? err.response.data : "System error.")
        );
        dispatch({ type: SET_LOADING_SETTINGS, payload: false });
        throw err;
      });
  };

export const addPushEventsSubscriber = (json) => (dispatch, getState) => {
  dispatch({ type: SET_LOADING_SETTINGS, payload: "pushevents" });
  clearErrors(dispatch, getState);

  const dcu = getState().data.dcu;
  

  return axiosInstanceCreator(dcu, "post", "/api/settings/pushevents", json)
    .then((res) => {
      const pushEventSettings = [{...json, ...res.data}, ...getState().settings.pushEvents.subscribers];
      dispatch({
        type: SET_PUSH_EVENT_SETTINGS,
        payload: { subscribers: pushEventSettings },
      });
      return res;
    })
    .catch((err) => {
      console.log(err);
      dispatch(
        setErrorMessage(err.response ? err.response.data : "System error.")
      );
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
      throw err;
    });
};

export const removePushEventsSubscriber = (index, id) => (dispatch, getState) => {
  dispatch({ type: SET_LOADING_SETTINGS, payload: "pushevents" });
  clearErrors(dispatch, getState);

  const dcu = getState().data.dcu;
  let pushEventSettings = [...getState().settings.pushEvents.subscribers];
  pushEventSettings.splice(index,1);

  return axiosInstanceCreator(dcu, "delete", "/api/settings/pushevents/" + id)
    .then((res) => {
      dispatch({
        type: SET_PUSH_EVENT_SETTINGS,
        payload: { subscribers: pushEventSettings },
      });
      return res;
    })
    .catch((err) => {
      console.log(err);
      dispatch(
        setErrorMessage(err.response ? err.response.data : "System error.")
      );
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
      throw err;
    });
};

export const getMsureSettings = () => (dispatch) => {
  dispatch({ type: SET_LOADING_SETTINGS, payload: "msure" });
  dispatch({ type: SET_SETTINGS_ERROR, payload: null });

  axiosInstanceCreator(null, "get", "/api/settings/msuresettings")
    .then((res) => {
      dispatch({ type: SET_MSURE_SETTINGS, payload: res.data });
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    })
    .catch((err) => {
      dispatch({
        type: SET_SETTINGS_ERROR,
        payload: err.response ? err.response.data : "System error.",
      });

      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    });
};

export const saveMsureSettings = (json, tab) => (dispatch) => {
  dispatch({ type: SET_LOADING_SETTINGS, payload: "msure" });
  dispatch({ type: SET_SETTINGS_ERROR, payload: null });

  axiosInstanceCreator(null, "post", "/api/settings/msuresettings", {
    json,
    tab: tab,
  })
    .then((res) => {
      dispatch({ type: SET_MSURE_SETTINGS, payload: json });
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    })
    .catch((err) => {
      dispatch({
        type: SET_SETTINGS_ERROR,
        payload: err.response ? err.response.data : "System error.",
      });
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    });
};

export const getCollectorSettings = () => (dispatch, getState) => {
  dispatch({ type: SET_LOADING_SETTINGS, payload: "collector" });
  dispatch({ type: CLEAR_ERRORS });
  const dcu = getState().data.dcu;
  axiosInstanceCreator(dcu, "get", "/api/settings/collector")
    .then((res) => {
      if (!res) {
        dispatch({ type: SET_SETTINGS_ERROR, payload: true });
      } else {
        dispatch({ type: SET_SETTINGS_ERROR, payload: false });
      }
      dispatch({ type: SET_COLLECTOR_SETTINGS, payload: res.data });
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: SET_SETTINGS_ERROR, payload: true });
      dispatch(
        setErrorMessage(err.response ? err.response.data : "System error.")
      );
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    });
};

export const saveCollectorSettings = (json) => (dispatch, getState) => {
  dispatch({ type: SET_LOADING_SETTINGS, payload: "collector" });
  dispatch({ type: CLEAR_ERRORS });
  const dcu = getState().data.dcu;
  axiosInstanceCreator(dcu, "post", "/api/settings/collector", {
    json,
  })
    .then((res) => {
      dispatch({ type: SET_COLLECTOR_SETTINGS, payload: json });
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    })
    .catch((err) => {
      console.log(err);
      dispatch(
        setErrorMessage(err.response ? err.response.data : "System error.")
      );
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    });
};

export const getSMTPSettings = () => (dispatch) => {
  dispatch({ type: SET_SMTP_SETTINGS, payload: "smtp" });
  dispatch({ type: CLEAR_ERRORS });

  axiosInstanceCreator(null, "get", "/api/settings/smtp")
    .then((res) => {
      if (!res) {
        dispatch({ type: SET_SETTINGS_ERROR, payload: true });
      } else {
        dispatch({ type: SET_SETTINGS_ERROR, payload: false });
      }
      dispatch({ type: SET_SMTP_SETTINGS, payload: res.data });
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: SET_SETTINGS_ERROR, payload: true });
      dispatch(
        setErrorMessage(err.response ? err.response.data : "System error.")
      );
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    });
};

export const saveSMTPSettings = (json) => (dispatch) => {
  dispatch({ type: SET_LOADING_SETTINGS, payload: "smtp" });
  dispatch({ type: CLEAR_ERRORS });

  axiosInstanceCreator(null, "post", "/api/settings/smtp", {
    json,
  })
    .then((res) => {
      dispatch({ type: SET_SMTP_SETTINGS, payload: json });
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    })
    .catch((err) => {
      console.log(err);
      dispatch(
        setErrorMessage(err.response ? err.response.data : "System error.")
      );
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    });
};

export const testSmtp = (data) => (dispatch) => {
  //console.log(userData);
  return axios.post("/api/settings/smtptest", data);
};
export const getCompanyDetailsSettings = () => (dispatch) => {
  dispatch({ type: SET_COMPANY_DETAILS, payload: "companydetails" });
  dispatch({ type: CLEAR_ERRORS });

  axiosInstanceCreator(null, "get", "/api/settings/companydetails")
    .then((res) => {
      if (!res) {
        dispatch({ type: SET_SETTINGS_ERROR, payload: true });
      } else {
        dispatch({ type: SET_SETTINGS_ERROR, payload: false });
      }
      dispatch({ type: SET_COMPANY_DETAILS, payload: res.data });
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: SET_SETTINGS_ERROR, payload: true });
      dispatch(
        setErrorMessage(err.response ? err.response.data : "System error.")
      );
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    });
};

export const saveCompanyDetailsSettings = (json, file) => (dispatch) => {
  dispatch({ type: SET_LOADING_SETTINGS, payload: "companydetails" });
  dispatch({ type: CLEAR_ERRORS });

  axiosInstanceCreator(null, "post", "/api/settings/companydetails", {
    json,
  })
    .then((res) => {
      if (file) {
        const formData = new FormData();
        formData.append("company_logo", file, "company_logo");

        axiosInstanceCreator(null, "post", "/api/settings/saveimage", formData)
          .then((res) => {
            window.location.reload();
          })
          .catch((err) => {
            setErrorMessage(err.response ? err.response.data : "System error.");
          });
      }
      dispatch({ type: SET_COMPANY_DETAILS, payload: json });
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    })
    .catch((err) => {
      console.log(err);
      dispatch(
        setErrorMessage(err.response ? err.response.data : "System error.")
      );
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    });
};

export const setCompanyLogo = (image) => (dispatch) => {
  dispatch({ type: "SET_COMPANY_LOGO", payload: image });
};

export const setExampleImage = (image) => (dispatch) => {
  dispatch({ type: "SET_EXAMPLE_IMAGE", payload: image });
};

export const getCollectionParams = () => (dispatch, getState) => {
  dispatch({ type: SET_LOADING_SETTINGS, payload: "datacoll" });
  dispatch({ type: CLEAR_ERRORS });
  const dcu = getState().data.dcu;
  axiosInstanceCreator(dcu, "get", "/api/settings/collectionparams")
    .then((res) => {
      dispatch({ type: SET_COLLECTION_PARAMS_LIST, payload: res.data });
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    })
    .catch((err) => {
      console.log(err);
      dispatch(
        setErrorMessage(err.response ? err.response.data : "System error.")
      );
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    });
};

export const postCollectionParams = (param, close) => (dispatch, getState) => {
  dispatch({ type: SET_LOADING_SETTINGS, payload: "datacoll" });
  dispatch({ type: CLEAR_ERRORS });
  const dcu = getState().data.dcu;
  axiosInstanceCreator(dcu, "post", "/api/settings/collectionparams", {
    data: param,
  })
    .then((res) => {
      let newList = [...getState().settings.collectionParamsList];
      const index = newList.findIndex((x) => x.id === res.data.id);
      if (index > -1) {
        newList[index] = res.data;
      } else {
        newList = [res.data, ...getState().settings.collectionParamsList];
      }
      // console.log(res.data);
      dispatch({ type: SET_COLLECTION_PARAMS_LIST, payload: newList });
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
      close();
    })
    .catch((err) => {
      console.log(err);
      dispatch(
        setErrorMessage(err.response ? err.response.data : "System error.")
      );
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    });
};

export const deleteCollectionParams = (ids, close) => (dispatch, getState) => {
  dispatch({ type: SET_LOADING_SETTINGS, payload: "datacoll" });
  dispatch({ type: CLEAR_ERRORS });
  const dcu = getState().data.dcu;
  axiosInstanceCreator(dcu, "delete", "/api/settings/collectionparams", {
    ids: ids,
  })
    .then((res) => {
      let newList = [...getState().settings.collectionParamsList];
      const response = newList.filter(function (el) {
        return ids.indexOf(el.id) < 0;
      });
      // console.log(res.data);
      dispatch({ type: SET_COLLECTION_PARAMS_LIST, payload: response });
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
      close();
    })
    .catch((err) => {
      console.log(err);
      dispatch(
        setErrorMessage(err.response ? err.response.data : "System error.")
      );

      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    });
};

export const saveMeterTypes = (ids) => (dispatch, getState) => {
  dispatch({ type: SET_LOADING_SETTINGS, payload: "metertypesave" });
  dispatch({ type: CLEAR_ERRORS });
  const dcu = getState().data.dcu;
  axiosInstanceCreator(dcu, "post", "/api/settings/metertypes", {
    ids: ids,
  })
    .then((res) => {
      let newList = [...getState().misc.meterTypes];
      for (let index = 0; index < res.data.length; index++) {
        const element = res.data[index];
        const find = newList.findIndex(
          (x) => parseInt(x.id) === parseInt(element.id)
        );
        if (find > -1) {
          console.log(find);
          newList[find] = element;
        }
      }
      dispatch({ type: SET_METER_TYPES, payload: newList });
      // const response = newList.filter(function (el) {
      //   return ids.indexOf(el.id) < 0;
      // });
      // // console.log(res.data);
      // dispatch({ type: SET_COLLECTION_PARAMS_LIST, payload: response });
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    })
    .catch((err) => {
      console.log(err);
      dispatch(
        setErrorMessage(err.response ? err.response.data : "System error.")
      );

      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    });
};

export const saveMeterDataCollectionSetting =
  (meterIds, collectionParam, close) => (dispatch, getState) => {
    dispatch({ type: SET_LOADING_SETTINGS, payload: "metercollsave" });
    dispatch({ type: CLEAR_ERRORS });

    axiosInstanceCreator(null, "post", `/api/settings/metercollectionparam`, {
      meterIds,
      collectionParam,
    })
      .then((res) => {
        let newList = [...getState().data.meters];
        for (let index = 0; index < res.data.length; index++) {
          const meter = res.data[index];
          console.log(meter);
          const find = newList.findIndex(
            (x) => parseInt(x.id) === parseInt(meter.id)
          );
          if (find > -1) {
            newList[find].meter_collection_param_id = collectionParam.id;
            newList[find].meter_collection_param_name = collectionParam.name;
            newList[find].updated_on = meter.updated_on;
          }
        }
        dispatch({ type: SET_METERS_LIST, payload: newList });

        dispatch({ type: SET_LOADING_SETTINGS, payload: false });
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          setErrorMessage(err.response ? err.response.data : "System error.")
        );

        dispatch({ type: SET_LOADING_SETTINGS, payload: false });
      });
  };

export const getMainHesSettings = () => (dispatch) => {
  dispatch({ type: SET_SMTP_SETTINGS, payload: "hesset" });
  dispatch({ type: CLEAR_ERRORS });

  axiosInstanceCreator(null, "get", "/api/settings/hes")
    .then((res) => {
      dispatch({ type: SET_HES_SETTINGS, payload: res.data });
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    })
    .catch((err) => {
      console.log(err);
      dispatch(
        setErrorMessage(err.response ? err.response.data : "System error.")
      );
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    });
};

export const saveMainHesSettings = (json) => (dispatch) => {
  dispatch({ type: SET_LOADING_SETTINGS, payload: "hesset" });
  dispatch({ type: CLEAR_ERRORS });

  axiosInstanceCreator(null, "post", "/api/settings/hes", {
    json,
  })
    .then((res) => {
      // dispatch({ type: SET_HES_SETTINGS, payload: res.data });
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    })
    .catch((err) => {
      console.log(err);
      dispatch(
        setErrorMessage(err.response ? err.response.data : "System error.")
      );
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    });
};

export const getDebugLevel = () => (dispatch, getState) => {
  dispatch({ type: SET_LOADING_SETTINGS, payload: "debuglevel" });
  dispatch({ type: CLEAR_ERRORS });
  const dcu = getState().data.dcu;

  axiosInstanceCreator(dcu, "get", "/api/settings/debuglevel")
    .then((res) => {
      dispatch({ type: SET_DEBUG_LEVEL, payload: res.data.level });
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    })
    .catch((err) => {
      console.log(err);
      dispatch(
        setErrorMessage(err.response ? err.response.data : "System error.")
      );
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    });
};
export const saveDCUGenericSettings = (json) => (dispatch, getState) => {
  dispatch({
    type: SET_DCU_LOADING,
    payload: true,
  });
  dispatch({ type: CLEAR_ERRORS });
  const dcu = getState().data.dcu;

  axiosInstanceCreator(dcu, "post", "/api/settings/dcu", {
    json,
  })
    .then((res) => {
      dispatch({
        type: SET_DCU_SETTINGS,
        payload: json,
      });
      // dispatch({ type: SET_HES_SETTINGS, payload: res.data });
      dispatch({ type: SET_DCU_LOADING, payload: false });
    })
    .catch((err) => {
      console.log(err);
      dispatch(
        setErrorMessage(err.response ? err.response.data : "System error.")
      );
      dispatch({
        type: SET_DCU_LOADING,
        payload: false,
      });
    });
};

export const saveDebugLevel = (level) => (dispatch, getState) => {
  dispatch({ type: SET_LOADING_SETTINGS, payload: "debuglevel" });
  dispatch({ type: CLEAR_ERRORS });
  const dcu = getState().data.dcu;

  axiosInstanceCreator(dcu, "post", "/api/settings/debuglevel", {
    level: level,
  }).then((res) => {
    dispatch({ type: SET_DEBUG_LEVEL, payload: level });
    dispatch({ type: SET_LOADING_SETTINGS, payload: false });
  });
};

export const getDcuGenericSettings = () => (dispatch, getState) => {
  console.log("cia");
  dispatch({ type: SET_LOADING_SETTINGS, payload: "dcugen" });
  dispatch({ type: CLEAR_ERRORS });
  const dcu = getState().data.dcu;

  axiosInstanceCreator(dcu, "get", "/api/settings/dcu")
    .then((res) => {
      dispatch({ type: SET_DCU_SETTINGS, payload: res.data });
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    })
    .catch((err) => {
      console.log(err);
      dispatch(
        setErrorMessage(err.response ? err.response.data : "System error.")
      );
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    });
};
export const getSSLInfo = () => {
  return (dispatch, getState) => {
    const dcu = getState().data.dcu;
    return axiosInstanceCreator(dcu, "get", "/api/settings/ssl");
  };
};

export const uploadSSL = (crt, key) => (dispatch, getState) => {
  const dcu = getState().data.dcu;
  const formData = new FormData();
  formData.append("crt", crt, "cert.crt");
  formData.append("crt", key, "cert.key");
  return axiosInstanceCreator(dcu, "post", "/api/settings/ssl", formData);
};
export const exportDcuParams = () => (dispatch, getState) => {
  const dcu = getState().data.dcu;
  return axiosInstanceCreator(dcu, "get", "/api/settings/dcuparamexp");
};

export const getDcuParams = () => (dispatch, getState) => {
  const dcu = getState().data.dcu;
  return axiosInstanceCreator(dcu, "get", "/api/settings/dcuparam");
};

export const uploadDcuParams = (file) => (dispatch, getState) => {
  const dcu = getState().data.dcu;
  const formData = new FormData();
  formData.append("cfg", file, file.name);
  return axiosInstanceCreator(dcu, "post", "/api/settings/dcuparam", formData);
};

export const getDcuPortsInfo = () => {
  return (dispatch, getState) => {
    const dcu = getState().data.dcu;
    return axiosInstanceCreator(dcu, "get", "/api/settings/ports");
  };
};

export const getDcuInterfacesInfo = () => {
  return (dispatch, getState) => {
    const dcu = getState().data.dcu;
    return axiosInstanceCreator(dcu, "get", "/api/settings/interfaces");
  };
};

export const getSSHInfo = () => {
  return (dispatch, getState) => {
    const dcu = getState().data.dcu;
    return axiosInstanceCreator(dcu, "get", "/api/settings/diagncosticacc");
  };
};

export const setSSHAccess = (state) => {
  return (dispatch, getState) => {
    const dcu = getState().data.dcu;
    return axiosInstanceCreator(dcu, "post", "/api/settings/diagncosticacc", {
      enabled: state,
    });
  };
};

export const getIPWhiteList = (str) => {
  return (dispatch, getState) => {
    const dcu = getState().data.dcu;
    return axiosInstanceCreator(dcu, "get", "/api/settings/ipwhitelist");
  };
};

export const setIPWhiteList = (state, list) => {
  return (dispatch, getState) => {
    const dcu = getState().data.dcu;
    return axiosInstanceCreator(dcu, "post", "/api/settings/ipwhitelist", {
      enabled: state,
      ip_list: list,
    });
  };
};
export const getG3PLCSettings = () => (dispatch, getState) => {
  dispatch({ type: SET_LOADING_SETTINGS, payload: "g3plc" });
  dispatch({ type: CLEAR_ERRORS });
  const dcu = getState().data.dcu;
  axiosInstanceCreator(dcu, "get", "/api/settings/g3plc")
    .then((res) => {
      if (typeof res.data !== "object") {
        dispatch(setErrorMessage("System error."));
      } else {
        dispatch({ type: SET_G3_PLC_SETTINGS, payload: res.data });
      }

      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: SET_SETTINGS_ERROR, payload: true });
      dispatch(
        setErrorMessage(err.response ? err.response.data : "System error.")
      );
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    });
};

export const saveG3PLCSettings = (json) => (dispatch, getState) => {
  dispatch({ type: SET_LOADING_SETTINGS, payload: "g3plc" });
  dispatch({ type: CLEAR_ERRORS });
  const dcu = getState().data.dcu;
  axiosInstanceCreator(dcu, "post", "/api/settings/g3plc", { json: json })
    .then((res) => {
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    })
    .catch((err) => {
      console.log(err);
      dispatch(
        setErrorMessage(
          err.response ? JSON.stringify(err.response.data) : "System error."
        )
      );
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    });
};

export const getUserAuthSettings = () => (dispatch, getState) => {
  dispatch({ type: SET_LOADING_SETTINGS, payload: "userauth" });
  dispatch({ type: CLEAR_ERRORS });
  const dcu = getState().data.dcu;
  axiosInstanceCreator(dcu, "get", "/api/settings/userauth")
    .then((res) => {
      if (typeof res.data !== "object") {
        dispatch(setErrorMessage("System error."));
      } else {
        dispatch({ type: SET_USER_AUTH_SETTINGS, payload: res.data });
      }

      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: SET_SETTINGS_ERROR, payload: true });
      dispatch(
        setErrorMessage(err.response ? err.response.data : "System error.")
      );
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    });
};

export const saveUserAuthSettings = (json) => (dispatch, getState) => {
  dispatch({ type: SET_LOADING_SETTINGS, payload: "userauth" });
  dispatch({ type: CLEAR_ERRORS });
  const dcu = getState().data.dcu;
  axiosInstanceCreator(dcu, "post", "/api/settings/userauth", { json: json })
    .then((res) => {
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    })
    .catch((err) => {
      console.log(err);
      dispatch(
        setErrorMessage(
          err.response ? JSON.stringify(err.response.data) : "System error."
        )
      );
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    });
};
export const getListFilteringMode = () => (dispatch, getState) => {
  const dcu = getState().data.dcu;
  return axiosInstanceCreator(dcu, "get", "/api/settings/listfiltermode");
  // return axios.get("/api/dcudatetime");
};

export const saveListFilteringMode = (data) => (dispatch, getState) => {
  const dcu = getState().data.dcu;
  return axiosInstanceCreator(dcu, "post", "/api/settings/listfiltermode", {
    mode: data,
  });
  // return axios.get("/api/dcudatetime");
};

export const getSchedulerCleanupSettings = () => (dispatch, getState) => {
  dispatch({ type: SET_LOADING_SETTINGS, payload: "schcleanup" });
  dispatch({ type: CLEAR_ERRORS });
  const dcu = getState().data.dcu;
  axiosInstanceCreator(dcu, "get", "/api/settings/schedulercleanup")
    .then((res) => {
      if (typeof res.data !== "object") {
        dispatch(setErrorMessage("System error."));
      } else {
        dispatch({ type: SET_SCHEDULER_CLEANUP_SETTINGS, payload: res.data });
      }

      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: SET_SETTINGS_ERROR, payload: true });
      dispatch(
        setErrorMessage(err.response ? err.response.data : "System error.")
      );
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    });
};

export const saveSchedulerCleanupSettings = (json) => (dispatch, getState) => {
  dispatch({ type: SET_LOADING_SETTINGS, payload: "schcleanup" });
  dispatch({ type: CLEAR_ERRORS });
  const dcu = getState().data.dcu;
  axiosInstanceCreator(dcu, "post", "/api/settings/schedulercleanup", {
    json: json,
  })
    .then((res) => {
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    })
    .catch((err) => {
      console.log(err);
      dispatch(
        setErrorMessage(
          err.response ? JSON.stringify(err.response.data) : "System error."
        )
      );
      dispatch({ type: SET_LOADING_SETTINGS, payload: false });
    });
};
