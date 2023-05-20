import {PermissionsAndroid, Platform, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import PermissionComp from '../components/Permission';
import {useNavigation, StackActions} from '@react-navigation/native';
import {
  BackgroundLocationPermission,
  FineLocationPermission,
} from '../permissions/location';

const BackgroundLocation = () => {
  const navigation = useNavigation();
  const checkPermission = async () => {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    );
    if (granted) {
      navigation.dispatch(StackActions.replace('Login'));
    }
  };

  if (Platform.Version < 26) {
    navigation.dispatch(StackActions.replace('Login'));
    return null;
  }

  useEffect(() => {
    checkPermission();
    return () => {};
  }, []);

  return (
    <PermissionComp
      title="Enable Background GeoLocation"
      subtitle={
        'Busmates collects location data even when the app is closed or not in use bus.'
      }
      details={
        ' Because app is designed for college students and tracks the location  of a bus while they are onboard. The location information is then shared with other students who need to locate the bus. This feature helps students to plan their schedule s and arrive at their destination on time. The app should inform users about its use of their location data and provide clear privacy policies.'
      }
      onPress={async () => {
        await FineLocationPermission();
        await BackgroundLocationPermission();
        checkPermission();
      }}
      img={require('../assets/BusLocationImg.png')}
    />
  );
};

export default BackgroundLocation;
