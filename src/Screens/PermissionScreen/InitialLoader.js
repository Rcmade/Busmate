import React, {useEffect, useState} from 'react';
import {View, Image, StyleSheet, TouchableOpacity, Linking} from 'react-native';
import {Text, useTheme} from 'react-native-paper';

import {StackActions, useNavigation} from '@react-navigation/native';
import {PermissionsAndroid} from 'react-native';
import {useAuthUser} from '../../Context/AuthUserContext';
import {SET_IS_LOGGED_IN, SET_USER_DATA} from '../../Constant/UserConstant';
import {getAvailableTime, userInitialRoute} from '../../Server';
import {WEB_CLIENT_ID} from '../../Config/ClientConfig';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {useAppFeature} from '../../Context/AppFeatureContext';
import {APP_FEATURE_SERVICE, SHOW_TOAST, TOGGLE_THEME} from '../../Constant/AppConstant';

import ThemeSwitch from '../../components/Buttons/ThemeSwitch';
import {getThemedColor} from '../../Utils/ThemeUtils';
import {FineLocationPermission} from '../../Utils/permissions/location';
import ScreenWraper from '../../components/Layout/ScreenWraper';
import LgButton from '../../components/Buttons/LgButton';
import {
  setExpiresStorage,
  getExpiresStorage,
  getStorage,
} from '../../Utils/storage';
const InitialLoader = () => {
  const navigation = useNavigation();
  const [isCheckLogin, setIsCheckLogin] = useState(false);
  const {authUserState, authUserDispatch} = useAuthUser();
  const {appFeatureState, appFeatureDispatch} = useAppFeature();

  const [showBtn, setShowBtn] = useState(false);
  // Google auth initializer and configration
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
    });
    return () => {};
  }, []);

  useEffect(() => {
    const setInitalState = async () => {
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
      const themeMode = await getStorage('theme');
      if (themeMode) {
        appFeatureDispatch({type: TOGGLE_THEME, payload: themeMode});
      }
    };

    setInitalState();

    return () => {};
  }, []);

  // Check all the necessary permissions for the app
  useEffect(() => {
    let isMounted = true;
    // Check fine Location permission
    const checkPermissions = async () => {
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

      setIsCheckLogin(true);
    };

    checkPermissions();

    return () => {
      isMounted = false;
    };
  }, [navigation]);

  // // Check the available services
  useEffect(() => {
    let isMounted = true;
    const checkAvailableServices = async () => {
      const {data} = await getAvailableTime();
      if (data?.startTime) {
        await setExpiresStorage('availableTime', data, 1000 * 60 * 60 * 2);
        appFeatureDispatch({
          type: APP_FEATURE_SERVICE,
          payload: data,
        });
      }
    };

    isMounted && checkAvailableServices();

    return () => {
      isMounted = false;
    };
  }, []);

  // When user open the app this function will invocke and get the user detail to login if the user already loging
  useEffect(() => {
    let isMounted = true;
    const checkIsAuthUser = async () => {
      if (isCheckLogin) {
        // here if user already open and run this app and user navigate to the other page then this function will not call this api which prevent unnessecsery api calls
        const {data} = !authUserState?.isLoggedIn && (await userInitialRoute());
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
    };

    isMounted && checkIsAuthUser();

    return () => {
      isMounted = false;
    };
  }, [isCheckLogin]);

  const checkPermission = async () => {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (granted) {
      navigation.dispatch(StackActions.replace('BackgroundLocation'));
    }
  };

  const openURL = () => {
    const url = 'https://webbusmate.vercel.app/contact'; // Replace with the desired URL
    Linking.openURL(url).catch(err =>
      appFeatureDispatch({
        type: SHOW_TOAST,
        payload: {
          visiblity: true,
          description: JSON.stringify(err),
          title: 'Error',
          status: 'error',
        },
      }),
    );
  };

  const {colors} = useTheme();
  return (
    <ScreenWraper>
      <View style={styles.headWrap}>
        <TouchableOpacity onPress={openURL} style={styles.helpWrap}>
          <View
            style={[styles.circle]}
            shadowColor={colors.pBlackWhite}
            backgroundColor={colors.pGrayWhite}
            elevation={5}>
            <Text
              style={[
                styles.textCircle,
                {
                  color: colors.pBlackWhite,
                },
              ]}>
              ?
            </Text>
          </View>
          <Text
            variant="labelLarge"
            style={[styles.helpText, {color: colors.pBlackWhite}]}>
            Help
          </Text>
        </TouchableOpacity>
        <ThemeSwitch />
      </View>
      <View
        marginVertical={50}
        fontWeight="bold"
        flexDirection="row"
        justifyContent="center">
        <Text
          style={[
            styles.bustext,
            {
              color: colors.sGrayYellow,
            },
          ]}
          variant="displayLarge">
          Bus
        </Text>
        <Text
          style={[
            styles.matetext,
            {
              color: colors.pWhiteBlue,
            },
          ]}
          variant="displayLarge">
          Mate
        </Text>
      </View>
      <View justifyContent="center" marginVertical={50} alignItems="center">
        <Image
          style={styles.image}
          source={require('../../assets/logoTransparent.png')}
          alt="Show"
        />
      </View>
      {showBtn && (
        <View marginVertical={50} paddingHorizontal={10} style={styles.getWrap}>
          <LgButton
            title="GET STARTED"
            onPress={async () => {
              await FineLocationPermission();
              checkPermission();
            }}
          />
        </View>
      )}
    </ScreenWraper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headWrap: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },

  helpWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  circle: {
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  textCircle: {
    fontSize: 30,
    fontWeight: 'bold',
  },

  helpText: {},

  bustext: {
    fontWeight: 'bold',
  },
  matetext: {
    fontWeight: 'bold',
  },

  image: {
    width: 180,
    height: 180,
  },

  getStart: {
    color: 'black',
    paddingVertical: 4,
  },
});

export default InitialLoader;
