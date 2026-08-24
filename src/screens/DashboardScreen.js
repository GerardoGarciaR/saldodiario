import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import PeriodCard from '../components/PeriodCard';
import SummaryCard from '../components/SummaryCard';
import MovementForm from '../components/MovementForm';
import MovementCard from '../components/MovementCard';
import NewPeriodModal from '../components/NewPeriodModal';
import ConfirmModal from '../components/ConfirmModal';
import ZoomInView from '../components/ZoomInView';
import InlineNotice from '../components/InlineNotice';
import { supabase } from '../lib/supabase';
import { colors, radius, shadow } from '../theme';
import {
  clearFinance,
  deleteMovement,
  deletePeriod,
  loadFinanceData,
  selectPeriod,
} from '../store/financeSlice';
import { formatDateRange } from '../utils/dates';
import { toNumber } from '../utils/money';

function totalsForPeriod(period, movements) {
  const base = toNumber(period?.ingreso_inicial);
  let income = 0;
  let expenses = 0;

  movements.forEach((movement) => {
    if (movement.tipo === 'ingreso') income += toNumber(movement.importe);
    else expenses += toNumber(movement.importe);
  });

  return {
    base,
    income,
    expenses,
    balance: base + income - expenses,
  };
}

export default function DashboardScreen() {
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 980;
  const session = useSelector((state) => state.auth.session);
  const { periods, movements, selectedPeriodId, loading, saving, error } = useSelector((state) => state.finance);
  const [newPeriodOpen, setNewPeriodOpen] = useState(false);
  const [movementToDelete, setMovementToDelete] = useState(null);
  const [periodDeleteOpen, setPeriodDeleteOpen] = useState(false);

  useEffect(() => {
    if (session?.user?.id) dispatch(loadFinanceData());
  }, [session?.user?.id, dispatch]);

  const selectedPeriod = periods.find((period) => period.id === selectedPeriodId) || null;
  const selectedMovements = useMemo(
    () => movements.filter((movement) => movement.periodo_id === selectedPeriodId),
    [movements, selectedPeriodId]
  );
  const selectedTotals = useMemo(
    () => totalsForPeriod(selectedPeriod, selectedMovements),
    [selectedPeriod, selectedMovements]
  );

  const balanceMap = useMemo(() => {
    const map = {};
    periods.forEach((period) => {
      const periodMovements = movements.filter((movement) => movement.periodo_id === period.id);
      map[period.id] = totalsForPeriod(period, periodMovements).balance;
    });
    return map;
  }, [periods, movements]);

  const signOut = async () => {
    await supabase.auth.signOut();
    dispatch(clearFinance());
  };

  const confirmDeleteMovement = async () => {
    if (!movementToDelete) return;
    const action = await dispatch(deleteMovement(movementToDelete.id));
    if (deleteMovement.fulfilled.match(action)) setMovementToDelete(null);
  };

  const confirmDeletePeriod = async () => {
    if (!selectedPeriod) return;
    const action = await dispatch(deletePeriod(selectedPeriod.id));
    if (deletePeriod.fulfilled.match(action)) setPeriodDeleteOpen(false);
  };

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.logoMark}>
            <AppText weight="bold" color={colors.white} style={styles.logoText}>S</AppText>
          </View>
          <View>
            <AppText weight="bold" style={styles.brand}>Saldo Diario</AppText>
            <AppText style={styles.headerSub}>Control personal de ingresos y gastos</AppText>
          </View>
        </View>
        <View style={styles.userRow}>
          <View style={styles.userPill}>
            <AppText style={styles.userEmail} numberOfLines={1}>{session?.user?.email || 'Usuario'}</AppText>
          </View>
          <AppButton title="Cerrar sesión" variant="ghost" compact onPress={signOut} />
        </View>
      </View>

      <View style={[styles.body, isDesktop ? styles.bodyDesktop : styles.bodyMobile]}>
        <View style={[styles.sidebar, shadow, isDesktop ? styles.sidebarDesktop : styles.sidebarMobile]}>
          <View style={styles.sidebarHeader}>
            <View>
              <AppText weight="bold" style={styles.sidebarTitle}>Semanas y períodos</AppText>
              <AppText style={styles.sidebarSubtitle}>{periods.length} guardado{periods.length === 1 ? '' : 's'}</AppText>
            </View>
            <AppButton title="+ Nuevo" compact onPress={() => setNewPeriodOpen(true)} />
          </View>

          {loading ? (
            <View style={styles.loadingArea}>
              <ActivityIndicator size="large" color={colors.primary} />
              <AppText style={styles.loadingText}>Cargando movimientos…</AppText>
            </View>
          ) : periods.length === 0 ? (
            <View style={styles.emptySidebar}>
              <AppText weight="semiBold" style={styles.emptyTitle}>Todavía no hay períodos</AppText>
              <AppText style={styles.emptyCopy}>
                Crea tu primera semana e indica el ingreso con el que inicia.
              </AppText>
              <AppButton title="Crear primer período" onPress={() => setNewPeriodOpen(true)} />
            </View>
          ) : (
            <ScrollView
              style={styles.periodScroll}
              contentContainerStyle={styles.periodList}
              showsVerticalScrollIndicator={false}
            >
              {periods.map((period) => (
                <PeriodCard
                  key={period.id}
                  period={period}
                  balance={balanceMap[period.id] || 0}
                  selected={period.id === selectedPeriodId}
                  onPress={() => dispatch(selectPeriod(period.id))}
                />
              ))}
            </ScrollView>
          )}
        </View>

        <View style={[styles.mainShell, isDesktop ? styles.mainDesktop : styles.mainMobile]}>
          {!selectedPeriod ? (
            <View style={[styles.welcomeCard, shadow]}>
              <AppText weight="bold" style={styles.welcomeTitle}>Tu control empieza aquí</AppText>
              <AppText style={styles.welcomeCopy}>
                Crea una semana o período, registra el ingreso inicial y después agrega cada gasto o ingreso adicional. El saldo se actualizará automáticamente.
              </AppText>
              <AppButton title="Crear período" onPress={() => setNewPeriodOpen(true)} style={styles.welcomeButton} />
            </View>
          ) : (
            <ScrollView
              style={styles.mainScroll}
              contentContainerStyle={styles.mainContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <ZoomInView transitionKey={selectedPeriod.id} style={styles.zoomContent}>
                <View style={styles.periodHeading}>
                  <View style={styles.periodHeadingCopy}>
                    <AppText style={styles.eyebrow} weight="semiBold">PERÍODO ACTIVO</AppText>
                    <AppText weight="bold" style={styles.periodTitle}>{selectedPeriod.concepto}</AppText>
                    <AppText style={styles.periodRange}>
                      {formatDateRange(selectedPeriod.fecha_inicio, selectedPeriod.fecha_fin)}
                    </AppText>
                  </View>
                  <Pressable onPress={() => setPeriodDeleteOpen(true)} style={styles.deletePeriodButton}>
                    <AppText style={styles.deletePeriodText}>Eliminar período</AppText>
                  </Pressable>
                </View>

                <View style={styles.summaryGrid}>
                  <SummaryCard label="Ingreso inicial" value={selectedTotals.base} tone="neutral" />
                  <SummaryCard label="Ingresos adicionales" value={selectedTotals.income} tone="income" />
                  <SummaryCard label="Gastos" value={selectedTotals.expenses} tone="expense" />
                  <SummaryCard label="Saldo" value={selectedTotals.balance} tone="primary" prominent />
                </View>

                {error ? <InlineNotice>{error}</InlineNotice> : null}

                <MovementForm period={selectedPeriod} />

                <View style={styles.movementsSection}>
                  <View style={styles.movementsHeader}>
                    <View>
                      <AppText weight="bold" style={styles.movementsTitle}>Movimientos</AppText>
                      <AppText style={styles.movementsSubtitle}>
                        {selectedMovements.length} movimiento{selectedMovements.length === 1 ? '' : 's'} en este período
                      </AppText>
                    </View>
                  </View>

                  {selectedMovements.length === 0 ? (
                    <View style={styles.emptyMovements}>
                      <AppText weight="semiBold" style={styles.emptyTitle}>Aún no hay gastos ni ingresos adicionales</AppText>
                      <AppText style={styles.emptyCopy}>
                        Usa el formulario de arriba y cada movimiento aparecerá aquí.
                      </AppText>
                    </View>
                  ) : (
                    <View style={styles.movementList}>
                      {selectedMovements.map((movement) => (
                        <MovementCard
                          key={movement.id}
                          movement={movement}
                          onDelete={setMovementToDelete}
                        />
                      ))}
                    </View>
                  )}
                </View>
              </ZoomInView>
            </ScrollView>
          )}
        </View>
      </View>

      <NewPeriodModal visible={newPeriodOpen} onClose={() => setNewPeriodOpen(false)} />

      <ConfirmModal
        visible={Boolean(movementToDelete)}
        title="Eliminar movimiento"
        message={movementToDelete ? `Se eliminará “${movementToDelete.concepto}”. El saldo se recalculará automáticamente.` : ''}
        onCancel={() => setMovementToDelete(null)}
        onConfirm={confirmDeleteMovement}
        loading={saving}
      />

      <ConfirmModal
        visible={periodDeleteOpen}
        title="Eliminar período completo"
        message="Se eliminará este período junto con todos sus movimientos. Esta acción no se puede deshacer."
        onCancel={() => setPeriodDeleteOpen(false)}
        onConfirm={confirmDeletePeriod}
        loading={saving}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: colors.background,
  },
  header: {
    width: '100%',
    minHeight: 82,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoMark: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 22,
  },
  brand: {
    fontSize: 19,
  },
  headerSub: {
    fontSize: 12,
    color: colors.textMuted,
  },
  userRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
  },
  userPill: {
    maxWidth: 270,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  userEmail: {
    fontSize: 13,
    color: colors.textMuted,
  },
  body: {
    flex: 1,
    width: '100%',
    padding: 18,
    gap: 18,
  },
  bodyDesktop: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  bodyMobile: {
    flexDirection: 'column',
  },
  sidebar: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sidebarDesktop: {
    width: 350,
    minWidth: 350,
    maxHeight: '100%',
  },
  sidebarMobile: {
    width: '100%',
    maxHeight: 420,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 16,
  },
  sidebarTitle: {
    fontSize: 18,
  },
  sidebarSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  periodScroll: {
    flex: 1,
  },
  periodList: {
    gap: 10,
    paddingBottom: 4,
  },
  loadingArea: {
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  emptySidebar: {
    minHeight: 240,
    alignItems: 'stretch',
    justifyContent: 'center',
    gap: 12,
  },
  emptyTitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyCopy: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  mainShell: {
    flex: 1,
    minWidth: 0,
  },
  mainDesktop: {
    minHeight: 0,
  },
  mainMobile: {
    minHeight: 580,
  },
  mainScroll: {
    flex: 1,
  },
  mainContent: {
    paddingBottom: 30,
  },
  zoomContent: {
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
    gap: 20,
  },
  periodHeading: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 22,
  },
  periodHeadingCopy: {
    flex: 1,
    minWidth: 220,
    gap: 5,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.1,
    color: colors.primary,
  },
  periodTitle: {
    fontSize: 28,
    letterSpacing: -0.4,
  },
  periodRange: {
    color: colors.textMuted,
    fontSize: 13,
  },
  deletePeriodButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  deletePeriodText: {
    fontSize: 12,
    color: colors.expense,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  movementsSection: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    gap: 16,
  },
  movementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  movementsTitle: {
    fontSize: 20,
  },
  movementsSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 3,
  },
  movementList: {
    gap: 10,
  },
  emptyMovements: {
    paddingVertical: 28,
    paddingHorizontal: 18,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
    gap: 6,
  },
  welcomeCard: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    marginTop: 30,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    padding: 30,
    gap: 14,
  },
  welcomeTitle: {
    fontSize: 28,
  },
  welcomeCopy: {
    color: colors.textMuted,
    lineHeight: 24,
  },
  welcomeButton: {
    alignSelf: 'flex-start',
    minWidth: 180,
  },
});
