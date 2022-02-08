import { SET_PLC_LOADING, SET_PLC_PRE_SHARED_KEYS } from "../types";

const initialState = {
  preSharedKeys: null,
  loading: false,
};

const plcReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PLC_PRE_SHARED_KEYS:
      return {
        ...state,
        preSharedKeys: action.payload,
      };
    case SET_PLC_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    default:
      return state;
  }
};

export default plcReducer;
