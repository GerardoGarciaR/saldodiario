import React, { useEffect, useMemo, useState } from 'react';
import AppInput from './AppInput';
import { formatMoneyInput, sanitizeMoneyInput } from '../utils/money';

export default function MoneyInput({
  value,
  onChangeText,
  onFocus,
  onBlur,
  onSelectionChange,
  ...props
}) {
  const displayValue = useMemo(() => formatMoneyInput(value), [value]);
  const [focused, setFocused] = useState(false);
  const [selection, setSelection] = useState(undefined);
  const [editingDecimals, setEditingDecimals] = useState(false);

  // Para captura normal de pesos mantenemos el cursor justo antes de los centavos.
  // Así: $1,800.00 + "0" => $18,000.00 (y no altera los .00).
  useEffect(() => {
    if (!focused || !displayValue || editingDecimals) return;

    const decimalIndex = displayValue.indexOf('.');
    if (decimalIndex >= 0) {
      setSelection({ start: decimalIndex, end: decimalIndex });
    }
  }, [displayValue, focused, editingDecimals]);

  const handleFocus = (event) => {
    setFocused(true);
    setEditingDecimals(false);

    const decimalIndex = displayValue.indexOf('.');
    if (decimalIndex >= 0) {
      setSelection({ start: decimalIndex, end: decimalIndex });
    }

    onFocus?.(event);
  };

  const handleBlur = (event) => {
    setFocused(false);
    setEditingDecimals(false);
    setSelection(undefined);
    onBlur?.(event);
  };

  const handleSelectionChange = (event) => {
    const nextSelection = event.nativeEvent?.selection;
    if (nextSelection) {
      setSelection(nextSelection);

      const decimalIndex = displayValue.indexOf('.');
      setEditingDecimals(decimalIndex >= 0 && nextSelection.start > decimalIndex);
    }

    onSelectionChange?.(event);
  };

  return (
    <AppInput
      {...props}
      value={displayValue}
      onChangeText={(text) => onChangeText?.(sanitizeMoneyInput(text))}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onSelectionChange={handleSelectionChange}
      selection={focused ? selection : undefined}
      keyboardType="decimal-pad"
      inputMode="decimal"
      placeholder="$0.00"
    />
  );
}
