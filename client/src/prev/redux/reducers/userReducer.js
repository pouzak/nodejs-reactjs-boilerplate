import {
  LOADING_USER,
  SET_AUTHENTICATED,
  SET_SYSTEM_USERS,
  SET_UNAUTHENTICATED,
  SET_USER,
  STOP_LOADING_USER,
} from "../types";

const initialState = {
  authenticated: false,
  loading: false,
  user: null,
  socketUsers: [],
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SYSTEM_USERS:
      return {
        ...state,
        socketUsers: action.payload,
      };
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true,
        user: null,
        loading: false,
      };
    case SET_UNAUTHENTICATED:
      return {
        ...state,
        authenticated: false,
        user: null,
      };
    case SET_USER:
      return {
        ...state,
        authenticated: true,
        user: action.payload,
        loading: false,
      };
    case STOP_LOADING_USER:
      return {
        ...state,
        loading: false,
      };
    case LOADING_USER:
      return {
        ...state,
        loading: true,
      };

    default:
      return state;
  }
};

export default userReducer;
