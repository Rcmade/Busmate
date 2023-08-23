import {View, StatusBar, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
// import {} from 'react-native-safe-area-context';

import {useNavigation, StackActions} from '@react-navigation/native';
import {useAuthUser} from '../Context/AuthUserContext';
import {logout, updateUser} from '../Server';
import {useAssignContributor} from '../Context/AssignContributorContext';
import {useAppFeature} from '../Context/AppFeatureContext';
import {
  SET_CONTRIBUTOR_STATE,
  SET_IS_LOGGED_IN,
  SET_USER_DATA,
} from '../Constant/UserConstant';
import {Appbar, useTheme} from 'react-native-paper';
import SideBar from './SideBar';
import {useRoute} from '@react-navigation/native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const Header = () => {
  const {authUserState, authUserDispatch} = useAuthUser();
  const navigation = useNavigation();
  const {assignContributorDispatch} = useAssignContributor();
  const [busNumber, setBusNumber] = useState(null);
  const sevenDayToUpdate = 1000 * 60 * 60 * 24 * 7;

  const [showSidebar, setShowSidebar] = useState(false);
  const [position, setPosition] = useState('relative');
  const {appFeatureState} = useAppFeature();
  const route = useRoute();

  useEffect(() => {
    if (route.name === 'Home') {
      setPosition('absolute');
    } else {
      setPosition('relative');
    }
    return () => {};
  }, [route.name]);

  const [isOpen, setIsOpen] = React.useState(false);

  const cancelRef = React.useRef(null);

  const timeSinceLastUpdate =
    Date.now() - new Date(authUserState?.updatedAt).getTime();
  const isUpdate = sevenDayToUpdate > timeSinceLastUpdate;

  const remainDayToUpdate = Math.floor(
    (Date.now() - new Date(authUserState?.updatedAt)) / (1000 * 60 * 60 * 24),
  );

  const totalNumOfBus = 25;
  const arrOfBus = Array.from({length: totalNumOfBus}, (_, i) => i + 1);

  // Logout User
  const logOutHandler = async () => {
    const {data} = await logout();
    await GoogleSignin.signOut();
    authUserDispatch({
      type: SET_USER_DATA,
      payload: {
        isLoggedIn: false,
      },
    });
    authUserDispatch({type: SET_IS_LOGGED_IN, payload: false});
    assignContributorDispatch({
      type: SET_CONTRIBUTOR_STATE,
      payload: {assigned: false, previous: null, wait: null},
    });
    navigation.dispatch(StackActions.replace('Login'));
  };

  const onBusNumberUpdateSubmit = async () => {
    const {data} = await updateUser({
      busNumber: +busNumber,
    });

    authUserDispatch({
      type: SET_USER_DATA,
      payload: data.user,
    });
    return setIsOpen(false);
  };
  const {colors} = useTheme();

  const toggleSideBar = () => {
    setShowSidebar(!showSidebar);
  };
  return (
    <View>
      <StatusBar
        backgroundColor={colors.lightBluePGray}
        barStyle={
          appFeatureState.theme === 'dark' ? 'light-content' : 'dark-content'
        }
      />
      <Appbar.Header
        // elevation={2}
        style={{
          backgroundColor:
            position === 'absolute'
              ? colors.lightBlackWhite
              : colors.lightBluePGray,
          position: position,
          width: '100%',
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Image
            source={require('../assets/logoTransparent.png')}
            style={{width: 45, height: 45}}
          />
          <Appbar.Action
            icon="menu"
            onPress={toggleSideBar}
            color={colors.pBlackWhite}
          />
        </View>
      </Appbar.Header>

      {showSidebar && (
        <SideBar
          logOutHandler={logOutHandler}
          user={authUserState?.user}
          toggleSideBar={toggleSideBar}
          navigation={navigation}
        />
      )}
      {/* <SideBar toggleSideBar={toggleSideBar} /> */}
    </View>
  );
};

export default Header;
