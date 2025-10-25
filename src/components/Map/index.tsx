import { useRef, useEffect } from 'react';
import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { PROVIDER_GOOGLE, Camera, Marker } from 'react-native-maps';

import { useTelemetry } from '@/contexts/TelemetryContext';

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
  const { location, heading, hasStarted } = useTelemetry();

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (location == null) return;
    console.log('location', location);
    const { coords } = location;
    const camera: Camera = {
      center: {
        latitude: coords.latitude,
        longitude: coords.longitude,
      },
      pitch: 0,
      heading: 0,
    };

    mapRef.current?.animateCamera(camera, { duration: 800 });
  }, [location]);

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

      {!hasStarted && <View style={styles.disabledView}></View>}
    </>
  );
}
