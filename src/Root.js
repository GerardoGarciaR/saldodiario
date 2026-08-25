import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import SetupScreen from './screens/SetupScreen';
import ZoomInView from './components/ZoomInView';
import { isSupabaseConfigured, supabase } from './lib/supabase';
import { setAuthInitialized, setSession } from './store/authSlice';
import { clearFinance } from './store/financeSlice';
import { colors } from './theme';

export default function Root() {
  const dispatch = useDispatch();
  const { session, initialized } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      dispatch(setAuthInitialized(true));
      return undefined;
    }

    supabase.auth.getSession().then(({ data }) => {
      dispatch(setSession(data.session || null));
      dispatch(setAuthInitialized(true));
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      dispatch(setSession(nextSession || null));
      dispatch(setAuthInitialized(true));
      if (!nextSession) dispatch(clearFinance());
    });

    return () => subscription.subscription.unsubscribe();
  }, [dispatch]);

  if (!isSupabaseConfigured) return <SetupScreen />;

  if (!initialized) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ZoomInView transitionKey={session ? 'dashboard' : 'login'} style={styles.full}>
      {session ? <DashboardScreen /> : <LoginScreen />}
    </ZoomInView>
  );
}

const styles = StyleSheet.create({
  full: {
    flex: 1,
    minHeight: '100%',
  },
  loading: {
    flex: 1,
    minHeight: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
