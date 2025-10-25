import { View, Text } from 'react-native';

import { useTelemetry } from '@/contexts/TelemetryContext';

import { styles } from './styles';

export default function Speedometer() {
  const { speed, hasStarted } = useTelemetry();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{hasStarted ? speed.toFixed(0) : 0}</Text>
      <Text style={styles.text}>km/h</Text>
    </View>
  );
}
