import { View, Text } from 'react-native';

import { styles } from './styles';

type Props = {
  hasStarted: boolean;
};

export default function StartButton({ hasStarted }: Props) {
  return (
    <View style={[styles.container, { backgroundColor: hasStarted ? '#FF3B30' : '#34C759' }]}>
      <Text style={styles.text}>{hasStarted ? 'Parar' : 'Iniciar'}</Text>
    </View>
  );
}
