import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import AppText from './AppText';
import { colors, radius } from '../theme';

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  compact = false,
}) {
  const isDisabled = disabled || loading;
  const palette = getPalette(variant);

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        compact && styles.compact,
        { backgroundColor: palette.background, borderColor: palette.border },
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={palette.text} />
      ) : (
        <AppText weight="semiBold" style={[styles.text, { color: palette.text }]}>
          {title}
        </AppText>
      )}
    </Pressable>
  );
}

function getPalette(variant) {
  if (variant === 'secondary') {
    return { background: colors.primarySoft, border: colors.primarySoft, text: colors.primary };
  }
  if (variant === 'danger') {
    return { background: colors.expenseSoft, border: colors.expenseSoft, text: colors.expense };
  }
  if (variant === 'ghost') {
    return { background: 'transparent', border: colors.border, text: colors.text };
  }
  return { background: colors.primary, border: colors.primary, text: colors.white };
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  compact: {
    minHeight: 40,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  text: {
    fontSize: 15,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.55,
  },
});
