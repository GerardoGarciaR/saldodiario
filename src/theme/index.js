import { Platform } from 'react-native';

export const colors = {
  background: '#F5F7FB',
  surface: '#FFFFFF',
  surfaceMuted: '#F8FAFD',
  text: '#172033',
  textMuted: '#78849A',
  border: '#E4E9F2',
  primary: '#5B5CE2',
  primaryDark: '#494ACB',
  primarySoft: '#EEEEFF',
  income: '#159A72',
  incomeSoft: '#EAF8F3',
  expense: '#E15B64',
  expenseSoft: '#FFF0F1',
  warning: '#B7791F',
  warningSoft: '#FFF7E6',
  white: '#FFFFFF',
  overlay: 'rgba(16, 24, 40, 0.36)',
};

export const fonts = {
  regular: 'Inter-Regular',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 22,
  xl: 30,
};

export const shadow = Platform.select({
  web: {
    boxShadow: '0 14px 40px rgba(34, 48, 74, 0.10)',
  },
  default: {
    shadowColor: '#1E2A44',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 18,
    elevation: 3,
  },
});
