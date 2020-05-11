import React, { useEffect, useState, useRef } from 'react';
import { View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import styles from './styles';
import getRegionForCoordinates from 'helpers/functions/getRegionForCoordinates';
import { useDispatch } from 'react-redux';
import MapActions from 'actions/MapActions';
import Spinner from 'components/common/Spinner';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import setupBackgroundGeolocation from 'components/Map/setupBackgroundGeolocation';
import { dateDiffInSeconds } from 'helpers/functions/dateFunctions';
import requestLocationPermission from 'components/Map/requestLocationPermission';
import Button from 'components/common/Button';

// TODO: add button to re-enable location tracking after drag
const Map = () => {
  const sendLocationEvery = 5000;
  let lastSentOn = new Date();
  const [currentRegion, setCurrentRegion] = useState();
  const [canUpdateRegion, setCanUpdateRegion] = useState(true);
  const [lastRegion, setLastRegion] = useState();
  const currentRef = useRef(currentRegion);
  currentRef.current = currentRegion;

  const dispatch = useDispatch();
  const dispatchLocate = () => {
    const now = new Date();
    const diff = dateDiffInSeconds(lastSentOn, now);

    if (diff >= sendLocationEvery / 1000) {
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

  const onResetDrag = () => {
    setCanUpdateRegion(true);
  };

  const onRegionChange = (reg) => {
    if (!canUpdateRegion) {
      setLastRegion(reg);
    }
  };

  // componentDidMount
  useEffect(() => {
    requestLocationPermission().done();
    const interval = setInterval(() => {
      dispatchLocate();
    }, sendLocationEvery);

    setupBackgroundGeolocation(
      BackgroundGeolocation,
      (location) => {
        BackgroundGeolocation.startTask(taskKey => {
          setCurrentRegion(getRegionForCoordinates(location));
          dispatchLocate();
          BackgroundGeolocation.endTask(taskKey);
        })
      }
    );

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
      : <View style={{flex: 1}}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={currentRegion}
        region={canUpdateRegion ? currentRegion : lastRegion}
        onRegionChangeComplete={onRegionChange}
        showsUserLocation={true}
        onPanDrag={onDrag}
        followsUserLocation={true}>
      </MapView>
        <View
          style={{
            position: 'absolute',//use absolute position to show button on top of the map
            top: '50%', //for center align
            alignSelf: 'flex-end' //for align to right
          }}
        >
          <Button title={'Re-center'} onPress={onResetDrag}/>
        </View>
      </View>
  );
};

export default Map;
