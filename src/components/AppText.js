import React from 'react';
import { Text } from 'react-native';
import { colors, fonts } from '../theme';

export default function AppText({
  children,
  style,
  weight = 'regular',
  color = colors.text,
  ...props
}) {
  const fontFamily =
    weight === 'bold' ? fonts.bold :
    weight === 'semiBold' ? fonts.semiBold :
    fonts.regular;

  return (
    <Text
      {...props}
      style={[{ fontFamily, color, fontSize: 16 }, style]}
    >
      {children}
    </Text>
  );
}
