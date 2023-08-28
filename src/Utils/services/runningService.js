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
}

export default new RunnigSevice();
