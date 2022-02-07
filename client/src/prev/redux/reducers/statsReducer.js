import { SET_METER_STATS, SET_STATS_LOADING } from "../types";

const initialState = {
  hesStats: {
    loading: false,
    data: null,
  },
};

const statsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_METER_STATS:
      return {
        ...state,
        [action.payload.statItem]: {
          ...state[action.payload.statItem],
          data: action.payload.data,
        },
      };
    case SET_STATS_LOADING:
      return {
        ...state,
        [action.payload.statItem]: {
          ...state[action.payload.statItem],
          loading: action.payload.state,
        },
      };

    default:
      return state;
  }
};

export default statsReducer;
