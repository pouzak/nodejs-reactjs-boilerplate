import { SET_METER_TYPES, SET_TABLE_DESCR } from "../types";
const initialState = {
  tableDescriptions: null,
  meterTypes: [],
  fws: [],
};

const miscReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TABLE_DESCR:
      return {
        ...state,
        tableDescriptions: action.payload,
      };
    case SET_METER_TYPES:
      return {
        ...state,
        meterTypes: action.payload,
      };
    default:
      return state;
  }
};

export default miscReducer;
