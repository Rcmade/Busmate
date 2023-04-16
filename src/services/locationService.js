import Geolocation from '@react-native-community/geolocation';
import {asignContributer, addNewLocation as addNewLocationApi} from '../server';
import {getPing} from '../utils/functions';

class LocationService {
  location = {
    speed: 0,
  };
  error = null;
  isAssigned = null;
  busData = null;
  isAddNewLocation = {
    previous: null,
    wait: null,
    youAreDone: null,
  };

  async watchLocation() {
    // Track the user
    Geolocation.watchPosition(
      async position => {
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

        this.busData = locationData;

        // return the locationData which can access the location
        this.location = locationData;
      },

      error => {
        console.log('Error: ', error);
        this.error = error;
      },
      {
        // because the of accuracy
        enableHighAccuracy: true,
        // runs when the distance is greater than 30 meter
        distanceFilter: 30,
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
      },
    );

    return {location: this.location, error: this.error};
  }

  async assignLocationContributor(user) {
    if (this.location?.speed > 17 && !this.isAssigned?.assigned) {
      console.log('Inside');
      this.busData = {
        ...this.location,
        ...user,
        ms: (await getPing()).duration,
      };
      const {data} = await asignContributer(this.busData);
      console.log({data});
      if (data) {
        this.isAssigned = data;
      }
      return data;
    }

    return this.isAssigned;
  }

  async addNewLocation(userBusData) {
    const {data} = await addNewLocationApi(userBusData);
    this.isAddNewLocation = {
      previous: data.previous,
      wait: data.wait,
      youAreDone: data.youAreDone,
    };

    return this.isAddNewLocation;
  }
}

export default new LocationService();
