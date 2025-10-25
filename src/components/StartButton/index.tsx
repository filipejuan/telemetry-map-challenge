import { View, Text, TouchableOpacity } from 'react-native';

import { useTelemetry } from '@/contexts/TelemetryContext';

import { styles } from './styles';

export default function StartButton() {
  const { hasStarted, toggleWatch } = useTelemetry();

  return (
    <TouchableOpacity
      onPress={toggleWatch}
      style={[styles.container, { backgroundColor: hasStarted ? '#FF3B30' : '#34C759' }]}
    >
      <Text style={styles.text}>{hasStarted ? 'Parar' : 'Iniciar'}</Text>
    </TouchableOpacity>
  );
}
