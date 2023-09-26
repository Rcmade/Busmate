// Test cases for RunnigSevice.getAvailability function

import RunnigSevice from '../Utils/services/runningService';

// Test Case 1: Availability is from 10:00 to 11:00
console.log(
  'Test Case 1:',
  'getHours',
  new Date('2023-09-22T10:00:00.000+00:00').getHours(),
  'getMinutes',
  new Date('2023-09-22T10:00:00.000+00:00').getMinutes(),
  RunnigSevice.getAvailability(
    '2023-09-22T10:00:00.000+00:00',
    '2023-09-22T11:00:00.000+00:00',
  ),

  'getHours',
  new Date('2023-09-22T11:00:00.000+00:00').getHours(),
  'getMinutes',
  new Date('2023-09-22T11:00:00.000+00:00').getMinutes(),
); // Should return true

// Test Case 2: Availability is from 14:30 to 15:45
console.log(
  'Test Case 2:',
  'getHours',
  new Date('2023-09-22T14:30:00.000+00:00').getHours(),
  'getMinutes',
  new Date('2023-09-22T14:30:00.000+00:00').getMinutes(),
  RunnigSevice.getAvailability(
    '2023-09-22T14:30:00.000+00:00',
    '2023-09-22T15:45:00.000+00:00',
  ),

  'getHours',
  new Date('2023-09-22T15:45:00.000+00:00').getHours(),
  'getMinutes',
  new Date('2023-09-22T15:45:00.000+00:00').getMinutes(),
); // Should return true

// Test Case 3: Availability is from 19:00 to 20:00
console.log(
  'Test Case 3:',
  'getHours',
  new Date('2023-09-22T19:00:00.000+00:00').getHours(),
  'getMinutes',
  new Date('2023-09-22T19:00:00.000+00:00').getMinutes(),
  RunnigSevice.getAvailability(
    '2023-09-22T19:00:00.000+00:00',
    '2023-09-22T20:00:00.000+00:00',
  ),

  'getHours',
  new Date('2023-09-22T20:00:00.000+00:00').getHours(),
  'getMinutes',
  new Date('2023-09-22T20:00:00.000+00:00').getMinutes(),
); // Should return false

// Test Case 4: Availability is from 20:00 to 20:30
console.log(
  'Test Case 4:',
  'getHours',
  new Date('2023-09-22T20:00:00.000+00:00').getHours(),
  'getMinutes',
  new Date('2023-09-22T20:00:00.000+00:00').getMinutes(),
  RunnigSevice.getAvailability(
    '2023-09-22T20:00:00.000+00:00',
    '2023-09-22T20:30:00.000+00:00',
  ),

  'getHours',
  new Date('2023-09-22T20:30:00.000+00:00').getHours(),
  'getMinutes',
  new Date('2023-09-22T20:30:00.000+00:00').getMinutes(),
); // Should return false

// Test Case 5: Availability is from 05:00 to 06:30
console.log(
  'Test Case 5:',
  'getHours',
  new Date('2023-09-22T05:00:00.000+00:00').getHours(),
  'getMinutes',
  new Date('2023-09-22T05:00:00.000+00:00').getMinutes(),
  RunnigSevice.getAvailability(
    '2023-09-22T05:00:00.000+00:00',
    '2023-09-22T06:30:00.000+00:00',
  ),

  'getHours',
  new Date('2023-09-22T06:30:00.000+00:00').getHours(),
  'getMinutes',
  new Date('2023-09-22T06:30:00.000+00:00').getMinutes(),
); // Should return false

// Test Case 6: Availability is from 00:00 to 01:00 (crosses midnight)
console.log(
  'Test Case 6:',
  'getHours',
  new Date('2023-09-22T00:00:00.000+00:00').getHours(),
  'getMinutes',
  new Date('2023-09-22T00:00:00.000+00:00').getMinutes(),
  RunnigSevice.getAvailability(
    '2023-09-22T00:00:00.000+00:00',
    '2023-09-22T01:00:00.000+00:00',
  ),

  'getHours',
  new Date('2023-09-22T01:00:00.000+00:00').getHours(),
  'getMinutes',
  new Date('2023-09-22T01:00:00.000+00:00').getMinutes(),
); // Should return false

// Test Case 7: Availability is from 22:00 to 23:59 (crosses midnight)
console.log(
  'Test Case 7:',
  'getHours',
  new Date('2023-09-22T22:00:00.000+00:00').getHours(),
  'getMinutes',
  new Date('2023-09-22T22:00:00.000+00:00').getMinutes(),
  RunnigSevice.getAvailability(
    '2023-09-22T22:00:00.000+00:00',
    '2023-09-22T23:59:00.000+00:00',
  ),

  'getHours',
  new Date('2023-09-22T23:59:00.000+00:00').getHours(),
  'getMinutes',
  new Date('2023-09-22T23:59:00.000+00:00').getMinutes(),
); // Should return true

// Test Case 8: Availability is from 10:30 to 10:45
console.log(
  'Test Case 8:',
  'getHours',
  new Date('2023-09-22T10:30:00.000+00:00').getHours(),
  'getMinutes',
  new Date('2023-09-22T10:30:00.000+00:00').getMinutes(),
  RunnigSevice.getAvailability(
    '2023-09-22T10:30:00.000+00:00',
    '2023-09-22T10:45:00.000+00:00',
  ),

  'getHours',
  new Date('2023-09-22T10:45:00.000+00:00').getHours(),
  'getMinutes',
  new Date('2023-09-22T10:45:00.000+00:00').getMinutes(),
); // Should return true

// Test Case 9: Availability is from 12:00 to 12:00 (same start and end time)
console.log(
  'Test Case 9:',
  'getHours',
  new Date('2023-09-22T12:00:00.000+00:00').getHours(),
  'getMinutes',
  new Date('2023-09-22T12:00:00.000+00:00').getMinutes(),
  RunnigSevice.getAvailability(
    '2023-09-22T12:00:00.000+00:00',
    '2023-09-22T12:00:00.000+00:00',
  ),

  'getHours',
  new Date('2023-09-22T12:00:00.000+00:00').getHours(),
  'getMinutes',
  new Date('2023-09-22T12:00:00.000+00:00').getMinutes(),
); // Should return true

// Test Case 10: Availability is from 06:00 to 07:00
console.log(
  'Test Case 10:',
  'getHours',
  new Date('2023-09-22T06:00:00.000+00:00').getHours(),
  'getMinutes',
  new Date('2023-09-22T06:00:00.000+00:00').getMinutes(),
  RunnigSevice.getAvailability(
    '2023-09-22T06:00:00.000+00:00',
    '2023-09-22T07:00:00.000+00:00',
  ),

  'getHours',
  new Date('2023-09-22T07:00:00.000+00:00').getHours(),
  'getMinutes',
  new Date('2023-09-22T07:00:00.000+00:00').getMinutes(),
); // Should return true

// Test Case 11: Availability is from 23:30 to 00:30 (crosses midnight)
console.log(
  'Test Case 11:',
  'getHours',
  new Date('2023-09-22T23:30:00.000+00:00').getHours(),
  'getMinutes',
  new Date('2023-09-22T23:30:00.000+00:00').getMinutes(),
  RunnigSevice.getAvailability(
    '2023-09-22T23:30:00.000+00:00',
    '2023-09-23T00:30:00.000+00:00',
  ),

  'getHours',
  new Date('2023-09-23T00:30:00.000+00:00').getHours(),
  'getMinutes',
  new Date('2023-09-23T00:30:00.000+00:00').getMinutes(),
); // Should return true

// Test Case 12: Availability is from 09:15 to 10:00
console.log(
  'Test Case 12:',
  'getHours',
  new Date('2023-09-22T09:15:00.000+00:00').getHours(),
  'getMinutes',
  new Date('2023-09-22T09:15:00.000+00:00').getMinutes(),
  RunnigSevice.getAvailability(
    '2023-09-22T09:15:00.000+00:00',
    '2023-09-22T10:00:00.000+00:00',
  ),

  'getHours',
  new Date('2023-09-22T10:00:00.000+00:00').getHours(),
  'getMinutes',
  new Date('2023-09-22T10:00:00.000+00:00').getMinutes(),
); // Should return true

// Test Case 13: Availability is from 13:00 to 15:30
console.log(
  'Test Case 13:',
  'getHours',
  new Date('2023-09-22T13:00:00.000+00:00').getHours(),
  'getMinutes',
  new Date('2023-09-22T13:00:00.000+00:00').getMinutes(),
  RunnigSevice.getAvailability(
    '2023-09-22T13:00:00.000+00:00',
    '2023-09-22T15:30:00.000+00:00',
  ),

  'getHours',
  new Date('2023-09-22T15:30:00.000+00:00').getHours(),
  'getMinutes',
  new Date('2023-09-22T15:30:00.000+00:00').getMinutes(),
); // Should return true

// Test Case 14: Availability is from 03:00 to 03:30
console.log(
  'Test Case 14:',
  'getHours',
  new Date('2023-09-22T03:00:00.000+00:00').getHours(),
  'getMinutes',
  new Date('2023-09-22T03:00:00.000+00:00').getMinutes(),
  RunnigSevice.getAvailability(
    '2023-09-22T03:00:00.000+00:00',
    '2023-09-22T03:30:00.000+00:00',
  ),

  'getHours',
  new Date('2023-09-22T03:30:00.000+00:00').getHours(),
  'getMinutes',
  new Date('2023-09-22T03:30:00.000+00:00').getMinutes(),
); // Should
