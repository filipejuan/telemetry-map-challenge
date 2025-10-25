import { View, Text } from 'react-native';

import { styles } from './styles';

type Props = {
  speed: number;
};

export default function Speedometer({ speed }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{speed.toFixed(0)}</Text>
      <Text style={styles.text}>km/h</Text>
    </View>
  );
}
