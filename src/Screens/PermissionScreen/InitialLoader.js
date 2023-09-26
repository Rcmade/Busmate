import React, {useEffect, useState} from 'react';
import {View, Image, StyleSheet, TouchableOpacity, Linking} from 'react-native';
import {Text, useTheme} from 'react-native-paper';

import {StackActions, useNavigation} from '@react-navigation/native';
import {useAuthUser} from '../../Context/AuthUserContext';
import {WEB_CLIENT_ID} from '../../Config/ClientConfig';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useAppFeature} from '../../Context/AppFeatureContext';
import {
  APP_FEATURE_SERVICE,
  SHOW_TOAST,
  TOGGLE_THEME,
} from '../../Constant/AppConstant';

import ThemeSwitch from '../../components/Buttons/ThemeSwitch';
import ScreenWraper from '../../components/Layout/ScreenWraper';
import {
  getStorage,
} from '../../Utils/storage';
import InitialCheckService from '../../Utils/services/InitialCheckService';
const InitialLoader = () => {
  const navigation = useNavigation();
  const [isCheckLogin, setIsCheckLogin] = useState(false);
  const {authUserState, authUserDispatch} = useAuthUser();
  const {appFeatureDispatch} = useAppFeature();
  // Google auth initializer and configration
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
    });
    return () => {};
  }, []);

  // initialize theme
  const setInitalThemeState = async () => {
    const themeMode = await getStorage('theme');
    if (themeMode) {
      appFeatureDispatch({type: TOGGLE_THEME, payload: themeMode});
    }
  };

  // hit the available time api
  const checkAvailableServices = async () => {
    try {
      const data = await InitialCheckService.checkAvailableServices();
      appFeatureDispatch({
        type: APP_FEATURE_SERVICE,
        payload: data,
      });
    } catch (error) {
      console.log(error);
      appFeatureDispatch({
        type: SHOW_TOAST,
        payload: {
          visiblity: true,
          description: error.message,
          title: 'Connection Status',
          status: 'error',
        },
      });
    }
  };

  // Check fine Location permission and navigate to the require page
  const checkPermissions = async isMounted => {
    await InitialCheckService.permission(navigation, StackActions, isMounted);
    // first check all the nessesory permission of app then get the user loging details
    setIsCheckLogin(true);
  };

  // // Check the available services
  useEffect(() => {
    let isMounted = true;
    const callFunctions = async () => {
      // this call the available services and set the data to the localstorage
      await checkAvailableServices();
      // this will set the user previous selected this
      await setInitalThemeState();
      // this will check the permission of the app and navigate to the require page
      await checkPermissions(isMounted);
    };
    isMounted && callFunctions();
    return () => {
      isMounted = false;
    };
  }, []);

  // When user open the app this function will invocke and get the user detail to login if the user already loging
  const checkIsAuthUser = async () => {
    // here if user already open and run this app and user navigate to the other page then this function will not call this api which prevent unnessecsery api calls
    if (!authUserState?.isLoggedIn) {
      await InitialCheckService.checkIsAuthUser(
        authUserDispatch,
        StackActions,
        navigation,
      );
    }
  };

  // calling function of the user loging details
  useEffect(() => {
    let isMounted = true;
    isMounted && isCheckLogin && checkIsAuthUser();
    return () => {
      isMounted = false;
    };
  }, [isCheckLogin]);

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
      {/* {showBtn && (
        <View marginVertical={50} paddingHorizontal={10} style={styles.getWrap}>
          <LgButton
            title="GET STARTED"
            onPress={async () => {
              await FineLocationPermission();
              checkPermissions(true);
            }}
          />
        </View>
      )} */}
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
