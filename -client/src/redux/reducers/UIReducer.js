
import {
    SET_LOADING_UI, SET_UI_ERROR
} from "../types";

const initialState = {
    error: null,
    loading: false
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOADING_UI:
            return {
                ...state,
                loading: action.payload,
            };
        case SET_UI_ERROR:
            return {
                ...state,
                error: action.payload
            };

        default:
            return state;
    }
};

export default userReducer;
