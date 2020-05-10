import React, { useEffect, useState, useRef } from 'react';
import { View, PermissionsAndroid } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import styles from './styles';
import getRegionForCoordinates from 'helpers/functions/getRegionForCoordinates';
import Geolocation from '@react-native-community/geolocation';
import { useDispatch } from 'react-redux';
import MapActions from 'actions/MapActions';
import Spinner from 'components/common/Spinner';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import setupBackgroundGeolocation from 'components/Map/setupBackgroundGeolocation';
import getReadableDateTime from 'helpers/functions/getReadableDateTime';

// TODO: add button to re-enable location tracking after drag
// TODO: move the background location stuff to another file or something
const Map = () => {
  const sendLocationEvery = 5000;
  const [currentRegion, setCurrentRegion] = useState();
  const [canUpdateRegion, setCanUpdateRegion] = useState(true);
  const [lastRegion, setLastRegion] = useState();
  const currentRef = useRef(currentRegion);
  currentRef.current = currentRegion;

  const dispatch = useDispatch();
  const dispatchLocate = () => {
    console.log({
      latitude: currentRef.current.latitude,
      longitude: currentRef.current.longitude, ...getReadableDateTime()
    });
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

    const watchId = Geolocation.getCurrentPosition(navPosition => {
      const reg = getRegionForCoordinates(navPosition.coords);
      setCurrentRegion(reg);
    });
    Geolocation.clearWatch(watchId);

    setupBackgroundGeolocation(BackgroundGeolocation, (location) => {
      console.log('new location');
      BackgroundGeolocation.startTask(taskKey => {
        setCurrentRegion(getRegionForCoordinates(location));
        console.log('setting location');
        dispatchLocate();
        BackgroundGeolocation.endTask(taskKey);
      });
    });

    // componentWillUnmount
    return () => {
      clearInterval(interval);
      dispatchUnmount();
    };
  }, []);

  // TODO: check permission stuff https://github.com/react-native-community/react-native-maps/issues/2793
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
