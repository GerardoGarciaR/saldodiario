import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AppText from './AppText';
import AppInput from './AppInput';
import AppButton from './AppButton';
import MoneyInput from './MoneyInput';
import DateSelector from './DateSelector';
import ZoomModal from './ZoomModal';
import InlineNotice from './InlineNotice';
import { colors } from '../theme';
import { addDays, toISODate } from '../utils/dates';
import { clearFinanceError, createPeriod } from '../store/financeSlice';

const parseCurrency = (value) => {
  const normalized = String(value ?? '')
    .replace(/[$,\s]/g, '')
    .trim();

  if (!normalized || normalized === '.') return 0;

  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : 0;
};

const formatCurrencyWhileTyping = (value) => {
  const source = String(value ?? '')
    .replace(/[$,\s]/g, '')
    .replace(/[^\d.]/g, '');

  if (!source) return '';

  const dotIndex = source.indexOf('.');
  let integerPart = dotIndex >= 0 ? source.slice(0, dotIndex) : source;
  let decimalPart = dotIndex >= 0
    ? source.slice(dotIndex + 1).replace(/\./g, '').slice(0, 2)
    : '';

  integerPart = integerPart.replace(/^0+(?=\d)/, '');
  if (!integerPart) integerPart = '0';

  const groupedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return `$${groupedInteger}${dotIndex >= 0 ? `.${decimalPart}` : ''}`;
};

const formatCurrencyFinal = (value) => {
  if (!String(value ?? '').trim()) return '';

  const amount = parseCurrency(value);

  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export default function NewPeriodModal({ visible, onClose }) {
  const dispatch = useDispatch();
  const saving = useSelector((state) => state.finance.saving);
  const error = useSelector((state) => state.finance.error);

  const today = toISODate();
  const [income, setIncome] = useState('');
  const [concept, setConcept] = useState('');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(addDays(today, 6));
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (visible) {
      const now = toISODate();
      setIncome('');
      setConcept('');
      setStartDate(now);
      setEndDate(addDays(now, 6));
      setLocalError('');
      dispatch(clearFinanceError());
    }
  }, [visible, dispatch]);

  const submit = async () => {
    setLocalError('');
    dispatch(clearFinanceError());

    if (!concept.trim()) {
      setLocalError('Escribe el concepto del ingreso inicial.');
      return;
    }
    const incomeAmount = parseCurrency(income);

    if (incomeAmount < 0) {
      setLocalError('El ingreso inicial no puede ser negativo.');
      return;
    }
    if (endDate < startDate) {
      setLocalError('La fecha final no puede ser anterior a la fecha inicial.');
      return;
    }

    const action = await dispatch(createPeriod({
      concepto: concept,
      ingreso_inicial: incomeAmount,
      fecha_inicio: startDate,
      fecha_fin: endDate,
    }));

    if (createPeriod.fulfilled.match(action)) onClose();
  };

  return (
    <ZoomModal visible={visible} onClose={onClose} maxWidth={600}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.heading}>
          <AppText weight="bold" style={styles.title}>Nueva semana / período</AppText>
          <AppText style={styles.subtitle}>
            Define el dinero con el que inicia este período. Después podrás ir descontando gastos o agregando ingresos.
          </AppText>
        </View>

        <MoneyInput
          label="Ingreso inicial"
          value={income}
          onChangeText={(value) => setIncome(formatCurrencyWhileTyping(value))}
          onBlur={() => setIncome((value) => formatCurrencyFinal(value))}
          placeholder="$0.00"
        />
        <AppInput
          label="Concepto del ingreso"
          value={concept}
          onChangeText={setConcept}
          placeholder="Ej. Pago de nómina"
        />
        <View style={styles.dateRow}>
          <View style={styles.dateCol}>
            <DateSelector label="Fecha inicial" value={startDate} onChange={setStartDate} />
          </View>
          <View style={styles.dateCol}>
            <DateSelector label="Fecha final" value={endDate} onChange={setEndDate} />
          </View>
        </View>

        {localError ? <InlineNotice>{localError}</InlineNotice> : null}
        {error ? <InlineNotice>{error}</InlineNotice> : null}

        <View style={styles.actions}>
          <AppButton title="Cancelar" variant="ghost" onPress={onClose} style={styles.action} />
          <AppButton title="Crear período" onPress={submit} loading={saving} style={styles.action} />
        </View>
      </ScrollView>
    </ZoomModal>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
    gap: 18,
  },
  heading: {
    gap: 6,
    marginBottom: 2,
  },
  title: {
    fontSize: 24,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  dateRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  dateCol: {
    flexGrow: 1,
    flexBasis: 220,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 4,
  },
  action: {
    minWidth: 150,
  },
});
