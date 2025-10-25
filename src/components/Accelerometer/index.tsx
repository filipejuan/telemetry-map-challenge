import { View, Text } from 'react-native';

import { useTelemetry } from '@/contexts/TelemetryContext';

import { styles } from './styles';

export default function Accelerometer() {
  const { acceleration, magnitude } = useTelemetry();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{magnitude.toFixed(1)} m/s²</Text>
      <Text style={styles.details}>
        X {acceleration.x.toFixed(2)} | Y {acceleration.y.toFixed(2)} | Z{' '}
        {acceleration.z.toFixed(2)}
      </Text>
    </View>
  );
}
