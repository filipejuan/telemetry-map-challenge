import { useRef, useState, useEffect, useCallback } from 'react';
import { View, Alert, TouchableOpacity, Text } from 'react-native';
import {
  LocationObject,
  requestForegroundPermissionsAsync,
  watchPositionAsync,
  getCurrentPositionAsync,
  LocationSubscription,
} from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { PROVIDER_GOOGLE, Camera, Marker } from 'react-native-maps';

import Speedometer from '@/components/Speedometer';
import Accelerometer from '@/components/Accelerometer';
import StartButton from '@/components/StartButton';

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
  const [hasStarted, setHasStarted] = useState(false);

  const [speed, setSpeed] = useState(0);
  const [heading, setHeading] = useState(0);
  const [location, setLocation] = useState<LocationObject | null>(null);

  const mapRef = useRef<MapView>(null);
  const watcherRef = useRef<LocationSubscription | null>(null);
  const hasStartedRef = useRef(hasStarted);

  const checkPermission = async () => {
    let { status } = await requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Não foi possível obter a localização.');
      return false;
    }
    return true;
  };

  const getCurrentLocation = async () => {
    const hasPermission = await checkPermission();
    if (!hasPermission) return;

    let location = await getCurrentPositionAsync({});
    userLocationChange(location);
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    hasStartedRef.current = hasStarted;

    if (hasStarted) watchPosition();
    else {
      stopWatching();
      setSpeed(0);
    }
  }, [hasStarted]);

  const userLocationChange = useCallback(
    (event: LocationObject) => {
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

      if (hasStartedRef.current && typeof coords.speed === 'number' && coords.speed >= 0) {
        setSpeed(coords.speed * 3.6);
      }

      if (typeof coords.heading === 'number') {
        setHeading(coords.heading);
      }
    },
    [hasStarted],
  );

  const watchPosition = async () => {
    const hasPermission = await checkPermission();
    if (!hasPermission) return;

    const options = {
      accuracy: 6,
      distanceInterval: 1,
      timeInterval: 1000,
    };

    watcherRef.current = await watchPositionAsync(options, userLocationChange);
  };

  const stopWatching = async () => {
    if (watcherRef.current) {
      watcherRef.current.remove();
      watcherRef.current = null;
    }
  };

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
              <MaterialIcons name="navigation" size={16} color="#000" />
            </View>
          </Marker>
        )}
      </MapView>

      <TouchableOpacity style={styles.buttonContainer} onPress={() => setHasStarted(prev => !prev)}>
        <StartButton hasStarted={hasStarted} />
      </TouchableOpacity>

      <View style={styles.accelerometerContainer}>
        <Accelerometer hasStarted={hasStarted} />
      </View>

      <View style={styles.speedometerContainer}>
        <Speedometer speed={speed} />
      </View>
    </>
  );
}
