import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
  disabledView: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
