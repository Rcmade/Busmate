import {
  StyleSheet,
  View,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Drawer,
  TouchableRipple,
  useTheme,
  Text,
  Switch,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import your icon library
import {useAppFeature} from '../Context/AppFeatureContext';
import ThemeSwitch from './Buttons/ThemeSwitch';
import {SHOW_TOAST, TOGGLE_THEME} from '../Constant/AppConstant';
import {setStorage} from '../Utils/storage';
const SideBar = ({toggleSideBar, logOutHandler, user, navigation}) => {
  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;
  const {colors} = useTheme();

  const {appFeatureState, appFeatureDispatch} = useAppFeature();

  const toggleTheme = async () => {
    // theme;
    const currentTheme = appFeatureState.theme === 'light' ? 'dark' : 'light';
    await setStorage('theme', currentTheme);
    appFeatureDispatch({type: TOGGLE_THEME, payload: currentTheme});
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

  return (
    <View
      style={{
        width: screenWidth,
        height: screenHeight, // Set the drawer's height to the screen's height
        position: 'absolute',
        left: 0,
        top: 0,
        flexDirection: 'row',
      }}>
      <View
        style={{
          width: '60%',
          backgroundColor: colors.darkBlueLightGray,
          paddingVertical: 20,
        }}>
        <Text
          variant="headlineSmall"
          style={{color: colors.pBlackWhite, textAlign: 'center'}}>
          BusMate
        </Text>

        <View marginTop={20}>
          <TouchableRipple
            onPress={() =>
              user?.idCard
                ? navigation.navigate('Profile')
                : navigation.navigate('Login')
            }
            rippleColor="#6B7280"
            style={{padding: 15}}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <Image
                source={require('../assets/profile.png')}
                style={{width: 35, height: 35}}
              />
              <Text
                variant="titleLarge"
                style={{color: colors.pBlackWhite, textAlign: 'center'}}>
                Profile
              </Text>
            </View>
          </TouchableRipple>
          <TouchableRipple
            onPress={toggleTheme}
            rippleColor="#6B7280"
            style={{padding: 15}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Icon
                name={appFeatureState.theme === 'light' ? 'sun-o' : 'moon-o'}
                key={appFeatureState.theme}
                size={35}
                color={colors.pBlackWhite}
              />
              <Text style={{color: colors.pBlackWhite}}>
                {appFeatureState.theme === 'light' ? 'Light Mode' : 'Dark Mode'}
              </Text>
              <Icon
                name={
                  appFeatureState.theme === 'light' ? 'toggle-off' : 'toggle-on'
                }
                size={35}
                color={colors.pblackBlue}
              />
            </View>
          </TouchableRipple>

          <TouchableRipple
            onPress={openURL}
            rippleColor="#6B7280"
            style={{padding: 15}}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <Icon
                name={'question-circle'}
                key={appFeatureState.theme}
                size={35}
                color={colors.pBlackWhite}
              />
              <Text
                variant="titleLarge"
                style={{color: colors.pBlackWhite, textAlign: 'center'}}>
                Help
              </Text>
            </View>
          </TouchableRipple>
          {user?.idCard && (
            <TouchableRipple
              onPress={logOutHandler}
              rippleColor="#6B7280"
              style={{padding: 15}}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <Icon
                  name={'sign-out'}
                  key={appFeatureState.theme}
                  size={35}
                  color={colors.pBlackWhite}
                />
                <Text
                  variant="titleLarge"
                  style={{color: 'red', textAlign: 'center'}}>
                  LogOut
                </Text>
              </View>
            </TouchableRipple>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={{
          width: '40%',
          backgroundColor: 'black',
          opacity: 0.4,
          // height: screenHeight,
        }}
        onPress={toggleSideBar}>
        <View></View>
      </TouchableOpacity>
    </View>
  );
};

export default SideBar;

const styles = StyleSheet.create({});
