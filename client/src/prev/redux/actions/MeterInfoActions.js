import axios from "axios";
import { axiosInstanceCreator } from "../misc";
import {
  CLEAR_ERRORS, SET_BLACK_LIST, SET_ERRORS, SET_LOADING_DATA, SET_METERS_LIST,
  SET_METER_INFO, SET_WHITE_LIST
} from "../types";

export const getMeterInfo = (id) => (dispatch, getState) => {
  dispatch({ type: SET_LOADING_DATA, payload: "meterinfo" });
  dispatch({ type: CLEAR_ERRORS });
  const dcu = getState().data.dcu;
  axiosInstanceCreator(dcu, "get", `/api/meterinfo/${id}`)
    .then((res) => {
      dispatch({ type: SET_METER_INFO, payload: res.data });
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

export const saveMeterSettings =
  (id, data, dcuId, dcuMeterId) => (dispatch, getState) => {
    return axiosInstanceCreator(null, "post", `/api/meterinfo/${id}`, {
      data: data,
      dcu_id: dcuId,
      dcu_meter_id: dcuMeterId,
    });
  };

export const saveMeterConnectionSettings =
  (data) => (dispatch, getState) => {
    const meterInfo = getState().data.meterInfo;
    return axiosInstanceCreator(null, "patch", `/api/meterconnection/${meterInfo.meter.id}`, {
      data: data,
      dcu_id: meterInfo.meter.dcuId,
      dcu_meter_id: meterInfo.meter.dcuMeterId,
    }).then(res => {
      const modifiedMeterInfo = { ...meterInfo, meter_conn: { ...meterInfo.meter_conn, ...data } };
      dispatch({ type: SET_METER_INFO, payload: modifiedMeterInfo });
    });
  };

export const setMetersActive =
  (meters, pollState, close, setSelection) => (dispatch, getState) => {
    dispatch({ type: SET_LOADING_DATA, payload: "meteractive" });
    dispatch({ type: CLEAR_ERRORS });

    axios
      .post(`/api/metersactive`, { meters, poll: pollState })
      .then((res) => {
        if (res.data.meters && res.data.meters.length > 0) {
          const meters = res.data.meters;
          if (getState().data.meters.length) {
            const meterList = [...getState().data.meters];
            for (let index = 0; index < meters.length; index++) {
              const meter = meters[index];
              const find = meterList.findIndex((x) => x.id === meter.id);
              if (find > -1) {
                meterList[find].is_active = meter.is_active;
              }
            }
            const uncheck = meterList.map((x) => {
              if (x.tableData?.checked) {
                return {
                  ...x,
                  tableData: { ...x.tableData, checked: false },
                };
              }
              return x;
            });
            dispatch({ type: SET_METERS_LIST, payload: uncheck });
          }
          if (getState().data.blackList.length) {
            const meterList = [...getState().data.blackList];
            for (let index = 0; index < meters.length; index++) {
              const meter = meters[index];
              const find = meterList.findIndex((x) => x.id === meter.id);
              if (find > -1) {
                meterList[find].is_active = meter.is_active;
              }
            }
            const uncheck = meterList.map((x) => {
              if (x.tableData?.checked) {
                return {
                  ...x,
                  tableData: { ...x.tableData, checked: false },
                };
              }
              return x;
            });
            dispatch({ type: SET_BLACK_LIST, payload: uncheck });
          }
        }
        if (res.data.error) {
          dispatch({
            type: SET_ERRORS,
            payload: { notification: res.data.error.toString() },
          });
        }
        dispatch({ type: SET_LOADING_DATA, payload: false });
        close();
        setSelection([]);
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

export const saveMetersBlackListChanges =
  (meters, enableblackList, blackListTime, close, setSelection) =>
    (dispatch, getState) => {
      dispatch({ type: SET_LOADING_DATA, payload: "blacklistsave" });
      dispatch({ type: CLEAR_ERRORS });
      const dcu = getState().data.dcu;
      axiosInstanceCreator(dcu, "post", `/api/blacklist/`, {
        meters,
        enable_blacklist: enableblackList,
        time: blackListTime,
      })
        // axios
        //   .post(`/api/blacklist`, {
        //     meters,
        //     enable_blacklist: enableblackList,
        //     time: blackListTime,
        //   })
        .then((res) => {
          if (res.data.data && res.data.data.length > 0) {
            if (enableblackList) {
              const meters = res.data.data;
              const meterList = [...getState().data.meters];
              for (let index = 0; index < meters.length; index++) {
                const meter = meters[index];
                const find = meterList.findIndex(
                  (x) => x.logical_device_name === meter.logical_device_name
                );
                if (find > -1) {
                  meterList[find].is_excluded = meter.is_excluded;
                }
              }

              dispatch({ type: SET_METERS_LIST, payload: meterList });
            } else {
              const meters = res.data.data;
              const meterList = [...getState().data.meters];
              for (let index = 0; index < meters.length; index++) {
                const meter = meters[index];
                const find = meterList.findIndex(
                  (x) => x.logical_device_name === meter.logical_device_name
                );

                if (find > -1) {
                  meterList[find].is_excluded = false;
                }
              }

              dispatch({ type: SET_METERS_LIST, payload: meterList });
            }
          }

          if (res.data.error) {
            dispatch({
              type: SET_ERRORS,
              payload: { notification: res.data.error.toString() },
            });
          }
          dispatch({ type: SET_LOADING_DATA, payload: false });
          dispatch({ type: SET_BLACK_LIST, payload: [] });
          !res.data.error && close();
          setSelection && setSelection([]);
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

export const saveMetersWhiteListChanges =
  (meters, enableList, ListTime, close, setSelection) =>
    (dispatch, getState) => {
      dispatch({ type: SET_LOADING_DATA, payload: "blacklistsave" });
      dispatch({ type: CLEAR_ERRORS });
      const dcu = getState().data.dcu;
      axiosInstanceCreator(dcu, "post", `/api/whitelist/`, {
        meters,
        enable_whitelist: enableList,
        time: ListTime,
      })
        // axios
        //   .post(`/api/blacklist`, {
        //     meters,
        //     enable_blacklist: enableblackList,
        //     time: blackListTime,
        //   })
        .then((res) => {
          console.log(res.data);
          if (res.data.data && res.data.data.length > 0) {
            if (enableList) {
              const meters = res.data.data;
              const meterList = [...getState().data.meters];
              for (let index = 0; index < meters.length; index++) {
                const meter = meters[index];
                const find = meterList.findIndex(
                  (x) => x.logical_device_name === meter.logical_device_name
                );
                if (find > -1) {
                  meterList[find].is_excluded = meter.is_excluded;
                }
              }

              dispatch({ type: SET_METERS_LIST, payload: meterList });
            } else {
              const meters = res.data.data;
              const meterList = [...getState().data.meters];
              for (let index = 0; index < meters.length; index++) {
                const meter = meters[index];
                const find = meterList.findIndex(
                  (x) => x.logical_device_name === meter.logical_device_name
                );

                if (find > -1) {
                  meterList[find].is_excluded = false;
                }
              }

              dispatch({ type: SET_METERS_LIST, payload: meterList });
            }
          }

          if (res.data.error) {
            dispatch({
              type: SET_ERRORS,
              payload: { notification: res.data.error.toString() },
            });
          }
          dispatch({ type: SET_LOADING_DATA, payload: false });
          dispatch({ type: SET_WHITE_LIST, payload: [] });
          !res.data.error && close();
          setSelection && setSelection([]);
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
