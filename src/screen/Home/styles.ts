import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
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
});
