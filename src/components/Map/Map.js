import React, { useEffect, useState, useRef } from 'react';
import { View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import styles from './styles';
import getRegionForCoordinates from 'helpers/functions/getRegionForCoordinates';
import Geolocation from '@react-native-community/geolocation';
import { useDispatch } from 'react-redux';
import MapActions from 'actions/MapActions';
import Spinner from 'components/common/Spinner';

const Map = () => {
  const sendLocationEvery = 5000;
  const [markerRegion, setMarkerRegion] = useState();
  const [currentRegion, setCurrentRegion] = useState();
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

  // componentDidMount
  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate();
      dispatchLocate();
    }, sendLocationEvery);

    const watchId = Geolocation.watchPosition(navPosition => {
      const reg = getRegionForCoordinates({
        latitude: navPosition.coords.latitude,
        longitude: navPosition.coords.longitude,
      });
      setCurrentRegion(reg);
      setMarkerRegion(reg);
    });

    // componentWillUnmount
    return () => {
      clearInterval(interval);
      Geolocation.clearWatch(watchId);
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
        followsUserLocation={true}
        showsUserLocation={true}>
        <MapView.Marker
          coordinate={markerRegion}
          title={'Your Location'}
        />
      </MapView>
  );
};

export default Map;
