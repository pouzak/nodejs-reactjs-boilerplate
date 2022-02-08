import { SET_SERVICES_LOADING, SET_SYSTEM_SERVICES } from "../types";
const initialState = {
  services: null,
  loading: true,
  error: null,
};

const servicesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SYSTEM_SERVICES:
      return {
        ...state,
        services: action.payload,
      };
    case SET_SERVICES_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

export default servicesReducer;
