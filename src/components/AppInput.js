import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import AppText from './AppText';
import { colors, fonts, radius } from '../theme';

export default function AppInput({ label, style, inputStyle, ...props }) {
  return (
    <View style={[styles.group, style]}>
      {label ? <AppText style={styles.label} weight="semiBold">{label}</AppText> : null}
      <TextInput
        {...props}
        placeholderTextColor={colors.textMuted}
        style={[styles.input, inputStyle]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    width: '100%',
    gap: 8,
  },
  label: {
    fontSize: 14,
  },
  input: {
    width: '100%',
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
    outlineStyle: 'none',
  },
});
