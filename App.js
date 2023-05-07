import React, {useEffect} from 'react';
import HomeScreen from './src/screens/HomeScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useNavigation, StackActions} from '@react-navigation/native';
import Signup from './src/screens/Signup';
import Login from './src/screens/Login';
import Wait from './src/screens/Wait';
import {userInitialRoute} from './src/server';
import {useDispatch, useSelector} from 'react-redux';
import {isLoggedIn, userData} from './src/Store/Reducers/authUser';
import Header from './src/components/Header';
import ForgetPassword from './src/screens/ForgetPassword';
import FineLocation from './src/screens/FineLocation';
import BackgroundLocation from './src/screens/BackgroundLocation';
import {LogBox} from 'react-native';

const App = () => {
  LogBox.ignoreLogs([
    'We can not support a function callback. See Github Issues for details https://github.com/adobe/react-spectrum/issues/2320',
  ]);
  LogBox.ignoreLogs([
    'Warning: Failed prop type: Invalid props.style key `color` supplied to `Image`.',
  ]);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isUserLoggedIn = useSelector(state => state.authUser);

  // When user open the app this function will invocke and get the user detail to login if the user already loging
  useEffect(() => {
    const getInitial = async () => {
      // here if user already open and run this app and user navigate to the other page then this function will not call this api which prevent unnessecsery api calls
      const {data} = !isUserLoggedIn?.isLoggedIn && (await userInitialRoute());
      // console.log({data});
      dispatch(userData(data));
      if (data?.user) {
        dispatch(isLoggedIn(true));
        console.log(data);
        // If user not authenticated by the admin then the user redirected to the Wait Page
        if (data?.user?.isAuthenticated === false) {
          navigation.dispatch(StackActions.replace('Wait'));
          // If user authenticated by the admin then the user redirected to the main Home Page
        } else if (data?.user?.isAuthenticated === true) {
          navigation.dispatch(StackActions.replace('Home'));
        }
      }
    };

    getInitial();
    return () => {};
  }, []);

  const Stack = createNativeStackNavigator();

  return (
    <>
      <Header />
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={'FineLocation'}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="FineLocation" component={FineLocation} />
        <Stack.Screen
          name="BackgroundLocation"
          component={BackgroundLocation}
        />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Wait" component={Wait} />
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      </Stack.Navigator>
    </>
  );
};

export default App;
