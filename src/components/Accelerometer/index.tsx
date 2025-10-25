import { useState, useRef, useEffect } from 'react';
import { View, Text, Alert, ActivityIndicator } from 'react-native';
import { Accelerometer as Accel } from 'expo-sensors';

import { styles } from './styles';

type PermissionsStatus = 'granted' | 'denied' | 'undetermined';
type Props = {
  hasStarted: boolean;
};

export default function Accelerometer({ hasStarted }: Props) {
  const [acceleration, setAcceleration] = useState({ x: 0, y: 0, z: 0 });
  const [magnitude, setMagnitude] = useState(0);
  const [permission, setPermission] = useState<PermissionsStatus>('undetermined');

  const subscriptionRef = useRef<any>(null);

  const checkPermission = async () => {
    try {
      const { granted } = await Accel.getPermissionsAsync();
      if (!granted) {
        const { granted: requestGranted } = await Accel.requestPermissionsAsync();
        setPermission(requestGranted ? 'granted' : 'denied');
        if (!requestGranted)
          Alert.alert('Permissão negada', 'Não foi possível acessar o acelerômetro.');
      } else {
        setPermission('granted');
      }
    } catch (error) {
      console.error('Erro ao checar permissão do acelerômetro', error);
      Alert.alert('Erro', 'Não foi possível checar a permissão do acelerômetro.');
      setPermission('denied');
    }
  };

  const startAccelerometer = () => {
    if (permission !== 'granted' || subscriptionRef.current) return;

    const sub = Accel.addListener(data => {
      setAcceleration(data);
      const mag = Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2) - 1;
      setMagnitude(prev => (Math.abs(mag - prev) < 0.2 ? prev : mag));
    });

    Accel.setUpdateInterval(300);
    subscriptionRef.current = sub;
  };

  const stopAccelerometer = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }
  };

  useEffect(() => {
    checkPermission();
  }, []);

  useEffect(() => {
    if (hasStarted) {
      startAccelerometer();
    } else {
      stopAccelerometer();
    }

    return () => {
      stopAccelerometer();
    };
  }, [hasStarted]);

  return (
    <View style={styles.container}>
      {permission == 'undetermined' && <ActivityIndicator size="small" color="#000" />}
      {permission == 'denied' && (
        <Text style={styles.text}>Permissão para acelerômetro negada!</Text>
      )}
      {permission == 'granted' && (
        <>
          <Text style={styles.text}>{magnitude.toFixed(1)} m/s²</Text>
          <Text style={styles.details}>
            X {acceleration.x.toFixed(2)} | Y {acceleration.y.toFixed(2)} | Z{' '}
            {acceleration.z.toFixed(2)}
          </Text>
        </>
      )}
    </View>
  );
}
