import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';

import {AssignContributorProvider} from './src/Context/AssignContributorContext';
import {AuthUserProvider} from './src/Context/AuthUserContext';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import {AppFeatureProvider} from './src/Context/AppFeatureContext';

LogBox.ignoreLogs([
  'In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.',
]);

const AppContainer = () => {
  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'rgb(255, 45, 85)',
    },
    background: '#ffff',
  };

  return (
    <AppFeatureProvider>
      <AssignContributorProvider>
        <AuthUserProvider>
          <NavigationContainer theme={MyTheme}>
            <App />
          </NavigationContainer>
        </AuthUserProvider>
      </AssignContributorProvider>
    </AppFeatureProvider>
  );
};

ReactNativeForegroundService.register();

AppRegistry.registerComponent(appName, () => AppContainer);
