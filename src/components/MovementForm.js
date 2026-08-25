import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AppText from './AppText';
import AppInput from './AppInput';
import AppButton from './AppButton';
import MoneyInput from './MoneyInput';
import DateSelector from './DateSelector';
import InlineNotice from './InlineNotice';
import { colors, radius } from '../theme';
import { createMovement, clearFinanceError } from '../store/financeSlice';
import { toISODate } from '../utils/dates';
import { toNumber } from '../utils/money';

export default function MovementForm({ period }) {
  const dispatch = useDispatch();
  const saving = useSelector((state) => state.finance.saving);
  const error = useSelector((state) => state.finance.error);
  const [type, setType] = useState('gasto');
  const [amount, setAmount] = useState('');
  const [concept, setConcept] = useState('');
  const [date, setDate] = useState(toISODate());
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    const today = toISODate();
    const defaultDate = period?.fecha_inicio && period?.fecha_fin && today >= period.fecha_inicio && today <= period.fecha_fin
      ? today
      : (period?.fecha_inicio || today);

    setAmount('');
    setConcept('');
    setDate(defaultDate);
    setLocalError('');
    dispatch(clearFinanceError());
  }, [period?.id, period?.fecha_inicio, dispatch]);

  const submit = async () => {
    setLocalError('');
    dispatch(clearFinanceError());

    if (!concept.trim()) {
      setLocalError('Escribe el concepto del movimiento.');
      return;
    }
    if (toNumber(amount) <= 0) {
      setLocalError('El importe debe ser mayor a cero.');
      return;
    }
    if (date < period.fecha_inicio || date > period.fecha_fin) {
      setLocalError('La fecha debe estar dentro del período seleccionado.');
      return;
    }

    const action = await dispatch(createMovement({
      periodo_id: period.id,
      tipo: type,
      importe: toNumber(amount),
      concepto: concept,
      fecha: date,
    }));

    if (createMovement.fulfilled.match(action)) {
      setAmount('');
      setConcept('');
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.headingRow}>
        <View style={styles.headingCopy}>
          <AppText weight="bold" style={styles.title}>Registrar movimiento</AppText>
          <AppText style={styles.subtitle}>Agrega un gasto o un ingreso adicional.</AppText>
        </View>
        <View style={styles.segment}>
          {['gasto', 'ingreso'].map((item) => {
            const active = type === item;
            return (
              <Pressable
                key={item}
                onPress={() => setType(item)}
                style={[styles.segmentButton, active && styles.segmentActive]}
              >
                <AppText
                  weight={active ? 'semiBold' : 'regular'}
                  style={[styles.segmentText, active && styles.segmentTextActive]}
                >
                  {item === 'gasto' ? 'Gasto' : 'Ingreso'}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.formGrid}>
        <MoneyInput
          label="Importe"
          value={amount}
          onChangeText={setAmount}
        />
        <AppInput
          label="Concepto"
          value={concept}
          onChangeText={setConcept}
          placeholder={type === 'gasto' ? 'Ej. Supermercado' : 'Ej. Venta extra'}
        />
        <DateSelector label="Fecha" value={date} onChange={setDate} />
      </View>

      {localError ? <InlineNotice>{localError}</InlineNotice> : null}
      {error ? <InlineNotice>{error}</InlineNotice> : null}

      <AppButton
        title={type === 'gasto' ? 'Guardar gasto' : 'Guardar ingreso'}
        onPress={submit}
        loading={saving}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.xl,
    padding: 20,
    gap: 18,
  },
  headingRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },
  headingCopy: {
    gap: 4,
  },
  title: {
    fontSize: 20,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
  },
  segment: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  segmentButton: {
    minWidth: 84,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: colors.primary,
  },
  segmentText: {
    fontSize: 13,
  },
  segmentTextActive: {
    color: colors.white,
  },
  formGrid: {
    width: '100%',
    gap: 14,
  },
});
