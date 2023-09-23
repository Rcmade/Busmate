import {PermissionsAndroid, Platform, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import PermissionComp from '../../components/Permission';
import {useNavigation, StackActions} from '@react-navigation/native';
import {
  BackgroundLocationPermission,
  FineLocationPermission,
} from '../../Utils/permissions/location';
import {useAuthUser} from '../../Context/AuthUserContext';
import ScreenWraper from '../../components/Layout/ScreenWraper';
import InitialCheckService from '../../Utils/services/InitialCheckService';

const BackgroundLocation = () => {
  const navigation = useNavigation();
  const {authUserState, authUserDispatch} = useAuthUser();

  const checkUser = async () => {
    await InitialCheckService.checkIsAuthUser(
      authUserDispatch,
      StackActions,
      navigation,
    );
  };

  const checkPermission = async () => {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    );
    if (granted) {
      checkUser();
    }
  };

  useEffect(() => {
    checkPermission();
    return () => {};
  }, []);

  return (
    <ScreenWraper>
      <PermissionComp
        title="Enable Background GeoLocation"
        instruction="Press Allow All Time Then Go Back"
        subtitle={
          'Busmates collects location data only when your buses are in operation and the app is active. Rest assured that no data is collected when the app is closed or when your buses are not running.'
        }
        details={
          ' Because app is designed for college students and tracks the location  of a bus while they are onboard. The location information is then shared with other students who need to locate the bus. This feature helps students to plan their schedule s and arrive at their destination on time. The app should inform users about its use of their location data and provide clear privacy policies.'
        }
        onPress={async () => {
          await FineLocationPermission();
          await BackgroundLocationPermission();
          checkPermission();
        }}
        img={require('../../assets/locationAndBusIcon.png')}
      />
    </ScreenWraper>
  );
};

export default BackgroundLocation;
