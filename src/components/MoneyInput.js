import React, { useMemo } from 'react';
import AppInput from './AppInput';
import { toNumber } from '../utils/money';

const MAX_CENT_DIGITS = 14;

function digitsToCanonicalMoney(digits) {
  const cleanDigits = String(digits ?? '')
    .replace(/\D/g, '')
    .replace(/^0+(?=\d)/, '')
    .slice(-MAX_CENT_DIGITS);

  if (!cleanDigits) return '';

  const padded = cleanDigits.padStart(3, '0');
  const integerPart = padded.slice(0, -2).replace(/^0+(?=\d)/, '') || '0';
  const decimals = padded.slice(-2);

  return `${integerPart}.${decimals}`;
}

function formatCanonicalMoney(value) {
  const amount = toNumber(value);

  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function MoneyInput({
  value,
  onChangeText,
  ...props
}) {
  const displayValue = useMemo(
    () => formatCanonicalMoney(value),
    [value]
  );

  const handleChangeText = (text) => {
    /*
     * Máscara tipo cajero automático:
     *
     *   tecla 1      -> $0.01
     *   tecla 0      -> $0.10
     *   tecla 0      -> $1.00
     *   tecla 0      -> $10.00
     *   tecla 0      -> $100.00
     *   tecla 0      -> $1,000.00
     *
     * Para borrar ocurre lo mismo en sentido inverso:
     *   $1,000.00 -> $100.00 -> $10.00 -> $1.00 -> $0.10 -> $0.01 -> $0.00
     *
     * No controlamos manualmente la posición del cursor. Esto evita el bloqueo
     * que React Native Web/WebKit producía en Safari y Chrome de iPhone.
     *
     * Funciona tanto si el navegador entrega el texto completo ya formateado
     * ("$1,000.000") como si entrega sólo lo recién escrito ("1000"):
     * tomamos únicamente los dígitos y los interpretamos siempre como centavos.
     */
    const digits = String(text ?? '').replace(/\D/g, '');
    const canonical = digitsToCanonicalMoney(digits);

    onChangeText?.(canonical);
  };

  return (
    <AppInput
      {...props}
      value={displayValue}
      onChangeText={handleChangeText}
      keyboardType="number-pad"
      inputMode="numeric"
      placeholder="$0.00"
    />
  );
}
