import React, { useEffect, useState, useRef } from 'react';
import { View, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import styles from './styles';
import getRegionForCoordinates from 'helpers/functions/getRegionForCoordinates';
import Geolocation from '@react-native-community/geolocation';
import { useDispatch } from 'react-redux';
import MapActions from 'actions/MapActions';
import Spinner from 'components/common/Spinner';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';

// TODO: add button to re-enable location tracking after drag
// TODO: move the background location stuff to another file or something
const Map = () => {
  const sendLocationEvery = 5000;
  const [markerRegion, setMarkerRegion] = useState();
  const [currentRegion, setCurrentRegion] = useState();
  const [canUpdateRegion, setCanUpdateRegion] = useState(true);
  const [lastRegion, setLastRegion] = useState();
  const currentRef = useRef(currentRegion);
  currentRef.current = currentRegion;

  const forceUpdate = () => {
    setMarkerRegion(null);
    setMarkerRegion(currentRef.current);
  };

  const dispatch = useDispatch();
  const dispatchLocate = () => {
    dispatch(MapActions.locate(currentRef.current));
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
    if (!canUpdateRegion) {
      setLastRegion(reg);
    }
  };

  // componentDidMount
  useEffect(() => {
    const interval = setInterval(() => {
      // forceUpdate();
      dispatchLocate();
    }, sendLocationEvery);

    const watchId = Geolocation.getCurrentPosition(navPosition => {
      const reg = getRegionForCoordinates(navPosition.coords);
      setCurrentRegion(reg);
      setMarkerRegion(reg);
    });
    Geolocation.clearWatch(watchId);

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

    BackgroundGeolocation.on('location', (location) => {
      BackgroundGeolocation.startTask(taskKey => {
        setCurrentRegion(getRegionForCoordinates(location));
        BackgroundGeolocation.endTask(taskKey);
      });
    });

    BackgroundGeolocation.on('stationary', (stationaryLocation) => {
      console.log(stationaryLocation)
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

    // componentWillUnmount
    return () => {
      clearInterval(interval);
      dispatchUnmount();
    };
  }, []);

  // TODO: check permission stuff https://github.com/react-native-community/react-native-maps/issues/2793
  return (
    !currentRegion || !markerRegion
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
        <MapView.Marker
          coordinate={markerRegion}
          title={'Your Location'}
        />
      </MapView>
  );
};

export default Map;
