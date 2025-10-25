import { View } from 'react-native';

import Map from '@/components/Map';
import Speedometer from '@/components/Speedometer';
import Accelerometer from '@/components/Accelerometer';
import StartButton from '@/components/StartButton';

import { TelemetryProvider } from '@/contexts/TelemetryContext';

import { styles } from './styles';

export default function Home() {
  return (
    <TelemetryProvider>
      <View style={styles.container}>
        <Map />

        <StartButton />

        <View style={styles.accelerometerContainer}>
          <Accelerometer />
        </View>

        <View style={styles.speedometerContainer}>
          <Speedometer />
        </View>
      </View>
    </TelemetryProvider>
  );
}
