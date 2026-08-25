import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import AppText from './AppText';
import { colors, radius } from '../theme';
import { formatDateRange } from '../utils/dates';
import { formatMoney } from '../utils/money';

export default function PeriodCard({ period, balance, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.topRow}>
        <AppText weight="semiBold" style={styles.concept} numberOfLines={1}>
          {period.concepto}
        </AppText>
        {selected ? <View style={styles.dot} /> : null}
      </View>
      <AppText style={styles.range}>{formatDateRange(period.fecha_inicio, period.fecha_fin)}</AppText>
      <View style={styles.balanceRow}>
        <AppText style={styles.balanceLabel}>Saldo</AppText>
        <AppText weight="bold" style={[styles.balance, balance < 0 && styles.negative]}>
          {formatMoney(balance)}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 16,
    gap: 8,
  },
  selected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  pressed: {
    transform: [{ scale: 0.99 }],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  concept: {
    flex: 1,
    fontSize: 16,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 9,
    backgroundColor: colors.primary,
  },
  range: {
    fontSize: 12,
    color: colors.textMuted,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
  },
  balanceLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  balance: {
    fontSize: 17,
    color: colors.income,
  },
  negative: {
    color: colors.expense,
  },
});
