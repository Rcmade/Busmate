import {PermissionsAndroid} from 'react-native';
import {getAvailableTime, userInitialRoute} from '../../Server';
import {getExpiresStorage, setExpiresStorage} from '../storage';
import {APP_FEATURE_SERVICE} from '../../Constant/AppConstant';
import {SET_IS_LOGGED_IN, SET_USER_DATA} from '../../Constant/UserConstant';

class InitialCheck {
  //  this will get the last available time from the localstorage and this function will call only when available time api fails
  async setInitalState() {
    const getAvailableService = await getExpiresStorage('isServiceAvailable');
    console.log('setInitalState');
    return {
      destinationLatitude: getAvailableService?.destinationLatitude || 22.80007,
      destinationLongitude:
        getAvailableService?.destinationLongitude || 75.826985,
      startTime:
        getAvailableService?.startTime || new Date().setHours(7, 0, 0, 0),
      endTime: getAvailableService?.endTime || new Date().setHours(9, 3, 0, 0),
      temprary: getAvailableService?.temprary || false,
      manualSigin: getAvailableService?.manualSigin || false,
    };
  }

  // this function will check FineLocation and BackgroundLocation permission and navigate to the require page if permission not given
  async permission(navigation, StackActions, isMounted) {
    const fineLocationGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    // check fine location permission and navigate to Finelocation page
    if (!fineLocationGranted && isMounted) {
      navigation.dispatch(StackActions.replace('FineLocation'));
      return;
    }
    const backgroundLocationGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    );
    // check Background location permission and navigate to Background locationpage
    // Check fine Background permission
    if (!backgroundLocationGranted && isMounted) {
      navigation.dispatch(StackActions.replace('BackgroundLocation'));
      return;
    }

    return;
  }

  // Check starting time and closing time of the app by getting the data from the server
  async checkAvailableServices() {
    let {data} = await getAvailableTime();
    if (data?.startTime) {
      // if api give the data then only set to the localstorage for 2 hours
      await setExpiresStorage('isServiceAvailable', data, 1000 * 60 * 60 * 2);
      return data;
    } else {
      // if api falis the get the previous data from the localstorage but this works only if last api calls in last 2 hours
      data = await this.setInitalState();
      return data;
    }
  }

  async checkIsAuthUser(authUserDispatch, StackActions, navigation) {
    // here if user already open and run this app and user navigate to the other page then this function will not call this api which prevent unnessecsery api calls while navigate to the other page
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
