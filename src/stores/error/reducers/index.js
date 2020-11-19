/* eslint-disable class-methods-use-this */
import ErrorAction from '../actions';
import BaseReducer from '../../../utilities/BaseReducer';

export default class ErrorReducer extends BaseReducer {
  initialState = {
    message: ''
  };

  [ErrorAction.ADD_ERROR](state, action) {
    return {
      ...state,
      message: action.payload
    };
  }

  [ErrorAction.REMOVE_ERROR](state, action) {
    return {
      ...state,
      message: action.payload
    };
  }
}
