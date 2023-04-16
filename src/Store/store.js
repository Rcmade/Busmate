import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import assignContributor from './Reducers/locationReducer';
import authUser from './Reducers/authUser';

const initialState = {};

const middlewares = getDefaultMiddleware({
  // https://github.com/reduxjs/redux-toolkit/issues/415
  immutableCheck: false,
});

if (__DEV__) {
  const createDebugger = require('redux-flipper').default;
  middlewares.push(createDebugger());
}

const store = configureStore({
  reducer: {
    assignContributor: assignContributor,
    authUser: authUser,
  },
  preloadedState: initialState,
  middleware: middlewares,
});

export default store;
