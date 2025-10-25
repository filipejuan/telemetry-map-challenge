import { useRef, useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import {
  LocationObject,
  requestForegroundPermissionsAsync,
  watchPositionAsync,
} from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { PROVIDER_GOOGLE, Camera, Marker } from 'react-native-maps';

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
  zoom: 16,
};

export default function Map() {
  const [speed, setSpeed] = useState(0);
  const [heading, setHeading] = useState(0);
  const [location, setLocation] = useState<LocationObject | null>(null);

  const mapRef = useRef<MapView>(null);

  const checkPermission = async () => {
    let { status } = await requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Não foi possível obter a localização.');
      return false;
    }
    return true;
  };

  const userLocationChange = (event: LocationObject) => {
    setLocation(event);

    const { coords } = event;
    if (!coords) return;

    const camera: Camera = {
      center: {
        latitude: coords.latitude,
        longitude: coords.longitude,
      },
      pitch: 0,
      heading: 0,
    };

    mapRef.current?.animateCamera(camera, { duration: 800 });

    if (typeof coords.speed === 'number' && coords.speed >= 0) {
      setSpeed(coords.speed * 3.6);
    }

    if (typeof coords.heading === 'number') {
      setHeading(coords.heading);
    }
  };

  async function watchPosition() {
    const hasPermission = await checkPermission();
    if (!hasPermission) return;

    const options = {
      accuracy: 6,
      distanceInterval: 1,
      timeInterval: 1000,
    };

    watchPositionAsync(options, userLocationChange);
  }

  useEffect(() => {
    watchPosition();
  }, []);

  return (
    <>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        initialCamera={INITIAL_VALUE}
        loadingEnabled
        style={styles.map}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            anchor={{ x: 0.3, y: 0.4 }}
          >
            <View style={{ transform: [{ rotate: `${heading}deg` }] }}>
              <MaterialIcons name="navigation" size={16} color="black" />
            </View>
          </Marker>
        )}
      </MapView>

      <View style={styles.accelerometerContainer}>
        <Accelerometer />
      </View>

      <View style={styles.speedometerContainer}>
        <Speedometer speed={speed} />
      </View>
    </>
  );
}
