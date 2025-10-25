import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
  accelerometerContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 82,
    left: 0,
    right: 0,
  },
  speedometerContainer: {
    position: 'absolute',
    bottom: 100,
    right: 30,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 100,
    left: 30,
  },
});
