import React from 'react';
import LottieView from 'lottie-react-native';
import { View, StyleSheet } from 'react-native';

export default function ConfettiAnimation({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <View style={styles.overlay} pointerEvents="none">
      <LottieView
        source={require('../assets/lottie/confetti.json')}
        autoPlay
        loop={false}
        style={styles.lottie}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 400,
    height: 400,
  },
});
