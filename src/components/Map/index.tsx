import { useRef, useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import * as Location from 'expo-location';
import MapView, { PROVIDER_GOOGLE, UserLocationChangeEvent, Camera } from 'react-native-maps';

import Speedometer from '@/components/Speedometer';
import Accelerometer from '@/components/Accelerometer';

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
  const [speed, setSpeed] = useState(0);
  const mapRef = useRef<MapView>(null);

  const checkPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Não foi possível obter a localização.');
      return;
    }
  };

  useEffect(() => {
    checkPermission();
  }, []);

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

      if (typeof event.speed === 'number' && event.speed >= 0) {
        setSpeed(event.speed * 3.6);
      }
    }
  };

  return (
    <>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        initialCamera={INITIAL_VALUE}
        showsUserLocation
        loadingEnabled
        style={styles.map}
        onUserLocationChange={coordinate => userLocationChange(coordinate)}
      />

      <View style={styles.accelerometerContainer}>
        <Accelerometer />
      </View>

      <View style={styles.speedometerContainer}>
        <Speedometer speed={speed} />
      </View>
    </>
  );
}
