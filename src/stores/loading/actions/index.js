import ActionUtility from '../../../utilities/ActionUtility';

export default class LoadingAction {
  static IS_LOADING = 'LoadingAction.IS_LOADING';

  static isLoading(loading) {
    return ActionUtility.createAction(LoadingAction.IS_LOADING, loading);
  }
}
