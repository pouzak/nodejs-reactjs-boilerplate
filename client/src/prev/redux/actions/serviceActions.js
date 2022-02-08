import { axiosInstanceCreator } from "../misc";

export const setServiceAction = (service, action) => {
  return (dispatch) => {
    return axiosInstanceCreator(null, "post", `/api/serviceaction`, {
      service: service,
      action: action,
    });
  };
};

export const getServiceLogList = (service) => {
  return (dispatch) => {
    return axiosInstanceCreator(null, "post", `/api/serviceloglist`, {
      service: service,
    });
  };
};

export const getLogTail = (service, log) => {
  return (dispatch) => {
    return axiosInstanceCreator(null, "post", `/api/servicelog`, {
      service: service,
      log: log,
    });
  };
};
