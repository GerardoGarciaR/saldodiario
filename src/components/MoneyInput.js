import React from 'react';
import AppInput from './AppInput';
import { sanitizeMoneyInput } from '../utils/money';

export default function MoneyInput({ value, onChangeText, ...props }) {
  return (
    <AppInput
      {...props}
      value={value}
      onChangeText={(text) => onChangeText(sanitizeMoneyInput(text))}
      keyboardType="decimal-pad"
      inputMode="decimal"
      placeholder="0.00"
    />
  );
}
