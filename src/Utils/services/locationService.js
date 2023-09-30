import {
  asignContributor,
  addNewLocation as addNewLocationApi,
  changeContributor,
} from '../../Server';
import {throttle} from 'lodash';
const throttledDispatch = throttle(changeContributor, 1000); // limit updates to once every second
const throttledAddNewLocationDispatch = throttle(addNewLocationApi, 1000); // limit updates to once every second
const throttledContributorDispatch = throttle(asignContributor, 1000); // limit updates to once every second
import NetworkService from './netService';
import RunnigSevice from './runningService';
import runningService from './runningService';
class LocationService {
  location = {
    speed: 0,
  };
  isAssigned = null;
  busData = null;
  isAddNewLocation = {
    previous: null,
    wait: null,
    youAreDone: null,
  };
  avgSpeedArr = [];
  isAssignedNow = false;
  ping = null;
  isNotRunNow = false;
  runInterval = null;
  avgDistance = [];

  async changeLocation(newLocation) {
    // Track the user
    this.ping = (await NetworkService.getPing()).duration;
    this.location = newLocation;
    this.busData = newLocation;

    if (!this.isAssigned?.assigned) {
      this.avgDistance.push({
        latitude: newLocation.latitude1,
        longitude: newLocation.longitude1,
      });
      this.avgSpeedArr.push(newLocation.speed || 0);
      if (this.avgSpeedArr.length >= 6) {
        this.avgSpeedArr.shift();
        this.avgDistance.shift();
      }
      if (this.avgSpeedArr.length === 5) {
        const distanceInMeters = runningService.calculateDistance(
          this.avgDistance[0].latitude,
          this.avgDistance[4].latitude,
          this.avgDistance[0].longitude,
          this.avgDistance[4].longitude,
        );
        const avgSpeed =
          this.avgSpeedArr.reduce((a, b) => a + b, 0) /
          this.avgSpeedArr?.length;

        if (avgSpeed > 17 && distanceInMeters > 70) {
          this.isAssignedNow = true;
        }
      }
    }

    return {location: this.location};
  }

  async assignLocationContributor(user) {
    if (this.isAssignedNow && !this.isAssigned?.assigned) {
      console.log('Insides assignLocationContributor');
      this.busData = {
        ...this.location,
        ...user,
        ms: this.ping,
      };
      const {data} = await throttledContributorDispatch(this.busData);
      if (data) {
        this.isAssigned = data;
      }
      return data;
    }

    return this.isAssigned;
  }

  async addNewLocation(userBusData) {
    const {data} = await throttledAddNewLocationDispatch({
      ...userBusData,
      ms: this.ping,
    });
    this.isAddNewLocation = {
      previous: data.previous,
      wait: data.wait,
      youAreDone: data.youAreDone,
    };

    return this.isAddNewLocation;
  }
  async changeTheContributor(userData) {
    if (this.isAssigned?.assigned) {
      const {data} = await throttledDispatch(userData);
      this.isAddNewLocation = {
        previous: data.previous,
        wait: data.wait,
        youAreDone: data.youAreDone,
      };
      this.isAssigned.assigned = false;
    }
    return this.isAddNewLocation;
  }
}

export default new LocationService();
