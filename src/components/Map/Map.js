import React, {useEffect, useState, useRef} from 'react';
import {View, Text} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import styles from './styles';
import getRegionForCoordinates from 'helpers/functions/getRegionForCoordinates';
import Geolocation from '@react-native-community/geolocation';
import {useDispatch} from 'react-redux';
import MapActions from 'actions/MapActions';
import getReadableDateTime from 'helpers/functions/getReadableDateTime';

const Map = () => {
  const [markerRegion, setMarkerRegion] = useState();
  const [currentRegion, setCurrentRegion] = useState();
  const currentRef = useRef(currentRegion);
  currentRef.current = currentRegion;

  // use if we want to redirect the user view to marker location
  // be advised: it re-renders the component
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
    }, 5000);

    const watchId = Geolocation.watchPosition(navPosition => {
      // TODO: make this accept objects, not only arrays
      const pos = getRegionForCoordinates([{
        latitude: navPosition.coords.latitude,
        longitude: navPosition.coords.longitude,
      }]);
      setCurrentRegion(pos);
      setMarkerRegion(pos);
    });
    // componentWillUnmount
    // TODO: dispatch action that leaves phoenix channel
    return () => {
      clearInterval(interval);
      Geolocation.clearWatch(watchId);
      dispatchUnmount();
    };
  }, []);

  // TODO: use spinner
  return (
    !currentRegion || !markerRegion
      ? <View>
        <Text>Loading...</Text>
      </View>
      : <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={currentRegion}>
        <MapView.Marker
          coordinate={markerRegion}
          title={'Your Location'}
        />
      </MapView>
  );
};

export default Map;
