import {
  CLEAR_ERRORS,
  CLEAR_NOTIFICATION,
  LOADING_UI,
  SET_ERRORS,
  SET_HOST,
  SET_NOTIFICATION,
  SET_OPTIONS,
  SET_SOCKET_IO,
  SET_SYSTEM_MODE,
  SET_SYSTEM_VERSION,
  STOP_LOADING_UI,
} from "../types";

const initialState = {
  errors: {},
  loading: false,
  notification: null,
  options: { menu: false, darkTheme: false },
  systemMode: false,
  systemVersion: null,
  host: null,
  socketio: null,
};

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SOCKET_IO:
      return {
        ...state,
        socketio: action.payload,
      };
    case SET_HOST:
      return {
        ...state,
        host: action.payload,
      };
    case SET_SYSTEM_VERSION:
      return {
        ...state,
        systemVersion: action.payload,
      };
    case SET_SYSTEM_MODE:
      return {
        ...state,
        systemMode: action.payload,
      };
    case SET_OPTIONS:
      return {
        ...state,
        options: action.payload,
      };
    case SET_ERRORS:
      const err =
        action.payload === null || action.payload === "null"
          ? {}
          : action.payload;
      return {
        ...state,
        loading: false,
        errors: err,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        loading: false,
        errors: {},
      };
    case LOADING_UI:
      return {
        ...state,
        loading: true,
      };
    case STOP_LOADING_UI:
      return {
        ...state,
        loading: false,
      };
    case SET_NOTIFICATION:
      return {
        ...state,
        notification: action.payload,
      };
    case CLEAR_NOTIFICATION:
      return {
        ...state,
        notification: null,
      };

    default:
      return state;
  }
};

export default uiReducer;
