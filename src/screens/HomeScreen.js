import {AppState, Platform} from 'react-native';
import React, {useEffect, useState, useRef, useCallback} from 'react';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {
  BackgroundLocationPermission,
  CoarseLocationPermission,
  FineLocationPermission,
} from '../permissions/location';
import MapComponents from '../components/MapComponents';
import {TASK_ID} from '../..';
import {
  getExpiresStorage,
  getPing,
  getStorage,
  setExpiresStorage,
  setStorage,
} from '../utils/functions';
import {contributorState} from '../Store/Reducers/locationReducer';
import {useDispatch, useSelector} from 'react-redux';
import {changeContributor, getNewLocationRoute} from '../server';
import {useToast} from 'native-base';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import LocationService from '../services/locationService';
import Geolocation from 'react-native-geolocation-service';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const mapRef = useRef(null);
  const [location, setLocation] = useState([]);
  const getUserData = useSelector(state => state.authUser);

  const [appState, setAppState] = useState(AppState.currentState);
  const toast = useToast();
  const isRun = +`${new Date().getHours()}.${new Date().getMinutes()}`;
  const isRunNow = isRun < 9.2 && isRun > 5.9;
  // Ask the user to give permission
  useEffect(() => {
    let cleanFunction = true;
    const permissions = async () => {
      if (await FineLocationPermission()) {
        if (await CoarseLocationPermission()) {
          if (Platform.Version >= 26) {
            await BackgroundLocationPermission();
          }
        }
      }
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
    return () => {};
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
        await setExpiresStorage('location', location, 1000 * 60 * 60);
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
        toast.show({
          description: 'No buses running at the moment',
          placement: 'top',
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
    let watchId = null;
    ReactNativeForegroundService.add_task(
      async () => {
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
          interval: 4000,
          fastInterval: 2000,
        });

        const intervalId = setInterval(async () => {
          LocationService.ping = (await getPing()).duration;
        }, 5000);
        try {
          watchId = Geolocation.watchPosition(
            async position => {
              const currentTime =
                +`${new Date().getHours()}.${new Date().getMinutes()}`;
              const offApp = currentTime < 9.2 && currentTime > 5.9;
              // if (!offApp) {
              //   await ReactNativeForegroundService.stopAll();
              //   // Geolocation.clearWatch(watchId);
              //   clearInterval(intervalId);
              // }
              // filter required data from position
              const locationData = {
                latitude1: position.coords.latitude,
                longitude1: position.coords.longitude,
                heading: position.coords.heading,
                // busNumber: user && user.busNumber,
                // weight: user && user.weight,
                // _id: user && user._id, //640fb8398d2d666319a7b000
                speed: position.coords.speed * 3.6,
              };

              console.log(locationData);

              const {location} = await LocationService.changeLocation(
                locationData,
              );

              // it geolocaiton.watchlocation which calls when the minmimum distance 30 meters and and every 4 second
              console.log(
                `Speed: ${location?.speed} , ${location?.speed > 20}`,
                {
                  location,
                },
              );

              // if speed greater than 17 then it calls
              const assignedUser =
                await LocationService.assignLocationContributor(
                  getUserData?.user,
                );

              // it calls only , if server says there is no contributor in database or if contributor present in database the if this contributor present in previous five user  database
              if (
                (assignedUser && assignedUser?.previous === false) ||
                (assignedUser && assignedUser?.wait === true)
              ) {
                const addNewLocation = await LocationService.addNewLocation({
                  ...location,
                  _id: getUserData.user._id,
                  busNumber: getUserData.user.busNumber,
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
                  const isClosed = await changeContributor({
                    _id: getUserData?.user?._id,
                    busNumber: getUserData?.user?.busNumber,
                  });
                };
                removeUser();
              }
            },
            {
              // because the of accuracy
              enableHighAccuracy: true,
              // runs when the distance is greater than 30 meter
              distanceFilter: 50,
              // runs every 4 second
              interval: 4000,
              // This option sets the maximum time (in milliseconds) that can pass before a new location update is obtained. Setting this to a lower value can help improve the responsiveness of the location updates, but may consume more battery.
              fastestInterval: 2000,
              // if user not enabled the location the it open dialog for asking location
              showLocationDialog: true,
              // this helps the location update even the app in forground or in background
              forceRequestLocation: true,
              //Setting this to false will use the Google Play Services location API if available, which can provide more accurate location data.
              forceLocationManager: false,
              showsBackgroundLocationIndicator: true,
            },
          );
        } catch (error) {
          console.log(error);
          // dispatch(contributorState(false));
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
        user={getUserData?.user}
        trackingLineCoordinates={location}
      />
    </>
  );
};

export default HomeScreen;
