import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import AppText from './AppText';
import { colors, radius } from '../theme';
import { formatDate } from '../utils/dates';
import { formatMoney } from '../utils/money';

export default function MovementCard({ movement, onDelete }) {
  const isIncome = movement.tipo === 'ingreso';
  const tone = isIncome ? colors.income : colors.expense;
  const soft = isIncome ? colors.incomeSoft : colors.expenseSoft;

  return (
    <View style={styles.card}>
      <View style={[styles.signBox, { backgroundColor: soft }]}>
        <AppText weight="bold" style={[styles.sign, { color: tone }]}>{isIncome ? '+' : '−'}</AppText>
      </View>
      <View style={styles.content}>
        <AppText weight="semiBold" style={styles.concept}>{movement.concepto}</AppText>
        <AppText style={styles.date}>{formatDate(movement.fecha)}</AppText>
      </View>
      <View style={styles.amountBox}>
        <AppText weight="bold" style={[styles.amount, { color: tone }]}>
          {isIncome ? '+' : '−'}{formatMoney(movement.importe)}
        </AppText>
        <Pressable onPress={() => onDelete(movement)} style={styles.deleteButton}>
          <AppText style={styles.deleteText}>Eliminar</AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 14,
  },
  signBox: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sign: {
    fontSize: 23,
  },
  content: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  concept: {
    fontSize: 15,
  },
  date: {
    fontSize: 12,
    color: colors.textMuted,
  },
  amountBox: {
    alignItems: 'flex-end',
    gap: 6,
  },
  amount: {
    fontSize: 15,
  },
  deleteButton: {
    paddingVertical: 2,
    paddingLeft: 8,
  },
  deleteText: {
    fontSize: 11,
    color: colors.textMuted,
  },
});
