import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '../components/AppText';
import { colors, radius, shadow } from '../theme';

export default function SetupScreen() {
  return (
    <View style={styles.page}>
      <View style={[styles.card, shadow]}>
        <View style={styles.badge}>
          <AppText weight="bold" color={colors.primary}>SUPABASE</AppText>
        </View>
        <AppText weight="bold" style={styles.title}>Falta conectar la base de datos</AppText>
        <AppText style={styles.copy}>
          Copia .env.example como .env y coloca EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY.
        </AppText>
        <AppText style={styles.copy}>
          Después ejecuta el archivo supabase/schema.sql en el SQL Editor de tu proyecto nuevo de Supabase.
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 560,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    padding: 28,
    gap: 14,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },
  title: {
    fontSize: 27,
  },
  copy: {
    color: colors.textMuted,
    lineHeight: 23,
  },
});
