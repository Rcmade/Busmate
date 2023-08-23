// useLocationService.js
import {useEffect, useState} from 'react';
import Geolocation from 'react-native-geolocation-service';
import {getNewLocationRoute} from '../Server';
import {setExpiresStorage, getStorage, setStorage} from '../Utils/storage';
import {useAuthUser} from '../Context/AuthUserContext';

const useLocationService = () => {
  const {authUserState} = useAuthUser();
  const [location, setLocation] = useState([]);

  const getLocation = async () => {
    try {
      const now = new Date();
      if (authUserState?.user?.busNumber) {
        const getDate = await getStorage('date');
        const {data} = await getNewLocationRoute({
          date: getDate || new Date(),
          busNumber: authUserState?.user?.busNumber,
        });
        await setStorage('date', new Date(now.getTime() - 3000));

        if (data?.length) {
          await setExpiresStorage('location', location, 1000 * 60 * 60);
          setLocation(prevLocation => [...prevLocation, ...data]);
        }
      }
    } catch (error) {
      // Handle the error
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getLocation();
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, [authUserState]);

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      async position => {
        // Location update logic
        // ...
      },
      error => {
        // Error handling logic
        // ...
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 50,
        interval: 4000,
        fastestInterval: 2000,
        showLocationDialog: true,
        forceRequestLocation: true,
        forceLocationManager: false,
        showsBackgroundLocationIndicator: true,
      },
    );

    return () => Geolocation.clearWatch(watchId);
  }, []);

  return location;
};

export default useLocationService;
