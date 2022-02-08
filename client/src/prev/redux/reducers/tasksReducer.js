import {
  SET_SYSTEM_TASKS,
  SET_TASKS,
  SET_TASK_LOADING,
  SET_USERS_TASKS,
} from "../types";

const initialState = {
  userTasks: null,
  loading: false,
  tasks: null,
  systemTasks: null,
};

const tasksReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SYSTEM_TASKS:
      return {
        ...state,
        systemTasks: action.payload,
      };
    case SET_TASKS:
      return {
        ...state,
        tasks: action.payload,
      };
    case SET_USERS_TASKS:
      return {
        ...state,
        userTasks: action.payload,
      };
    case SET_TASK_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    default:
      return state;
  }
};

export default tasksReducer;
