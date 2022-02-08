import {
  SET_ALARM_LIST,
  SET_BILLING,
  SET_BLACK_LIST,
  SET_BLACK_WHITE_LIST_FILTERING_MODE,
  SET_DAILY_PROFILE,
  SET_DCU,
  SET_DCU_LIST,
  SET_EVENT_LOG,
  SET_INST_VALUES,
  SET_LOADING_DATA,
  SET_LOAD_PROFILE,
  SET_METER,
  SET_METERS_LIST,
  SET_METER_HIERARCHY,
  SET_METER_INFO,
  SET_METER_OWNER_LIST,
  SET_MSURE_PROFILE,
  SET_PARAM_TEMPLATES,
  SET_SELECTED_METERS,
  SET_SELECTED_METERS_DATA,
  SET_TEMPORARY_DATA,
  SET_USERS,
  SET_WHITE_LIST,
} from "../types";

const initialState = {
  meters: [],
  loading: false,
  meter: null,
  meterInfo: null,
  billing: [],
  loadProfile: [],
  instantValues: [],
  eventLog: [],
  users: [],
  selectedMeters: [],
  selectedMetersData: null,
  metersChartData: null,
  dcuList: [],
  dcu: null,
  meterHierarchy: null,
  temporary: [],
  paramTeplates: [],
  alarmList: [],
  msureProfile: [],
  ownerList: [],
  blackList: [],
  whiteList: [],
  bwListFilteringMode: null,
  dailyProfile: [],
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MSURE_PROFILE:
      return {
        ...state,
        msureProfile: action.payload,
      };
    case SET_EVENT_LOG:
      return {
        ...state,
        eventLog: action.payload,
      };
    case SET_ALARM_LIST:
      return {
        ...state,
        alarmList: action.payload,
      };
    case SET_PARAM_TEMPLATES:
      return {
        ...state,
        paramTemplates: action.payload,
      };
    case SET_INST_VALUES:
      return {
        ...state,
        instantValues: action.payload,
      };
    case SET_TEMPORARY_DATA:
      return {
        ...state,
        temporary: action.payload,
      };
    case SET_METER_HIERARCHY:
      return {
        ...state,
        meterHierarchy: action.payload,
      };
    case SET_METER_INFO:
      return {
        ...state,
        meterInfo: action.payload,
      };
    case SET_DCU:
      if (action.payload) {
        const item = {
          id: action.payload.id,
          api_url: action.payload.api_url,
          serial_no: action.payload.serial_no,
        };
        localStorage.setItem("dcuid", btoa(JSON.stringify(item)));
      } else {
        localStorage.removeItem("dcuid");
      }
      return {
        ...state,
        dcu: action.payload,
      };
    case SET_DCU_LIST:
      return {
        ...state,
        dcuList: action.payload,
      };
    case SET_LOAD_PROFILE:
      return {
        ...state,
        loadProfile: action.payload,
      };
    case SET_BILLING:
      return {
        ...state,
        billing: action.payload,
      };
    case SET_SELECTED_METERS_DATA:
      return {
        ...state,
        selectedMetersData: action.payload.data,
        metersChartData: action.payload.dates,
      };
    case SET_USERS:
      return {
        ...state,
        users: action.payload,
      };
    case SET_SELECTED_METERS:
      return {
        ...state,
        selectedMeters: action.payload,
      };
    case SET_METERS_LIST:
      return {
        ...state,
        meters: action.payload,
      };
    case SET_METER:
      return {
        ...state,
        meter: action.payload,
      };
    case SET_LOADING_DATA:
      return {
        ...state,
        loading: action.payload,
      };
    case SET_METER_OWNER_LIST:
      return {
        ...state,
        ownerList: action.payload,
      };
    case SET_BLACK_LIST:
      return {
        ...state,
        blackList: action.payload,
      };
    case SET_WHITE_LIST:
      return {
        ...state,
        whiteList: action.payload,
      };
    case SET_DAILY_PROFILE:
      return {
        ...state,
        dailyProfile: action.payload,
      };
    case SET_BLACK_WHITE_LIST_FILTERING_MODE:
      return {
        ...state,
        bwListFilteringMode: action.payload,
      };
    default:
      return state;
  }
};

export default dataReducer;
