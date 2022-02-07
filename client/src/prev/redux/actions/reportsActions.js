import { axiosInstanceCreator } from "../misc";
export const getKPIReports = () => {
  return (dispatch, getState) => {
    // console.log(dcuId);
    const dcu = getState().data.dcu;
    return axiosInstanceCreator(dcu, "get", `/api/kpireports`);
  };
};

export const downloadKPIFile = (id) => {
  return (dispatch, getState) => {
    const dcu = getState().data.dcu;
    return axiosInstanceCreator(dcu, "get", `/api/kpireportcsv/${id}`);
  };
};
