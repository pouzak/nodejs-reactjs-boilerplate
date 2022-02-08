import {
  SET_EVENTS_LOADING,
  SET_SYSTEM_EVENTS,
  SET_SYSTEM_EVENTS_CONFIG,
} from "../types";

const initialState = {
  loading: false,
  systemEvents: [],
  eventsConfig: [],
};

const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SYSTEM_EVENTS:
      return {
        ...state,
        systemEvents: action.payload,
      };
    case SET_EVENTS_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case SET_SYSTEM_EVENTS_CONFIG:
      return {
        ...state,
        eventsConfig: action.payload,
      };

    default:
      return state;
  }
};

export default eventsReducer;
