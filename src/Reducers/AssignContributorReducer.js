import {SET_CONTRIBUTOR_STATE} from "../Constant/UserConstant"
export const assignContributorReducer = (state, action) => {
  switch (action.type) {
    case SET_CONTRIBUTOR_STATE:
      return {...state, ...action.payload};
    default:
      return state;
  }
};
