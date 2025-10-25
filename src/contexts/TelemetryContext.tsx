import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react';
import { Alert } from 'react-native';
import {
  LocationObject,
  LocationSubscription,
  watchPositionAsync,
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from 'expo-location';
import { Accelerometer } from 'expo-sensors';

type TelemetryContextType = {
  location: LocationObject | null;
  speed: number;
  heading: number;
  hasStarted: boolean;
  acceleration: { x: number; y: number; z: number };
  magnitude: number;
  toggleWatch: () => void;
};

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

export const TelemetryProvider: FC<PropsWithChildren> = ({ children }) => {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [speed, setSpeed] = useState(0);
  const [heading, setHeading] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const [acceleration, setAcceleration] = useState({ x: 0, y: 0, z: 0 });
  const [magnitude, setMagnitude] = useState(0);

  const locationWatcherRef = useRef<LocationSubscription | null>(null);
  const accelerometerSubRef = useRef<any>(null);

  const checkLocationPermission = async () => {
    let { status } = await requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Não foi possível obter a localização.');
      return false;
    }
    return true;
  };

  const checkAccelerometerPermission = async () => {
    try {
      const { granted } = await Accelerometer.getPermissionsAsync();
      if (!granted) {
        const { granted: requestGranted } = await Accelerometer.requestPermissionsAsync();
        if (!requestGranted) {
          Alert.alert('Permissão negada', 'Não foi possível obter dados do acelerômetro.');
          return false;
        }
      }

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const getCurrentLocation = async () => {
    const hasPermission = await checkLocationPermission();
    if (!hasPermission) return;

    const location = await getCurrentPositionAsync({});
    userLocationChange(location);
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const userLocationChange = (event: LocationObject) => {
    setLocation(event);
    if (typeof event.coords.speed === 'number') setSpeed(event.coords.speed * 3.6);
    if (typeof event.coords.heading === 'number') setHeading(event.coords.heading);
  };

  const startWatchLocation = async () => {
    if (locationWatcherRef.current) return;

    const hasPermission = await checkLocationPermission();
    if (!hasPermission) return;

    const options = {
      accuracy: 6,
      distanceInterval: 1,
      timeInterval: 1000,
    };

    locationWatcherRef.current = await watchPositionAsync(options, userLocationChange);
  };

  const stopWatchLocation = () => {
    if (locationWatcherRef.current) {
      locationWatcherRef.current.remove();
      locationWatcherRef.current = null;
    }

    setSpeed(0);
  };

  const startAccelerometer = async () => {
    if (accelerometerSubRef.current) return;

    const hasPermission = await checkAccelerometerPermission();
    if (!hasPermission) return;

    accelerometerSubRef.current = Accelerometer.addListener(data => {
      setAcceleration(data);
      const mag = Math.max(0, Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2) - 1);
      setMagnitude(prev => (Math.abs(mag - prev) < 0.2 ? prev : mag));
    });

    Accelerometer.setUpdateInterval(300);
  };

  const stopAccelerometer = () => {
    if (accelerometerSubRef.current) {
      accelerometerSubRef.current.remove();
      accelerometerSubRef.current = null;
    }
  };

  const setWatch = (start: boolean) => {
    setHasStarted(start);

    if (start) {
      startWatchLocation();
      startAccelerometer();
      return;
    }

    stopWatchLocation();
    stopAccelerometer();
  };

  const toggleWatch = () => setWatch(!hasStarted);

  return (
    <TelemetryContext.Provider
      value={{ location, speed, heading, hasStarted, acceleration, magnitude, toggleWatch }}
    >
      {children}
    </TelemetryContext.Provider>
  );
};

export const useTelemetry = () => {
  const context = useContext(TelemetryContext);
  if (!context) throw new Error('useTelemetry must be used within a TelemetryProvider');
  return context;
};
