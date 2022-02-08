import {
  i18nReducer, loadTranslations,
  setLocale,
  syncTranslationWithStore
} from "react-redux-i18n";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { translations } from "../utils/translation/translation";
import dataReducer from "./reducers/dataReducer";
import dcuReducer from "./reducers/dcuReducer";
import eventsReducer from "./reducers/eventsReducer";
import miscReducer from "./reducers/miscReducer";
import plcReducer from "./reducers/plcReducer";
import serviceReducer from "./reducers/servicesReducer";
import settingsReducer from "./reducers/settingsReducer";
import statsReducer from "./reducers/statsReducer";
import tasksReducer from "./reducers/tasksReducer";
import uiReducer from "./reducers/uiReducer";
import userReducer from "./reducers/userReducer";


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
  data: dataReducer,
  tasks: tasksReducer,
  stats: statsReducer,
  dcu: dcuReducer,
  i18n: i18nReducer,
  settings: settingsReducer,
  misc: miscReducer,
  services: serviceReducer,
  events: eventsReducer,
  plc: plcReducer,
});

const store = createStore(reducers, initialState, enhancer);
syncTranslationWithStore(store);
store.dispatch(loadTranslations(translations));
store.dispatch(setLocale("EN"));

export default store;
