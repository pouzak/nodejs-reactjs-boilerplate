import { axiosInstanceCreator } from "../misc";

export const getTableComments = (data) => (dispatch, getState) => {
  const dcu = getState().data.dcu;
  return axiosInstanceCreator(dcu, "post", "/api/tabledescr", data);
};

export const getReportData = (data) => (dispatch, getState) => {
  const dcu = getState().data.dcu;
  return axiosInstanceCreator(dcu, "post", "/api/reportdata", data);
};
