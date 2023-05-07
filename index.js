import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {addNewLocation, asignContributor} from './src/server';
import {Provider} from 'react-redux';
import store from './src/Store/store';
import {contributorState} from './src/Store/Reducers/locationReducer';
import {NativeBaseProvider} from 'native-base';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
// import {throttle} from 'lodash';
import {getPing, setStorage} from './src/utils/functions';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';

export const TASK_ID = 20202;
export const TASK_NAME2 = 202022;
const dispatch = store.dispatch;
// const throttledDispatch = throttle(dispatch, 1000); // limit updates to once every second

async function MyBackgroundTask(busdata) {
  // const contributorState = useSelector(state => state.assignContributor);
  // Call your API here
  /* 
  {
    busdata:{
      latitude1: position.coords.latitude,
      longitude1: position.coords.longitude,
      busNumber: 18,
      weight: 1,
      ms: await measurePing().duration,
      _id: '640d5934e316fbadb60f4619',
      speed
    }
  }
   */

  const getContributorState = store.getState().assignContributor;

  const {data} =
    busdata.speed > 20 &&
    !getContributorState.assigned &&
    (await asignContributor({...busdata, ms: (await getPing()).duration}));

  if (data) {
    dispatch(
      contributorState({previous: data.previous, assigned: data.assigned}),
    );
  }

  if (
    (data && !data?.previous === false) ||
    getContributorState?.previous === false ||
    getContributorState?.wait === true
  ) {
    // console.log('Inside AddContribut');
    const {data: contributarLocation} = await addNewLocation(busdata);
    // console.log({contributarLocation, data});
    if (contributarLocation) {
      dispatch(
        contributorState({
          previous: contributarLocation.previous,
          wait: contributarLocation.wait,
          assigned: contributarLocation?.assigned || true,
        }),
      );

      if (
        contributarLocation.previous === true &&
        contributarLocation.wait === false &&
        contributarLocation?.youAreDone == true
      ) {
        await ReactNativeForegroundService.stopAll();
        return true;
      }
    }
  }

  // End the task
  return true;
}

const ReduxProvider = () => {
  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'rgb(255, 45, 85)',
    },
    background: '#ffff',
  };
  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <NavigationContainer theme={MyTheme}>
          <App />
        </NavigationContainer>
      </NativeBaseProvider>
    </Provider>
  );
};

// Register the service
ReactNativeForegroundService.register();
AppRegistry.registerComponent(appName, () => ReduxProvider);
