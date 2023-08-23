import {PermissionsAndroid} from 'react-native';
import React, {useEffect} from 'react';
import PermissionComp from '../../components/Permission';
import {useNavigation, StackActions} from '@react-navigation/native';
import {FineLocationPermission} from '../../Utils/permissions/location';
import ScreenWraper from '../../components/Layout/ScreenWraper';
const FineLocation = () => {
  const navigation = useNavigation();
  const checkPermission = async () => {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (granted) {
      navigation.dispatch(StackActions.replace('BackgroundLocation'));
    }
  };

  useEffect(() => {
    checkPermission();
    return () => {};
  }, []);

  return (
    <ScreenWraper>
      <PermissionComp
        title="Enable GeoLocation"
        subtitle={
          'Busmates requires location data to track whether you are on the bus'
        }
        details={'It helps to find your nearest bus location'}
        onPress={async () => {
          await FineLocationPermission();
          checkPermission();
        }}
        img={require('../../assets/HumenLocationIMg.png')}
      />
    </ScreenWraper>
  );
};

export default FineLocation;
