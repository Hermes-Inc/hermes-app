import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import useChannel from 'helpers/useChannel';
import styles from './styles';
import getRegionForCoordinates from 'helpers/functions/getRegionForCoordinates';
import Geolocation from '@react-native-community/geolocation';
import CoordinatesUpdater from 'components/Map/CoordinatesUpdater';

const Map = () => {
  const [exampleChannel] = useChannel('example');
  const [region, setRegion] = useState();

  useEffect(() => {
    if (!exampleChannel || !region) {
      return;
    }

    CoordinatesUpdater.setState(exampleChannel, region);

    exampleChannel.on('example:alert', () => {
      console.log('Can you see me?!!!!');
    });
  }, [exampleChannel, region]);

  useEffect(() => {
    const watchId = Geolocation.watchPosition(navPosition => {
      setRegion(getRegionForCoordinates([{
        latitude: navPosition.coords.latitude,
        longitude: navPosition.coords.longitude,
      }]));
    });

    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, []);

  return (
    !region
      ? <View>
        <Text>Loading...</Text>
      </View>
      : <MapView provider={PROVIDER_GOOGLE} style={styles.map} initialRegion={region} region={region}>
        <MapView.Marker
          coordinate={region}
          title={'Your Location'}
        />
      </MapView>
  );
};

export default Map;
