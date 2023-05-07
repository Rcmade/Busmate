import AsyncStorage from '@react-native-async-storage/async-storage';
import {NetInfo} from '@react-native-community/netinfo';
import ImageResizer from '@bam.tech/react-native-image-resizer';

export const sleep = time =>
  new Promise(resolve => setTimeout(() => resolve(), time));

export const getPing = async () => {
  const startTime = Date.now();
  const response = await fetch(`https://www.google.com/?qlped=${Date.now()}`, {
    method: 'HEAD',
  });
  const endTime = Date.now();
  const duration = endTime - startTime;
  const status = response.status;
  return {duration, status};
};

export const setStorage = async (key, value) => {
  try {
    const convertString = JSON.stringify(value);
    await AsyncStorage.setItem(key, convertString);
  } catch (e) {
    // saving error
    console.log({e});
  }
};

export const setExpiresStorage = async (key, value, expiresTimeInMs) => {
  try {
    const convertString = JSON.stringify({
      data: value,
      expiresTimeInMs: new Date().getTime() + expiresTimeInMs,
    });
    await AsyncStorage.setItem(key, convertString);
  } catch (e) {
    // saving error
    console.log({e});
  }
};

export const getStorage = async key => {
  try {
    const convertString = JSON.parse(await AsyncStorage.getItem(key));
    console.log({convertString});
    return convertString;
  } catch (e) {
    // saving error
    console.log({e});
  }
};

export const getExpiresStorage = async key => {
  try {
    let convertString = JSON.parse(await AsyncStorage.getItem(key));
    if (convertString) {
      if (convertString.expiresTimeInMs < new Date().getTime()) {
        await removeStorage(key);
        return null;
      } else {
        return convertString?.data;
      }
    }
  } catch (e) {
    // saving error
    console.log({e});
  }
};

export const removeStorage = async key => {
  try {
    await AsyncStorage.removeItem(key);

    return;
  } catch (e) {
    // saving error
    console.log({e});
  }
};

export const ImageCompressor = async uri => {
  return (
    uri &&
    (await ImageResizer.createResizedImage(uri, 400, 400, 'JPEG', 80, 0, null)
      .then(response => {
        return response.uri;
      })
      .catch(err => {
        return err.message;
      }))
  );
};
