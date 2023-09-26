export const LocationConfig = {
  // because the of accuracy
  enableHighAccuracy: true,
  // runs when the distance is greater than 30 meter
  distanceFilter: 70,
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
};
