import React, {useEffect} from 'react';
// import {useSelector} from 'react-redux';
import {StackActions, useNavigation} from '@react-navigation/native';
import {View, Image, Dimensions} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import ScreenWraper from '../../components/Layout/ScreenWraper';
import {useAuthUser} from '../../Context/AuthUserContext';

const Wait = () => {
  const {authUserState} = useAuthUser();
  const navigation = useNavigation();

  useEffect(() => {
    if (authUserState?.user) {
      if (authUserState?.user?.isAuthenticated === true) {
        navigation.dispatch(StackActions.replace('Home'));
      }
    }
    return () => {};
  }, [authUserState]);

  const {colors} = useTheme();

  return (
    <>
      <ScreenWraper>
        <View
          // justifyContent="center"
          flex={1}
          // marginVertical={50}
          width={Dimensions.get('window').width}
          alignItems="center">
          <Image
            style={{
              maxWidth: '100%',
              maxHeight: '50%',
            }}
            resizeMode="contain"
            source={require('../../assets/wait.png')}
            alt="Show"
          />
          <Text
            variant="headlineSmall"
            style={{
              color: colors.pBlackWhite,
            }}>
            Please Wait Some time we are verifying your request.
          </Text>
        </View>
      </ScreenWraper>
    </>
  );
};

export default Wait;
