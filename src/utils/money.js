export function toNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const normalized = String(value ?? '')
    .replace(/\s/g, '')
    .replace(/,/g, '.')
    .replace(/[^0-9.-]/g, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatMoney(value) {
  const amount = toNumber(value);
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function sanitizeMoneyInput(value) {
  let cleaned = String(value ?? '')
    .replace(/,/g, '.')
    .replace(/[^0-9.]/g, '');

  const firstDot = cleaned.indexOf('.');
  if (firstDot >= 0) {
    cleaned = cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, '');
    const [integer, decimals = ''] = cleaned.split('.');
    cleaned = `${integer}.${decimals.slice(0, 2)}`;
  }

  return cleaned;
}
