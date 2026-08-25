import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from './AppText';
import { colors, radius } from '../theme';
import { formatMoney } from '../utils/money';

export default function SummaryCard({ label, value, tone = 'neutral', prominent = false }) {
  const toneData = {
    neutral: { bg: colors.surfaceMuted, color: colors.text },
    income: { bg: colors.incomeSoft, color: colors.income },
    expense: { bg: colors.expenseSoft, color: colors.expense },
    primary: { bg: colors.primary, color: colors.white },
  }[tone];

  return (
    <View style={[styles.card, { backgroundColor: toneData.bg }, prominent && styles.prominent]}>
      <AppText style={[styles.label, { color: prominent ? colors.white : colors.textMuted }]}>
        {label}
      </AppText>
      <AppText
        weight="bold"
        style={[styles.value, prominent && styles.prominentValue, { color: toneData.color }]}
        numberOfLines={1}
      >
        {formatMoney(value)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    flexBasis: 150,
    minWidth: 140,
    borderRadius: radius.lg,
    padding: 16,
    gap: 6,
  },
  prominent: {
    flexBasis: '100%',
    minHeight: 116,
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  label: {
    fontSize: 13,
  },
  value: {
    fontSize: 21,
  },
  prominentValue: {
    fontSize: 34,
    letterSpacing: -0.6,
  },
});
