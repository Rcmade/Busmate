import {AppState, Platform} from 'react-native';
import React, {useEffect, useState, useRef, useCallback} from 'react';
// import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {
  BackgroundLocationPermission,
  CoarseLocationPermission,
  FineLocationPermission,
} from '../../Utils/permissions/location';
import MapComponents from '../../components/MapComponents';
import {APP_VERSION, SHOW_TOAST, TASK_ID} from '../../Constant/AppConstant';
import {
  getExpiresStorage,
  getStorage,
  setExpiresStorage,
  setStorage,
} from '../../Utils/storage';
import NetworkService from '../../Utils/services/netService';
import {
  changeContributor,
  getAppUpdate,
  getNewLocationRoute,
} from '../../Server';

import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import LocationService from '../../Utils/services/locationService';
import Geolocation from 'react-native-geolocation-service';
import {useAuthUser} from '../../Context/AuthUserContext';
import {LocationConfig} from '../../Config/LocationConfig';
import {useAppFeature} from '../../Context/AppFeatureContext';
import RunnigSevice from '../../Utils/services/runningService';

const HomeScreen = () => {
  const mapRef = useRef(null);
  const [location, setLocation] = useState({});
  const {authUserState} = useAuthUser();
  const [appState, setAppState] = useState(AppState.currentState);
  const {appFeatureDispatch, appFeatureState} = useAppFeature();
  const [newAppUpdate, setNewAppUpdate] = useState({
    updateTitle: '',
    updateLink: '',
    updateDescription: '',
    isUpdateAvailable: false,
  });

  const startTime = appFeatureState?.isServiceAvailable?.startTime;
  const endTime = appFeatureState?.isServiceAvailable?.endTime;
  const isRunNow = RunnigSevice.getAvailability(startTime, endTime);

  // // this get the entire location data of selected bus is the service
  // const getEntireRoute = async () => {
  //   const {data} = await getNewLocationRoute({
  //     busNumber: authUserState?.user?.busNumber,
  //   });
  //   await setStorage('date', new Date(now.getTime() - 3000));
  //   const combineData = pre => {
  //     const combine = {
  //       ...pre,
  //       [authUserState.user.busNumber]: data,
  //     };
  //     return combine;
  //   };
  //   setLocation(pre => combineData(pre));
  // };
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
    const now = new Date();
    if (authUserState?.user?.busNumber && appState === 'active') {
      const getDate = await getStorage('date');
      const {data} = await getNewLocationRoute({
        date: getDate || new Date(Date.now() - 1000 * 60 * 30),
        busNumber: authUserState?.user?.busNumber,
      });
      await setStorage('date', new Date(now.getTime() - 3000));
      if (data?.length) {
        const combineData = pre => {
          const existingArray = pre[authUserState.user.busNumber] || [];
          const combine = {
            ...pre,
            [authUserState.user.busNumber]: [...existingArray, ...data],
          };
          // console.log(combine);
          return combine;
        };

        setLocation(pre => combineData(pre));
        const preLocation = (await getExpiresStorage('location')) || {};
        if (preLocation) {
          await setExpiresStorage(
            'location',
            combineData(preLocation),
            1000 * 60 * 60,
          );
        }
      }
    }
  }, [authUserState, appState]);

  // This is the calling function of getLocation to create polylines
  useEffect(() => {
    let interval;
    // this function is called when the user open the app again
    const handleAppStateChange = nextAppState => {
      setAppState(nextAppState);
      if (nextAppState === 'active' && isRunNow && !interval) {
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
        title: 'Busmate at Your Service!',
        message: 'We are here to assist you with your bus-related needs.',
        icon: 'ic_launcher',
      });
      if (isRunNow) {
      } else {
        await ReactNativeForegroundService.stopAll();
        appFeatureDispatch({
          type: SHOW_TOAST,
          payload: {
            visiblity: true,
            description:
              'At the moment, there is no active connection with any bus.',
            title: 'Connection Status Update',
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
              console.log(position);
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

  // check new version of app and request for update
  const getIsAppUpdate = async () => {
    const {data} = await getAppUpdate();
    if (data && Number(data?.updateVersion) !== APP_VERSION) {
      setNewAppUpdate(pre => ({
        ...pre,
        ...data,
        isUpdateAvailable: true,
      }));
    }
  };
  useEffect(() => {
    getIsAppUpdate();
  }, []);

  return (
    <>
      <MapComponents
        mapRef={mapRef}
        user={authUserState?.user}
        trackingLineCoordinates={location[authUserState?.user?.busNumber] || []}
        updateTitle={newAppUpdate.updateTitle}
        updateLink={newAppUpdate.updateLink}
        updateDescription={newAppUpdate.updateDescription}
        isUpdateAvailable={newAppUpdate.isUpdateAvailable}
        setNewAppUpdate={setNewAppUpdate}
        hardUpdate={newAppUpdate.hardUpdate}
      />
    </>
  );
};

export default HomeScreen;
