export function toNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;

  let normalized = String(value ?? '').trim();
  if (!normalized) return 0;

  normalized = normalized
    .replace(/\$/g, '')
    .replace(/\s/g, '');

  // Soporta tanto valores internos (1800.50) como la máscara visual
  // ($1,800.50). Si sólo existe coma, distingue decimal de separador de miles.
  if (normalized.includes('.') && normalized.includes(',')) {
    normalized = normalized.replace(/,/g, '');
  } else if (normalized.includes(',')) {
    const lastComma = normalized.lastIndexOf(',');
    const decimalsAfterComma = normalized.length - lastComma - 1;

    if (decimalsAfterComma >= 1 && decimalsAfterComma <= 2) {
      normalized = normalized.replace(/\./g, '').replace(',', '.');
    } else {
      normalized = normalized.replace(/,/g, '');
    }
  }

  normalized = normalized.replace(/[^0-9.-]/g, '');

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatMoney(value) {
  const amount = toNumber(value);
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Convierte cualquier texto proveniente de la máscara a un valor canónico.
 * Ejemplos:
 *   "$1,800.00" -> "1800.00"
 *   "$18,000.00" -> "18000.00"
 *   "1250.5" -> "1250.5"
 */
export function sanitizeMoneyInput(value) {
  const source = String(value ?? '')
    .replace(/\$/g, '')
    .replace(/,/g, '')
    .replace(/\s/g, '')
    .replace(/[^0-9.]/g, '');

  if (!source) return '';

  const firstDot = source.indexOf('.');
  const integerSource = firstDot >= 0 ? source.slice(0, firstDot) : source;

  // Si se borró el último dígito entero de "$1.00", permitimos dejar el campo vacío.
  if (!integerSource) return '';

  let integer = integerSource.replace(/^0+(?=\d)/, '');
  if (!integer) integer = '0';

  if (firstDot < 0) return integer;

  const decimals = source
    .slice(firstDot + 1)
    .replace(/\./g, '')
    .slice(0, 2);

  return `${integer}.${decimals}`;
}

/**
 * Valor visual del TextInput. Mantiene siempre dos decimales y separa miles.
 * El valor real que recibe el estado continúa siendo numérico/canónico.
 */
export function formatMoneyInput(value) {
  const raw = sanitizeMoneyInput(value);
  if (!raw) return '';

  const [integerRaw = '0', decimalsRaw = ''] = raw.split('.');
  const integer = integerRaw.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const decimals = decimalsRaw.padEnd(2, '0').slice(0, 2);

  return `$${integer}.${decimals}`;
}
