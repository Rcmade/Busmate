import {AppState} from 'react-native';
import React, {useEffect, useState, useRef, useCallback} from 'react';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {
  BackgroundLocationPermission,
  CoarseLocationPermission,
  FineLocationPermission,
} from '../permissions/location';
import MapComponents from '../components/MapComponents';
import {TASK_ID} from '../..';
import {getPing, getStorage, setStorage} from '../utils/functions';
import {contributorState} from '../Store/Reducers/locationReducer';
import {useDispatch, useSelector} from 'react-redux';
import {getNewLocationRoute} from '../server';
import {useToast} from 'native-base';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import LocationService from '../services/locationService';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const mapRef = useRef(null);
  const [location, setLocation] = useState([]);
  const getUserData = useSelector(state => state.authUser);

  const [appState, setAppState] = useState(AppState.currentState);
  const toast = useToast();
  const isRun = +`${new Date().getHours()}.${new Date().getMinutes()}`;

  // Ask the user to give permission
  useEffect(() => {
    let cleanFunction = true;
    const permissions = async () => {
      if (await FineLocationPermission()) {
        if (await CoarseLocationPermission()) {
          await BackgroundLocationPermission();
        }
      }
    };
    cleanFunction && permissions();
    return () => (cleanFunction = false);
  }, []);

  // Create Polyline for all User
  const getLocation = useCallback(async () => {
    //
    const now = new Date();
    if (getUserData?.user?.busNumber) {
      const getDate = await getStorage('date');
      const {data} = await getNewLocationRoute({
        date: getDate || new Date(),
        busNumber: getUserData?.user?.busNumber,
      });
      await setStorage('date', new Date(now.getTime() - 3000));

      if (data?.length) {
        setLocation(pre => [...pre, ...data]);
      }
    }
  }, [getUserData]);

  // This is the calling function of getLocation to create polylines
  useEffect(() => {
    let interval;
    // this function is called when the user open the app again
    const handleAppStateChange = nextAppState => {
      setAppState(nextAppState);
      if (nextAppState === 'active') {
        // this will call every 4 second
        interval = setInterval(() => {
          getLocation();
          if (isRun < 9.2 && isRun > 5.9) {
          }
        }, 4000);
      } else {
        // if the user closed the app this function will removed from the memory
        clearInterval(interval);
      }
    };

    // this function is called of handleAppStateChange
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    // this is because the user open the app first time then only this function will invocke
    if (appState === 'active') {
      interval = setInterval(() => {
        getLocation();
        if (isRun < 9.2 && isRun > 5.9) {
        }
      }, 4000);
    }

    return () => {
      // Clean up functions
      subscription.remove();
      clearInterval(interval);
    };

    // this the depencies of the function when we want to call this useeffects function
  }, [appState]);

  // start forground services so that the app work even in the background or forground services
  useEffect(() => {
    let clearFuntion = true;
    const startForeGround = async () => {
      // if (isRun < 9.2 && isRun > 5.9) {
      ReactNativeForegroundService.start({
        id: TASK_ID,
        title: 'BusMets',
        message: 'We will notify when your bus available',
        icon: 'ic_launcher',
      });
      // } else {
      //   await ReactNativeForegroundService.stopAll();
      //   toast.show({
      //     description: 'No buses running at the moment',
      //     placement: 'top',
      //   });
      // }
    };

    clearFuntion && startForeGround();
    return () => {
      clearFuntion = false;
    };
  }, []);

  // add_task forground services so that the app work even in the background or forground services
  useEffect(() => {
    ReactNativeForegroundService.add_task(
      async () => {
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
          interval: 4000,
          fastInterval: 2000,
        });

        try {
          // it geolocaiton.watchlocation which calls when the minmimum distance 30 meters and and every 4 second
          const {location} = await LocationService.watchLocation();
          console.log(`Speed: ${location?.speed} , ${location?.speed > 20}`, {
            location,
          });
          // if speed greater than 17 then it calls
          const assignedUser = await LocationService.assignLocationContributor(
            getUserData?.user,
          );
          // it is just for safety purposes because when use open the app all the states are null or in its intial state
          if (assignedUser) {
            dispatch(
              contributorState({
                previous: assignedUser.previous,
                assigned: assignedUser.assigned,
              }),
            );
          }
          // it calls only , if server says there is no contributor in database or if contributor present in database the if this contributor present in previous five user  database
          if (
            (assignedUser && assignedUser?.previous === false) ||
            (assignedUser && assignedUser?.wait === true)
          ) {
            const addNewLocation = await LocationService.addNewLocation({
              ...location,
              ms: (await getPing()).duration,
              _id: getUserData.user._id,
              busNumber: getUserData.user.busNumber,
            });

            // console.log(
            //   addNewLocation.previous === true &&
            //     addNewLocation.wait === false &&
            //     addNewLocation?.youAreDone == true,
            //   {addNewLocation},
            // );

            // if user not present in the previous database all the forground services will be remove like background and forground services
            if (
              addNewLocation.previous === true &&
              addNewLocation.wait === false &&
              addNewLocation?.youAreDone == true
            ) {
              await ReactNativeForegroundService.stopAll();
            }
          }
          // speed 0 because if location not changes the speed will not change then assinge function all multiple times
          LocationService.location.speed = 0;
        } catch (error) {
          console.log(error);
          // dispatch(contributorState(false));
        }
      },
      {
        onLoop: true,
        taskId: TASK_ID,
        onError: e => console.log(`Error logging:`, e),
      },
    );

    return () => null;
  }, []);

  // This function will call getRealTimeLocation every three seconds even when app in the background
  // const intervalForLocation = async () => {
  //   //  an infinite loop task

  //   // if (isRun < 9.2 && isRun > 5.9) {
  //   while (BackgroundService.isRunning()) {
  //     await getRealTimeLocation();
  //     await new Promise(resolve => setTimeout(resolve, 4000));
  //   }
  //   // } else {
  //   //   toast.show({
  //   //     description: 'No buses running at the moment',
  //   //     placement: 'top',
  //   //   });
  //   //   await BackgroundService.stop();
  //   //   AppRegistry.cancelHeadlessTask(TASK_NAME, TASK_NAME);
  //   // }
  // };

  // useEffect(() => {
  //   let clearFuntion = true;
  //   const startTracking = async () => {
  //     await BackgroundService.start(
  //       intervalForLocation,
  //       backgroundNotification,
  //     );
  //     // await BackgroundService.stop();
  //   };

  //   clearFuntion && startTracking();
  //   return () => (clearFuntion = false);
  // }, []);

  return (
    <>
      <MapComponents mapRef={mapRef} trackingLineCoordinates={location} />
    </>
  );
};

export default HomeScreen;
