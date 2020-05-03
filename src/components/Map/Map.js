import React, { useEffect } from 'react';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import useChannel from 'helpers/useChannel';
import { PhoenixSocketProvider } from 'helpers/PhoenixSocketContext';

// THIS ZOOMS CORRECTLY OVER A SET OF COORDINATES
const getRegionForCoordinates = points => {
  // points should be an array of { latitude: X, longitude: Y }
  let minX, maxX, minY, maxY;

  ((point) => {
    minX = point.latitude;
    maxX = point.latitude;
    minY = point.longitude;
    maxY = point.longitude;
  })(points[0]);

  points.map((point) => {
    minX = Math.min(minX, point.latitude);
    maxX = Math.max(maxX, point.latitude);
    minY = Math.min(minY, point.longitude);
    maxY = Math.max(maxY, point.longitude);
  });

  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;
  const deltaX = points.length === 1 ? 0.0043 : (maxX - minX);
  const deltaY = points.length === 1 ? 0.0034 : (maxY - minY);

  return {
    latitude: midX,
    longitude: midY,
    latitudeDelta: deltaX,
    longitudeDelta: deltaY,
  };
};

const InnerView = () => {
  const [exampleChannel] = useChannel('example');

  useEffect(() => {
    if (!exampleChannel) { return; }

    exampleChannel.on('example:alert', () => {
      console.log('Can you see me?!!!!');
    });
  }, [exampleChannel]);

  useEffect(() => {
    if (!exampleChannel) { return; }

    exampleChannel.push('example:broadcast', {message: 'Hello Phoenix!'});
  });

  const state = getRegionForCoordinates([{
    latitude: -34.9040107,
    longitude: -56.1416995,
  }]);
  const styles = {
    map: {
      width: null,
      height: 300,
      flex: 1,
    },
  };
  return (
    <MapView provider={PROVIDER_GOOGLE} style={styles.map} initialRegion={state} region={state}>
      <MapView.Marker coordinate={state} />
    </MapView>
  );
};

const Map = () => {
    return (
      <PhoenixSocketProvider>
        <InnerView />
      </PhoenixSocketProvider>
    );
};

export default Map;
