import {createContext, useContext, useReducer} from 'react';
import {appFeatureReducer} from '../Reducers/AppFeatureReducers';
const AppFeatureContext = createContext();
import {Appearance} from 'react-native';
import {PaperProvider} from 'react-native-paper';
import {darkTheme, lightTheme} from '../Config/ThemeConfig';
const colorScheme = Appearance.getColorScheme();

const initialState = {
  isServiceAvailable: {
    destinationLatitude: null,
    destinationLongitude: null,
    startTime: null,
    offTime: null,
    temprary: false,
  },
  theme: colorScheme,
  toast: {
    visiblity: false,
    title: '',
    description: '',
    variant: '',
    status: '',
    duration:7000
  },
};
const AppFeatureProvider = ({children}) => {
  const [state, dispatch] = useReducer(appFeatureReducer, initialState);
  const theme = state.theme === 'light' ? lightTheme : darkTheme;
  return (
    <AppFeatureContext.Provider
      value={{
        appFeatureState: state,
        appFeatureDispatch: dispatch,
      }}>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </AppFeatureContext.Provider>
  );
};

const useAppFeature = () => {
  const context = useContext(AppFeatureContext);
  if (!context) {
    throw new Error('useAppFeature must be used within an AppFeatureProvider');
  }
  return context;
};

export {AppFeatureProvider, useAppFeature};
