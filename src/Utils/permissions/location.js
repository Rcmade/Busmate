import {Alert, BackHandler, PermissionsAndroid, Platform} from 'react-native';

export const FineLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (!granted) {
      const response = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title:
            'Busmates requires location data to track whether you are on the bus',
          message: 'It helps to find your nearest bus location',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (response === PermissionsAndroid.RESULTS.DENIED) {
        Alert.alert(
          'Permission denied',
          'You have not given location permission to find your nearest bus. This will close the app.',
          [{text: 'OK', onPress: () => BackHandler.exitApp()}],
        );
      } else {
        return true;
      }
    }

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      // console.log('You can use the ACCESS_FINE_LOCATION');
      
      return true;
    } else {
      console.log('ACCESS_FINE_LOCATION permission denied');
      return false;
    }
    return true;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

export const CoarseLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    );
    if (!granted) {
      const response = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title:
            'Busmates requires location data to track whether you are on the bus',
          message: 'It helps to find your nearest bus location',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (response === PermissionsAndroid.RESULTS.DENIED) {
        Alert.alert(
          'Permission denied',
          'You have not given precise location permission to track your location. This will close the app.',
          [{text: 'OK', onPress: () => BackHandler.exitApp()}],
        );
      }
    }

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the ACCESS_COARSE_LOCATION');
    } else {
      console.log('ACCESS_COARSE_LOCATION permission denied');
    }
    return true;
  } catch (err) {
    console.warn(err);
  }
};

export const BackgroundLocationPermission = async () => {
  if (Platform.Version >= 26) {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      );
      if (!granted) {
        const response = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
          {
            title:
              'Busmates collects location data  even when the app is closed or not in use',
            message:
              'It helps other people to find their bus in real time from their home',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        console.log(PermissionsAndroid.RESULTS, 'ACCESS_BACKGROUND_LOCATION');
        if (response === PermissionsAndroid.RESULTS.DENIED) {
          Alert.alert(
            'Permission denied',
            'You have not given background location permission to track your bus. This will close the app.',
            [{text: 'OK', onPress: () => BackHandler.exitApp()}],
          );
        } else {
          return true;
        }
      }

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the ACCESS_BACKGROUND_LOCATION');
        return true;
      } else {
        console.log('ACCESS_BACKGROUND_LOCATION permission denied');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else {
    return true;
  }
};
