import ActionUtility from '../../../utilities/ActionUtility';
import HttpErrorResponseModel from '../../../models/HttpErrorResponseModel';
import LanguageEffect from '../effects';

export default class LanguageAction {
  static SET_LANGUAGE = 'LanguageAction.SET_LANGUAGE';

  static PROPERTY_LANGUAGE_REQUEST = 'LanguageAction.PROPERTY_LANGUAGE_REQUEST';

  static PROPERTY_LANGUAGE_REQUEST_FINISHED =
    'LanguageAction.PROPERTY_LANGUAGE_REQUEST_FINISHED';

  static setLanguage(language) {
    return ActionUtility.createAction(LanguageAction.SET_LANGUAGE, language);
  }

  static getPropertyLanguage(propertyId) {
    return async (dispatch) => {
      const model = await ActionUtility.createThunkEffect(
        dispatch,
        LanguageAction.PROPERTY_LANGUAGE_REQUEST,
        LanguageEffect.getPropertyLanguage,
        true,
        propertyId
      );
      const isError = model instanceof HttpErrorResponseModel;
      return { model, isError };
    };
  }
}

/*
const succesfulGetPropertyLanguage = (language) => ({
  type: types.GET_PROPERTY_LANGUAGE_SUCCESSFUL,
  language
});

const failureGetPropertyLanguage = (error) => ({
  type: types.GET_PROPERTY_LANGUAGE_FAILURE,
  error
});
*/
