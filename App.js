import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import InitialLoader from './src/Screens/PermissionScreen/InitialLoader';
// import FineLocation from './src/Screens/PermissionScreen/FineLocation';
// import Login from './src/Screens/Auth/Login';
// import Wait from './src/Screens/Auth/Wait';
// import ForgetPassword from './src/Screens/Auth/ForgetPassword';
// import BackgroundLocation from './src/Screens/PermissionScreen/BackgroundLocation';
// import HomeScreen from './src/Screens/AppFeatures/HomeScreen';
// import Header from './src/components/Header';
import {register} from 'react-native-bundle-splitter';
import {Portal, Snackbar, useTheme} from 'react-native-paper';
import {useAppFeature} from './src/Context/AppFeatureContext';
import {SHOW_TOAST} from './src/Constant/AppConstant';

const Toast1 = register({
  loader: () => import('./src/components/Toast/Toast1'),
});

const InitialLoader = register({
  loader: () => import('./src/Screens/PermissionScreen/InitialLoader'),
});
const Header = register({loader: () => import('./src/components/Header')});

const Login = register({
  loader: () => import('./src/Screens/Auth/Login'),
});

const Profile = register({
  loader: () => import('./src/Screens/Auth/Profile'),
});

const Signup = register({
  loader: () => import('./src/Screens/Auth/Signup'),
});

const Wait = register({
  loader: () => import('./src/Screens/Auth/Wait'),
});

const BackgroundLocation = register({
  loader: () => import('./src/Screens/PermissionScreen/BackgroundLocation'),
});

const HomeScreen = register({
  loader: () => import('./src/Screens/AppFeatures/HomeScreen'),
});

const FineLocation = register({
  loader: () => import('./src/Screens/PermissionScreen/FineLocation'),
});

const App = () => {
  const Stack = createNativeStackNavigator();
  const {
    appFeatureState: {toast},
    appFeatureDispatch,
  } = useAppFeature();
  const {colors} = useTheme();
  return (
    <>
      <Portal
        style={{
          zIndex: 2,
          position: 'relative',
        }}>
        <Snackbar
          visible={toast.visiblity}
          onDismiss={() =>
            appFeatureDispatch({
              type: SHOW_TOAST,
              payload: {
                visiblity: false,
                title: '',
                description: '',
              },
            })
          }
          duration={toast?.duration || 7000}
          style={{
            backgroundColor: colors.toastBlue,
            position: 'relative',
            zIndex: 1000,
          }}>
          <Toast1
            title={toast?.title}
            description={toast?.description}
            variant={toast?.variant}
            status={toast?.status}
            onDismiss={() =>
              appFeatureDispatch({
                type: SHOW_TOAST,
                payload: {
                  visiblity: false,
                  title: '',
                  description: '',
                },
              })
            }
          />
        </Snackbar>
      </Portal>
      <Stack.Navigator
        screenOptions={{
          header: props => <Header {...props} />,
        }}
        initialRouteName={'Initial'}>
        <Stack.Screen
          name="Initial"
          options={{
            headerShown: false,
          }}
          component={InitialLoader}
        />
        {/* Location Permission Screen */}
        <Stack.Screen name="FineLocation" component={FineLocation} />

        {/*  User Authentication screen */}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Wait" component={Wait} />
        <Stack.Screen
          name="BackgroundLocation"
          component={BackgroundLocation}
        />

        {/* User Screen */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </>
  );
};

export default App;
