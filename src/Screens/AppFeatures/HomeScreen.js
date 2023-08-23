import {AppState, Platform} from 'react-native';
import React, {useEffect, useState, useRef, useCallback} from 'react';
// import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {
  BackgroundLocationPermission,
  CoarseLocationPermission,
  FineLocationPermission,
} from '../../Utils/permissions/location';
import MapComponents from '../../components/MapComponents';
import {SHOW_TOAST, TASK_ID} from '../../Constant/AppConstant';
import {
  getExpiresStorage,
  getStorage,
  setExpiresStorage,
  setStorage,
} from '../../Utils/storage';
import NetworkService from '../../Utils/services/netService';
import {changeContributor, getNewLocationRoute} from '../../Server';

import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import LocationService from '../../Utils/services/locationService';
import Geolocation from 'react-native-geolocation-service';
import {useAuthUser} from '../../Context/AuthUserContext';
import {LocationConfig} from '../../Config/LocationConfig';
import {useAppFeature} from '../../Context/AppFeatureContext';

const HomeScreen = () => {
  const mapRef = useRef(null);
  const [location, setLocation] = useState([]);
  const {authUserState} = useAuthUser();
  const [appState, setAppState] = useState(AppState.currentState);
  const {appFeatureDispatch, appFeatureState} = useAppFeature();

  const startTime = new Date(appFeatureState?.isServiceAvailable?.startTime);
  const endTime = new Date(appFeatureState?.isServiceAvailable?.endTime);

  const startHourMinute = +`${startTime.getHours()}.${startTime.getMinutes()}`;
  const endHourMinute = +`${endTime.getHours()}.${endTime.getMinutes()}`;

  const isRun = +`${new Date().getHours()}.${new Date().getMinutes()}`;
  const isRunNow = isRun <= endHourMinute && isRun >= startHourMinute;

  console.log({
    startTime,
    endTime,
    startHourMinute,
    endHourMinute,
    isRun,
    isRunNow,
  });
  // Ask the user to give permission
  useEffect(() => {
    let cleanFunction = true;
    const permissions = async () => {
      if (!(await FineLocationPermission())) {
        return;
      }
      if (!(await CoarseLocationPermission())) {
        return;
      }
      if (Platform.Version < 26) {
        return;
      }
      await BackgroundLocationPermission();
    };
    cleanFunction && permissions();

    return () => (cleanFunction = false);
  }, []);

  // set the location coordinate when is comes from the server
  useEffect(() => {
    let cleanFunction = true;
    // this is run when user close the app then all location state becomes empty on that time it will load previous location data from local  storage
    const addOldLocation = async () => {
      const getOldLocation = await getExpiresStorage('location');
      if (
        getOldLocation &&
        Array.isArray(getOldLocation) &&
        getOldLocation?.length > 2
      ) {
        setLocation(getOldLocation || []);
      }
    };

    cleanFunction && addOldLocation();

    return () => (cleanFunction = false);
  }, []);

  // Create Polyline for all User
  const getLocation = useCallback(async () => {
    try {
      const now = new Date();
      if (authUserState?.user?.busNumber) {
        // get last date , when user location data form the server at that time we store the last time so that we get that location which is not take by user , if user take all location before 9 am the we transfer only after 9 am location of bus
        const getDate = await getStorage('date');
        const {data} = await getNewLocationRoute({
          date: getDate || new Date(),
          busNumber: authUserState?.user?.busNumber,
        });
        await setStorage('date', new Date(now.getTime() - 3000));
        if (data?.length) {
          await setExpiresStorage('location', location, 1000 * 60 * 60);
          setLocation(pre => [...pre, ...data]);
        }
      }
    } catch (error) {}
  }, [authUserState]);

  // This is the calling function of getLocation to create polylines
  useEffect(() => {
    let interval;
    // this function is called when the user open the app again
    const handleAppStateChange = nextAppState => {
      setAppState(nextAppState);
      if (nextAppState === 'active') {
        // this will call every 4 second
        interval = setInterval(() => {
          if (isRunNow) {
            getLocation();
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
        if (isRunNow) {
          getLocation();
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
      ReactNativeForegroundService.start({
        id: TASK_ID,
        title: 'Busmate',
        message: 'We will notify when your bus available',
        icon: 'ic_launcher',
      });
      if (isRunNow) {
      } else {
        await ReactNativeForegroundService.stopAll();

        appFeatureDispatch({
          type: SHOW_TOAST,
          payload: {
            visiblity: true,
            description: 'No buses running at the moment',
            title: 'Notification',
            status: 'error',
          },
        });
      }
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
        const intervalId = setInterval(async () => {
          LocationService.ping = (await NetworkService.getPing()).duration;
        }, 5000);
        try {
          watchId = Geolocation.watchPosition(
            async position => {
              if (!isRunNow) {
                await ReactNativeForegroundService.stopAll();
                clearInterval(intervalId);
              }
              // filter required data from position
              const locationData = {
                latitude1: position.coords.latitude,
                longitude1: position.coords.longitude,
                heading: position.coords.heading,
                speed: position.coords.speed * 3.6,
              };

              // console.log(locationData);

              const {location} = await LocationService.changeLocation(
                locationData,
              );

              // console.log(
              //   `Speed: ${location?.speed} , ${location?.speed > 20}`,
              //   {
              //     location,
              //   },
              // );

              // if speed greater than 17 then it calls
              const assignedUser =
                await LocationService.assignLocationContributor(
                  authUserState?.user,
                );

              // it calls only , if server says there is no contributor in database or if contributor present in database the if this contributor present in previous five user  database
              if (
                (assignedUser && assignedUser?.previous === false) ||
                (assignedUser && assignedUser?.wait === true)
              ) {
                const addNewLocation = await LocationService.addNewLocation({
                  ...location,
                  _id: authUserState.user._id,
                  busNumber: authUserState.user.busNumber,
                });

                clearInterval(intervalId);

                // if user not present in the previous database all the forground services will be remove like background and forground services
                if (
                  addNewLocation.previous === true &&
                  addNewLocation.wait === false &&
                  addNewLocation?.youAreDone == true
                ) {
                  await ReactNativeForegroundService.stopAll();
                }
              }

              // speed 0 because if location not changes the speed will not change then assinge function runs multiple times
              LocationService.location.speed = 0;
            },

            error => {
              if (error.code === 2) {
                console.log('Error: ', error);
                const removeUser = async () => {
                  await changeContributor({
                    _id: authUserState?.user?._id,
                    busNumber: authUserState?.user?.busNumber,
                  });
                };
                removeUser();
              }
            },
            LocationConfig,
          );
        } catch (error) {
          console.log(error);
        }
      },
      {
        onLoop: false,
        taskId: TASK_ID,
        onError: e => console.log(`Error logging:`, e),
      },
    );

    // return () => Geolocation.clearWatch(watchId);
  }, []);

  return (
    <>
      <MapComponents
        mapRef={mapRef}
        user={authUserState?.user}
        trackingLineCoordinates={location}
      />
    </>
  );
};

export default HomeScreen;
