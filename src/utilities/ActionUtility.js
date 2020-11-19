import HttpErrorResponseModel from '../models/HttpErrorResponseModel';
import ErrorAction from '../stores/error/actions';
import LoadingAction from '../stores/loading/actions';

export default class ActionUtility {
  static async createThunkEffect(
    dispatch,
    actionType,
    effect,
    loading,
    ...args
  ) {
    dispatch(ActionUtility.createAction(actionType));
    if (loading) {
      dispatch(ActionUtility.createAction(LoadingAction.IS_LOADING, true));
    }
    const model = await effect(...args);
    dispatch(ActionUtility.createAction(LoadingAction.IS_LOADING, false));
    const isError = model instanceof HttpErrorResponseModel;

    if (isError) {
      dispatch(
        ActionUtility.createAction(ErrorAction.ADD_ERROR, model.message)
      );
    } else {
      dispatch(ActionUtility.createAction(`${actionType}_FINISHED`, model));
      dispatch(ActionUtility.createAction(ErrorAction.REMOVE_ERROR, ''));
    }

    return model;
  }

  static createAction(type, payload, error = false, meta = null) {
    return { type, payload, error, meta };
  }
}
