import HttpErrorResponseModel from '../../../models/HttpErrorResponseModel';
import ActionUtility from '../../../utilities/ActionUtility';
import ThreeSixtyEffect from '../effects';

export default class ThreeSixtyAction {
  static SAVE_LOG_REQUEST = 'SAVE_LOG_REQUEST';

  static SAVE_LOG_REQUEST_FINISHED = 'SAVE_LOG_REQUEST_FINISHED';

  static VIEW_MENU_REQUEST = 'ThreeSixtyAction.VIEW_MENU_REQUEST';

  static VIEW_MENU_REQUEST_FINISHED =
    'ThreeSixtyAction.VIEW_MENU_REQUEST_FINISHED';

  static STYLE_MENU_REQUEST = 'ThreeSixtyAction.STYLE_MENU_REQUEST';

  static STYLE_MENU_REQUEST_FINISHED =
    'ThreeSixtyAction.STYLE_MENU_REQUEST_FINISHED';

  static THREE_SIXTY_DATA_REQUEST = 'ThreeSixtyAction.THREE_SIXTY_DATA_REQUEST';

  static THREE_SIXTY_DATA_REQUEST_FINISHED =
    'ThreeSixtyAction.THREE_SIXTY_DATA_REQUEST_FINISHED';

  static GET_FURNITURE_BY_STYLES_REQUEST = 'GET_FURNITURE_BY_STYLES_REQUEST';

  static GET_FURNITURE_BY_STYLES_REQUEST_FINISHED =
    'GET_FURNITURE_BY_STYLES_REQUEST_FINISHED';

  static CLICK_FURNITURE_REQUEST_FINISHED = 'CLICK_FURNITURE_REQUEST_FINISHED';

  static RESET_REQUEST_FINISHED = 'RESET_REQUEST_FINISHED';

  static SET_TOUR_360_REQUEST_FINISHED = 'SET_TOUR_360_REQUEST_FINISHED';

  static SET_PREVIEW_REQUEST_FINISHED = 'SET_PREVIEW_REQUEST_FINISHED';

  static SET_SURVEY_REQUEST_FINISHED = 'SET_SURVEY_REQUEST_FINISHED';

  static SET_SELECTED_STYLE_REQUEST_FINISHED =
    'SET_SELECTED_STYLE_REQUEST_FINISHED';

  static SET_SELECTED_SCENE_REQUEST_FINISHED =
    'SET_SELECTED_SCENE_REQUEST_FINISHED';

  static SET_SELECTED_FINISH_REQUEST_FINISHED =
    'SET_SELECTED_FINISH_REQUEST_FINISHED';

  static EXPAND_REQUEST_FINISHED = 'EXPAND_REQUEST_FINISHED';

  static SET_BUILDER_REQUEST_FINISHED = 'SET_BUILDER_REQUEST_FINISHED';

  static SELECTED_MENU_OPTION_REQUEST_FINISHED =
    'SELECTED_MENU_OPTION_REQUEST_FINISHED';

  static SELECTED_USE_REQUEST_FINISHED = 'SELECTED_USE_REQUEST_FINISHED';

  static CURRENT_LEVEL_REQUEST_FINISHED = 'CURRENT_LEVEL_REQUEST_FINISHED';

  static GET_SCENES = 'GET_SCENES';

  static GET_SCENES_FINISHED = 'GET_SCENES_FINISHED';

  static getScenes() {
    return async (dispatch, getState) => {
      const { language: stateLanguage, threeSixty } = getState();
      const { language } = stateLanguage;
      const {
        builderId,
        propertyId,
        layoutName,
        currentLevel,
        selectedStyle,
        mode
      } = threeSixty;

      const model = await ActionUtility.createThunkEffect(
        dispatch,
        ThreeSixtyAction.GET_SCENES,
        ThreeSixtyEffect.getScenes,
        false,
        language,
        builderId,
        propertyId,
        layoutName,
        currentLevel,
        selectedStyle,
        mode
      );

      const isError = model instanceof HttpErrorResponseModel;
      return { model, isError };
    };
  }
}
