import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import AppText from '../components/AppText';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import InlineNotice from '../components/InlineNotice';
import { supabase } from '../lib/supabase';
import { colors, radius, shadow } from '../theme';

export default function LoginScreen() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');
    setMessage('');

    if (!email.trim() || !password) {
      setError('Escribe tu correo y contraseña.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (loginError) throw loginError;
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
        if (signUpError) throw signUpError;
        if (!data.session) {
          setMessage('Cuenta creada. Revisa tu correo si Supabase tiene activa la confirmación por email.');
        }
      }
    } catch (err) {
      setError(err.message || 'No fue posible completar el acceso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.brandBlock}>
        <View style={styles.logoMark}>
          <AppText weight="bold" color={colors.white} style={styles.logoText}>S</AppText>
        </View>
        <AppText weight="bold" style={styles.brand}>Saldo Diario</AppText>
        <AppText style={styles.tagline}>Tus ingresos, gastos y saldo en un solo lugar.</AppText>
      </View>

      <View style={[styles.card, shadow]}>
        <View style={styles.cardHeader}>
          <AppText weight="bold" style={styles.title}>
            {mode === 'login' ? 'Bienvenido' : 'Crear cuenta'}
          </AppText>
          <AppText style={styles.subtitle}>
            {mode === 'login'
              ? 'Ingresa para consultar tus períodos y movimientos.'
              : 'Crea una cuenta para mantener tus datos separados y protegidos.'}
          </AppText>
        </View>

        <AppInput
          label="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          inputMode="email"
          placeholder="tu@correo.com"
        />
        <AppInput
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Mínimo 6 caracteres"
        />

        {error ? <InlineNotice>{error}</InlineNotice> : null}
        {message ? <InlineNotice type="warning">{message}</InlineNotice> : null}

        <AppButton
          title={mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          onPress={submit}
          loading={loading}
        />

        <Pressable
          onPress={() => {
            setMode(mode === 'login' ? 'signup' : 'login');
            setError('');
            setMessage('');
          }}
          style={styles.modeLink}
        >
          <AppText style={styles.modeText}>
            {mode === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
            <AppText weight="semiBold" color={colors.primary}>
              {mode === 'login' ? 'Crear cuenta' : 'Iniciar sesión'}
            </AppText>
          </AppText>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 34,
    gap: 28,
  },
  brandBlock: {
    alignItems: 'center',
    gap: 8,
  },
  logoMark: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  logoText: {
    fontSize: 28,
  },
  brand: {
    fontSize: 28,
  },
  tagline: {
    color: colors.textMuted,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 460,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    padding: 26,
    gap: 18,
  },
  cardHeader: {
    gap: 6,
    marginBottom: 2,
  },
  title: {
    fontSize: 25,
  },
  subtitle: {
    color: colors.textMuted,
    lineHeight: 21,
    fontSize: 14,
  },
  modeLink: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  modeText: {
    fontSize: 14,
  },
});
