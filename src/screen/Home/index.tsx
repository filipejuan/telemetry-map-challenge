import { View, Text } from 'react-native';

import Map from '@/components/Map';

import { styles } from './styles';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Map />
    </View>
  );
}
