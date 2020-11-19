import ActionUtility from '../../../utilities/ActionUtility';

export default class ErrorAction {
  static ADD_ERROR = 'ErrorAction.ADD_ERROR';

  static REMOVE_ERROR = 'ErrorAction.REMOVE_ERROR';

  static addError(message) {
    return ActionUtility.createAction(ErrorAction.ADD_ERROR, message);
  }

  static removeError() {
    return ActionUtility.createAction(ErrorAction.REMOVE_ERROR, '');
  }
}
