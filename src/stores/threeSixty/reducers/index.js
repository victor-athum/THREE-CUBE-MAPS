import BaseReducer from '../../../utilities/BaseReducer';
import ThreeSixtyAction from '../actions';

export default class ThreeSixtyReducer extends BaseReducer {
  initialState = {
    cube: [],
    scenes: [],
    menu: [],
    builderLogo: '',
    builderId: '',
    propertyId: '',
    layoutName: '',
    defaultStyle: '',
    displayName: '',
    levels: [],
    furniture: [],
    roomUse: [],
    finishScenes: {},
    personalized: {},
    projectId: 0,
    rotationMessage: '',
    shoppingCart: {},
    showError: false,
    surveyCompletedDefaults: {},
    totalLevels: 1,
    urls: {},
    isPreview: false,
    isSurveyCompleted: false,
    selectedScene: 'default',
    selectedFinish: 'default',
    selectedStyle: 'default',
    selectedStyleName: 'default',
    currentRoomUse: 'default',
    currentLevel: 1,
    mode: 'day',
    tour360: false,
    expanded: false,
    selectedMenuOption: '',
    menuOptions: [
      'mini-map',
      'views',
      'styles',
      'furniture',
      'change-room',
      'finishes'
    ],
    threeSixty: null
  };

  [ThreeSixtyAction.GET_SCENES_FINISHED](state, action) {
    return {
      ...state,
      cube: action.payload.cube
    };
  }
}
