import { useRef } from 'react';
import MapView, { PROVIDER_GOOGLE, UserLocationChangeEvent, Camera } from 'react-native-maps';

import { styles } from './styles';

const INITIAL_VALUE = {
  center: {
    // Recife
    latitude: -8.063167,
    longitude: -34.8736584,
  },
  pitch: 0,
  heading: 0,
  zoom: 15,
};

export default function Map() {
  const mapRef = useRef<MapView>(null);

  const userLocationChange = (coordinates: UserLocationChangeEvent) => {
    const event = coordinates.nativeEvent.coordinate;

    if (event) {
      const camera: Camera = {
        center: {
          latitude: event.latitude,
          longitude: event.longitude,
        },
        pitch: 0,
        heading: event.heading,
      };

      mapRef.current?.animateCamera(camera, { duration: 1000 });
    }
  };

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      initialCamera={INITIAL_VALUE}
      showsUserLocation
      loadingEnabled
      style={styles.map}
      onUserLocationChange={coordinate => userLocationChange(coordinate)}
    />
  );
}
