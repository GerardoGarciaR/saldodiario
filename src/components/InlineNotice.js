import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from './AppText';
import { colors, radius } from '../theme';

export default function InlineNotice({ children, type = 'error', style }) {
  const isWarning = type === 'warning';
  const backgroundColor = isWarning ? colors.warningSoft : colors.expenseSoft;
  const textColor = isWarning ? colors.warning : colors.expense;

  return (
    <View style={[styles.box, { backgroundColor }, style]}>
      <AppText color={textColor} style={styles.text}>{children}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
});
