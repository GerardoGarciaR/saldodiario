import React, { useMemo, useState } from 'react';
import { Platform } from 'react-native';
import AppInput from './AppInput';
import { formatMoneyInput, sanitizeMoneyInput } from '../utils/money';

function isCoarsePointerWeb() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return false;

  try {
    return window.matchMedia?.('(pointer: coarse)')?.matches === true;
  } catch {
    return false;
  }
}

function formatMoneyWhileEditing(value) {
  const raw = sanitizeMoneyInput(value);
  if (!raw) return '';

  const hasDecimalPoint = raw.includes('.');
  const [integerRaw = '0', decimalsRaw = ''] = raw.split('.');

  const integer = integerRaw.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (!hasDecimalPoint) return `$${integer}`;

  return `$${integer}.${decimalsRaw.slice(0, 2)}`;
}

export default function MoneyInput({
  value,
  onChangeText,
  onFocus,
  onBlur,
  ...props
}) {
  const [focused, setFocused] = useState(false);

  // Safari/Chrome en iPhone (React Native Web) no manejan de forma estable
  // un TextInput controlado que además fuerza `selection` en cada render.
  // En dispositivos táctiles dejamos que el cursor sea completamente nativo:
  // durante la edición mostramos "$1,800" / "$1,800.5" y al salir "$1,800.00".
  const mobileWeb = useMemo(() => isCoarsePointerWeb(), []);

  const displayValue = useMemo(() => {
    if (mobileWeb && focused) {
      return formatMoneyWhileEditing(value);
    }

    return formatMoneyInput(value);
  }, [value, focused, mobileWeb]);

  const handleFocus = (event) => {
    setFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event) => {
    setFocused(false);
    onBlur?.(event);
  };

  return (
    <AppInput
      {...props}
      value={displayValue}
      onChangeText={(text) => onChangeText?.(sanitizeMoneyInput(text))}
      onFocus={handleFocus}
      onBlur={handleBlur}
      keyboardType="decimal-pad"
      inputMode="decimal"
      placeholder="$0.00"
    />
  );
}
