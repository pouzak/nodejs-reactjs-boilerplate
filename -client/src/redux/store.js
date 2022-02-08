import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import userReducer from "./reducers/UserReducer";
import uiReducer from "./reducers/UIReducer";


const initialState = {};

const middleware = [thunk];

//redux devtools enable

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

//no dev tools

// const composeEnhancers =
//   typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
//     ? compose
//     : compose;

const enhancer = composeEnhancers(applyMiddleware(...middleware));

const reducers = combineReducers({
  user: userReducer,
  ui: uiReducer,
});

const store = createStore(reducers, initialState, enhancer);

export default store;
