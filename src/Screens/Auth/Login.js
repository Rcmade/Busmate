import React, {useEffect, useState} from 'react';
import {StackActions, useNavigation} from '@react-navigation/native';
import {TouchableOpacity, ScrollView, View, StyleSheet} from 'react-native';
import {loginRoute} from '../../Server';
import {useAuthUser} from '../../Context/AuthUserContext';
// import {isLoggedIn, userData} from '../../Store/Reducers/authUser';
// import {useDispatch, useSelector} from 'react-redux';
// import TermsAndCondition from './TermsAndCondition';
import {SET_IS_LOGGED_IN, SET_USER_DATA} from '../../Constant/UserConstant';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import GoogleButton from '../../components/GoogleButton';
import ScreenWraper from '../../components/Layout/ScreenWraper';
import {useTheme, Text, Button} from 'react-native-paper';

import {useAppFeature} from '../../Context/AppFeatureContext';
import {SHOW_TOAST} from '../../Constant/AppConstant';

const Login = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const {authUserState, authUserDispatch} = useAuthUser();

  const {appFeatureDispatch} = useAppFeature();

  useEffect(() => {
    if (authUserState?.user?.isAuthenticated === false) {
      navigation.dispatch(StackActions.replace('Wait'));
    } else if (authUserState?.user?.isAuthenticated === true) {
      navigation.dispatch(StackActions.replace('Home'));
    }
    return () => {};
  }, [authUserState]);

  //  Get Email Address , User Name , User Image from user
  const googleSignSubmit = async () => {
    setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo) {
        const {data} = await loginRoute({
          email: userInfo.user.email,
          idToken: userInfo.idToken,
        });
        if (data?.user) {
          authUserDispatch({type: SET_IS_LOGGED_IN, payload: true});
          authUserDispatch({type: SET_USER_DATA, payload: data.user});

          if (data?.user?.isAuthenticated === false) {
            navigation.dispatch(StackActions.replace('Wait'));
          } else if (data?.user?.isAuthenticated === true) {
            navigation.dispatch(StackActions.replace('Home'));
          }
        } else if (data?.error) {
          // console.log({data});

          appFeatureDispatch({
            type: SHOW_TOAST,
            payload: {
              visiblity: true,
              description: data?.error,
              title: 'Error',
              status: 'error',
            },
          });
        }
      }
    } catch (error) {
      console.log('Error:', error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // console.log('Operation is in progress already');

        appFeatureDispatch({
          type: SHOW_TOAST,
          payload: {
            visiblity: true,
            description: 'Operation is in progress already',
            title: 'Google Authenticator',
            status: 'error',
          },
        });
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        appFeatureDispatch({
          type: SHOW_TOAST,
          payload: {
            visiblity: true,
            description:
              'Yout play services not available or outdated, try to update your play services',
            title: 'Google Play Services',
            status: 'error',
          },
        });

        // console.log('Play services not available or outdated');
      } else {
        // console.log('Some other error happened');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const {colors} = useTheme();

  return (
    <ScreenWraper>
      <ScrollView height="100%">
        <View style={styles.container}></View>
        <View>
          <Text
            variant="displaySmall"
            style={{
              color: colors.darkBlueGray,
              fontWeight: 'bold',
              textAlign: 'center',
              marginVertical: 40,
            }}>
            Login
          </Text>

          <View paddingHorizontal={20}>
            <GoogleButton
              isLoading={isLoading}
              onPress={googleSignSubmit}
              isLoadingText="Please wait..."
              title="Login With Google"
              imgUrl={require('../../assets/google.png')}
            />
          </View>
          <View
            alignItems={'center'}
            justifyContent="center"
            marginTop={10}
            gap={8}
            flexDirection="row">
            <Text style={{color: colors.pBlackWhite}}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text
                variant="bodyLarge"
                style={{color: colors.pWhiteBlue, fontWeight: 'bold'}}>
                SignUp
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenWraper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  snackbar: {
    top: 50, // Move the snackbar to the top
  },
});

export default Login;
