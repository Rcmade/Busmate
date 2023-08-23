import {SET_USER_DATA, SET_IS_LOGGED_IN} from '../Constant/UserConstant';

export const authUserReducer = (state, action) => {
  switch (action.type) {
    case SET_USER_DATA:
      return {...state, user: action.payload};
    case SET_IS_LOGGED_IN:
      return {...state, isLoggedIn: action.payload};
    default:
      return state;
  }
};
