import { Alert } from 'react-native';

export default function setupBackgroundGeolocation(BackgroundGeolocation, onLocation) {
  BackgroundGeolocation.configure({
    desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
    stationaryRadius: 50,
    distanceFilter: 50,
    debug: false,
    startOnBoot: false,
    stopOnTerminate: true,
    locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
    interval: 10000,
    fastestInterval: 5000,
    activitiesInterval: 10000,
    stopOnStillActivity: false,
    url: null
  });

  BackgroundGeolocation.on('location', onLocation);

  BackgroundGeolocation.on('stationary', (stationaryLocation) => {
    console.log(stationaryLocation);
    console.log('stationary');
  });

  BackgroundGeolocation.on('error', (error) => {
    console.log('[ERROR] BackgroundGeolocation error:', error);
  });

  BackgroundGeolocation.on('authorization', (status) => {
    if (status !== BackgroundGeolocation.AUTHORIZED) {
      setTimeout(() =>
        Alert.alert('App requires location tracking permission', 'Would you like to open app settings?', [
          {text: 'Yes', onPress: () => BackgroundGeolocation.showAppSettings()},
          {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'}
        ]), 1000);
    }
  });

  BackgroundGeolocation.on('background', () => {
    console.log('[INFO] App is in background');
  });

  BackgroundGeolocation.on('foreground', () => {
    console.log('[INFO] App is in foreground');
  });

  BackgroundGeolocation.checkStatus(status => {
    if (!status.isRunning) {
      BackgroundGeolocation.start();
    }
  });
}
