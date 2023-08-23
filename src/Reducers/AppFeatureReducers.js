import {
  APP_FEATURE_SERVICE,
  SHOW_TOAST,
  TOGGLE_THEME,
} from '../Constant/AppConstant';
export const appFeatureReducer = (state, action) => {
  switch (action.type) {
    case APP_FEATURE_SERVICE:
      return {...state, isServiceAvailable: action.payload};
    case SHOW_TOAST:
      return {...state, toast: action.payload};
    case TOGGLE_THEME:
      return {...state, theme: action.payload};
    default:
      return state;
  }
};
