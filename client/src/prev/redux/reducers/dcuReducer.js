import {
  CLEAR_DATA,
  CLEAR_DSTAT,
  SET_CONFIG,
  SET_DCUWEB_VERSION,
  SET_DCU_LOADING,
  SET_DSTAT,
  SET_DSTAT_DAILY,
  SET_SOCKETS_RESPONSE,
  SET_STATUS,
} from "../types";

const initialState = {
  loading: false,
  cfg: null,
  status: null,
  ramArray: [],
  dstat: [],
  dstatDaily: [],
  webVersion: null,
  dcuResponse: null,
};

const dcuReducer = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_DSTAT:
      return {
        ...state,
        dstat: [],
      };
    case SET_CONFIG:
      return {
        ...state,
        cfg: action.payload,
      };
    case CLEAR_DATA:
      return {
        ...state,
        cfg: null,
        status: null,
        ramArray: [],
        webVersion: null,
      };
    case SET_STATUS:
      let ram =
        action.payload.DCStatus.Platform.RAMFree &&
        action.payload.DCStatus.Platform.RAMFree;
      const newArray = [...state.ramArray, ram];
      if (newArray.length > 30) newArray.shift();
      return {
        ...state,
        status: action.payload,
        ramArray: newArray,
      };
    case SET_DSTAT:
      const newArr = state.dstat;
      newArr.push(action.payload);
      if (newArr.length > 30) newArr.shift();
      return {
        ...state,
        dstat: newArr,
      };
    case SET_DSTAT_DAILY:
      return {
        ...state,
        dstatDaily: action.payload,
      };

    case SET_DCUWEB_VERSION:
      return {
        ...state,
        webVersion: action.payload,
      };
    case SET_SOCKETS_RESPONSE:
      return {
        ...state,
        dcuResponse: action.payload,
      };
    case SET_DCU_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

export default dcuReducer;
