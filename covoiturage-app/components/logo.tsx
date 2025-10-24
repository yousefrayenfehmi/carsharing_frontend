import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface LogoProps {
  size?: number;
}

export function Logo({ size = 60 }: LogoProps) {
  return (
    <View style={styles.logo}>
      <Image
        source={require('@/assets/images/fitriqi.png')}
        style={[styles.logoImage, { width: size, height: size }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    // La taille est appliquée dynamiquement via le prop size
  },
});

