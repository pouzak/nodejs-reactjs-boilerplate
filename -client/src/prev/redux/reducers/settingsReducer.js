import {
  SET_COLLECTION_PARAMS_LIST,
  SET_COLLECTOR_SETTINGS,
  SET_COMPANY_DETAILS,
  SET_COMPANY_LOGO,
  SET_DCU_SETTINGS,
  SET_DEBUG_LEVEL,
  SET_EXAMPLE_IMAGE,
  SET_G3_PLC_SETTINGS,
  SET_HES_SETTINGS,
  SET_LOADING_SETTINGS,
  SET_MSURE_SETTINGS,
  SET_PUSH_EVENT_SETTINGS,
  SET_SCHEDULER_CLEANUP_SETTINGS,
  SET_SETTINGS_ERROR,
  SET_SMTP_SETTINGS,
  SET_USER_AUTH_SETTINGS,
} from "../types";

const initialState = {
  pushEvents: {subscribers: []},
  loading: false,
  collector: null,
  error: false,
  msure: null,
  smtp: null,
  companyDetails: null,
  companyLogo: null,
  exampleImage: null,
  collectionParamsList: [],
  hes: null,
  debugLevel: null,
  dcu: null,
  g3_plc: null,
  userAuth: null,
  schedulerCleanup: null,
};

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MSURE_SETTINGS:
      return {
        ...state,
        msure: action.payload,
      };
    case SET_PUSH_EVENT_SETTINGS:
      return {
        ...state,
        pushEvents: action.payload,
        loading: false
      };
    case SET_LOADING_SETTINGS:
      return {
        ...state,
        loading: action.payload,
      };
    case SET_COLLECTOR_SETTINGS:
      return {
        ...state,
        collector: action.payload,
      };
    case SET_SETTINGS_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case SET_SMTP_SETTINGS:
      return {
        ...state,
        smtp: action.payload,
      };
    case SET_COMPANY_DETAILS:
      return {
        ...state,
        companyDetails: action.payload,
      };
    case SET_COMPANY_LOGO:
      return {
        ...state,
        companyLogo: action.payload,
      };
    case SET_EXAMPLE_IMAGE:
      return {
        ...state,
        exampleImage: action.payload,
      };
    case SET_COLLECTION_PARAMS_LIST:
      return {
        ...state,
        collectionParamsList: action.payload,
      };
    case SET_HES_SETTINGS:
      return {
        ...state,
        hes: action.payload,
      };
    case SET_DEBUG_LEVEL:
      return {
        ...state,
        debugLevel: action.payload,
      };
    case SET_DCU_SETTINGS:
      return {
        ...state,
        dcu: action.payload,
      };
    case SET_G3_PLC_SETTINGS:
      return {
        ...state,
        g3_plc: action.payload,
      };
    case SET_USER_AUTH_SETTINGS:
      return {
        ...state,
        userAuth: action.payload,
      };
    case SET_SCHEDULER_CLEANUP_SETTINGS:
      return {
        ...state,
        schedulerCleanup: action.payload,
      };
    default:
      return state;
  }
};

export default settingsReducer;
