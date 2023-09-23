import {PermissionsAndroid} from 'react-native';
import {getAvailableTime, userInitialRoute} from '../../Server';
import {getExpiresStorage, setExpiresStorage} from '../storage';
import {APP_FEATURE_SERVICE} from '../../Constant/AppConstant';
import {SET_IS_LOGGED_IN, SET_USER_DATA} from '../../Constant/UserConstant';

class InitialCheck {
  async setInitalState(appFeatureDispatch) {
    const getAvailableService = await getExpiresStorage('isServiceAvailable');
    appFeatureDispatch({
      type: APP_FEATURE_SERVICE,
      payload: {
        destinationLatitude:
          getAvailableService?.destinationLatitude || 22.80007,
        destinationLongitude:
          getAvailableService?.destinationLongitude || 75.826985,
        startTime:
          getAvailableService?.startTime || new Date().setHours(7, 0, 0, 0),
        endTime:
          getAvailableService?.endTime || new Date().setHours(9, 3, 0, 0),
        temprary: getAvailableService?.temprary || false,
      },
    });
  }
  async permission(navigation, StackActions, isMounted) {
    const fineLocationGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (!fineLocationGranted && isMounted) {
      navigation.dispatch(StackActions.replace('FineLocation'));
      return;
    }
    const backgroundLocationGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    );
    // Check fine Background permission
    if (!backgroundLocationGranted && isMounted) {
      navigation.dispatch(StackActions.replace('BackgroundLocation'));
      return;
    }

    return;
  }

  async checkAvailableServices(appFeatureDispatch) {
    const {data} = await getAvailableTime();
    if (data?.startTime) {
      await setExpiresStorage('availableTime', data, 1000 * 60 * 60 * 2);
      appFeatureDispatch({
        type: APP_FEATURE_SERVICE,
        payload: data,
      });
    } else {
      this.setInitalState(appFeatureDispatch);
    }
  }

  async checkIsAuthUser(authUserDispatch, StackActions, navigation) {
    // here if user already open and run this app and user navigate to the other page then this function will not call this api which prevent unnessecsery api calls
    const {data} = await userInitialRoute();
    if (data?.user) {
      authUserDispatch({
        type: SET_USER_DATA,
        payload: data.user,
      });
      authUserDispatch({type: SET_IS_LOGGED_IN, payload: true});

      if (data?.user?.isAuthenticated === false) {
        return navigation.dispatch(StackActions.replace('Wait'));
        // If user authenticated by the admin then the user redirected to the main Home Page
      } else if (data?.user?.isAuthenticated === true) {
        // If  user not authenticated by the admin then the user redirected to the Wait Page
        return navigation.dispatch(StackActions.replace('Home'));
      }
    } else {
      return navigation.dispatch(StackActions.replace('Login'));
    }
  }
}

export default new InitialCheck();
