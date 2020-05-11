import { PermissionsAndroid, Platform } from 'react-native';

const requestLocationPermission = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      if(Platform.OS === 'ios') {
        resolve();
      } else {const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Hermes',
          message: 'Hermes is asking for access to your location '
        }
      );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          resolve('You can use the location');
        } else {
          reject('Location permission denied');
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};

export default requestLocationPermission;
