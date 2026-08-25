import React, { useEffect, useRef } from 'react';
import { Animated, Platform } from 'react-native';

export default function ZoomInView({ children, style, transitionKey }) {
  const scale = useRef(new Animated.Value(0.965)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    scale.setValue(0.965);
    opacity.setValue(0);

    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        damping: 16,
        stiffness: 190,
        mass: 0.7,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 190,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  }, [transitionKey, opacity, scale]);

  return (
    <Animated.View style={[style, { opacity, transform: [{ scale }] }]}>
      {children}
    </Animated.View>
  );
}
