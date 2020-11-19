import { combineReducers } from "redux";
import ThreeSixtyReducer from "./threeSixty/reducers";
import LanguageReducer from "./language/reducers";
import ErrorReducer from "./error/reducers";

const rootReducer = combineReducers({
  threeSixty: new ThreeSixtyReducer().reducer,
  language: new LanguageReducer().reducer,
  error: new ErrorReducer().reducer,
});

export default rootReducer;
