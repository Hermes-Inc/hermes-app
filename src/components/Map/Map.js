import React, { useEffect, useState, useRef } from 'react';
import { View, PermissionsAndroid } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import styles from './styles';
import getRegionForCoordinates from 'helpers/functions/getRegionForCoordinates';
import { useDispatch } from 'react-redux';
import MapActions from 'actions/MapActions';
import Spinner from 'components/common/Spinner';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import setupBackgroundGeolocation from 'components/Map/setupBackgroundGeolocation';
import { getReadableDateTime, dateDiffInSeconds } from 'helpers/functions/dateFunctions';

let lastSentOn = null;

// TODO: add button to re-enable location tracking after drag
const Map = () => {
  const sendLocationEvery = 5000;
  const [currentRegion, setCurrentRegion] = useState();
  const [canUpdateRegion, setCanUpdateRegion] = useState(true);
  const [lastRegion, setLastRegion] = useState();
  const currentRef = useRef(currentRegion);
  currentRef.current = currentRegion;

  const dispatch = useDispatch();
  const dispatchLocate = () => {
    if (!lastSentOn) {
      lastSentOn = new Date();
    }

    const now = new Date();
    const diff = dateDiffInSeconds(lastSentOn, now);
    console.log('difference: ', diff);

    if (diff >= sendLocationEvery / 1000) {
      console.log({
        latitude: currentRef.current.latitude,
        longitude: currentRef.current.longitude, ...getReadableDateTime()
      });
      lastSentOn = now;
      dispatch(MapActions.locate(currentRef.current));
    }
  };
  const dispatchUnmount = () => {
    dispatch(MapActions.unmount());
  };

  const onDrag = () => {
    if (canUpdateRegion) {
      setCanUpdateRegion(false);
      setLastRegion(currentRegion);
    }
  };

  const onRegionChange = (reg) => {
    console.log('canUpdateRegion: ', canUpdateRegion);
    if (!canUpdateRegion) {
      setLastRegion(reg);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Example App',
          'message': 'Example App access to your location '
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the location");
      } else {
        console.log("Location permission denied");
      }
    } catch (err) {
      console.warn(err)
    }
  };

  // componentDidMount
  useEffect(() => {
    requestLocationPermission();
    const interval = setInterval(() => {
      dispatchLocate();
    }, sendLocationEvery);

    setupBackgroundGeolocation(
      BackgroundGeolocation,
      (location) => {
        console.log('new location');
        BackgroundGeolocation.startTask(taskKey => {
          console.log('setting location');
          setCurrentRegion(getRegionForCoordinates(location));
          dispatchLocate();
          BackgroundGeolocation.endTask(taskKey);
        });
      },
      () => {
        console.log('[INFO] App is in background');
      },
      () => {
        console.log('[INFO] App is in foreground');
      });

    // componentWillUnmount
    return () => {
      clearInterval(interval);
      dispatchUnmount();
    };
  }, []);

  return (
    !currentRegion
      ? <View>
        <Spinner/>
      </View>
      : <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={currentRegion}
        region={canUpdateRegion ? currentRegion : lastRegion}
        onRegionChangeComplete={onRegionChange}
        showsUserLocation={true}
        onPanDrag={onDrag}
        followsUserLocation={true}>
      </MapView>
  );
};

export default Map;
