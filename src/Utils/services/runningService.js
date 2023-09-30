class RunnigSevice {
  getAvailability(startTime, endTime) {
    const currentTime = new Date();
    const currentHour = currentTime.getUTCHours() + 5; // UTC offset for IST
    const currentMinute = currentTime.getUTCMinutes() + 30; // Adding 30 minutes for IST offset

    const startDateTime = new Date(startTime);
    const endDateTime = new Date(endTime);

    const startHour = startDateTime.getUTCHours() + 5; // UTC offset for IST
    const startMinute = startDateTime.getUTCMinutes() + 30; // Adding 30 minutes for IST offset

    const endHour = endDateTime.getUTCHours() + 5; // UTC offset for IST
    const endMinute = endDateTime.getUTCMinutes() + 30; // Adding 30 minutes for IST offset

    if (
      currentHour > startHour ||
      (currentHour === startHour && currentMinute >= startMinute)
    ) {
      if (
        currentHour < endHour ||
        (currentHour === endHour && currentMinute <= endMinute)
      ) {
        return true;
      }
    }

    return false;
  }

  calculateDistance(lat1, lat2, lon1, lon2) {
    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.
    var lon1 = (lon1 * Math.PI) / 180;
    var lon2 = (lon2 * Math.PI) / 180;
    var lat1 = (lat1 * Math.PI) / 180;
    var lat2 = (lat2 * Math.PI) / 180;

    // Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a =
      Math.pow(Math.sin(dlat / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers. Use 3956
    // for miles
    let r = 6371;

    // calculate the result in METERS
    return +(c * r * 1000);
  }
}

export default new RunnigSevice();
