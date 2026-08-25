import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import AppText from './AppText';
import ZoomModal from './ZoomModal';
import { colors, radius } from '../theme';
import { buildCalendar, formatDate, fromISODate, monthLabel, toISODate } from '../utils/dates';

const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export default function DateSelector({ label, value, onChange }) {
  const selectedDate = fromISODate(value || toISODate());
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState({
    year: selectedDate.getFullYear(),
    month: selectedDate.getMonth(),
  });

  const cells = useMemo(
    () => buildCalendar(cursor.year, cursor.month),
    [cursor.year, cursor.month]
  );

  const openCalendar = () => {
    const date = fromISODate(value || toISODate());
    setCursor({ year: date.getFullYear(), month: date.getMonth() });
    setOpen(true);
  };

  const changeMonth = (delta) => {
    const date = new Date(cursor.year, cursor.month + delta, 1, 12);
    setCursor({ year: date.getFullYear(), month: date.getMonth() });
  };

  const pickDay = (day) => {
    if (!day) return;
    const date = new Date(cursor.year, cursor.month, day, 12);
    onChange(toISODate(date));
    setOpen(false);
  };

  return (
    <View style={styles.group}>
      {label ? <AppText style={styles.label} weight="semiBold">{label}</AppText> : null}
      <Pressable onPress={openCalendar} style={({ pressed }) => [styles.field, pressed && styles.pressed]}>
        <AppText style={styles.dateText}>{formatDate(value)}</AppText>
        <AppText style={styles.calendarMark}>▦</AppText>
      </Pressable>

      <ZoomModal visible={open} onClose={() => setOpen(false)} maxWidth={430}>
        <ScrollView contentContainerStyle={styles.modalContent}>
          <View style={styles.header}>
            <Pressable onPress={() => changeMonth(-1)} style={styles.navButton}>
              <AppText weight="bold">‹</AppText>
            </Pressable>
            <AppText weight="bold" style={styles.monthTitle}>
              {monthLabel(cursor.year, cursor.month)}
            </AppText>
            <Pressable onPress={() => changeMonth(1)} style={styles.navButton}>
              <AppText weight="bold">›</AppText>
            </Pressable>
          </View>

          <View style={styles.weekRow}>
            {WEEKDAYS.map((day) => (
              <View key={day} style={styles.dayCell}>
                <AppText style={styles.weekday} weight="semiBold">{day}</AppText>
              </View>
            ))}
          </View>

          <View style={styles.grid}>
            {cells.map((day, index) => {
              const iso = day
                ? toISODate(new Date(cursor.year, cursor.month, day, 12))
                : null;
              const selected = iso === value;

              return (
                <View key={`${day || 'blank'}-${index}`} style={styles.dayCell}>
                  {day ? (
                    <Pressable
                      onPress={() => pickDay(day)}
                      style={({ pressed }) => [
                        styles.dayButton,
                        selected && styles.daySelected,
                        pressed && !selected && styles.dayPressed,
                      ]}
                    >
                      <AppText
                        weight={selected ? 'bold' : 'regular'}
                        style={[styles.dayText, selected && styles.dayTextSelected]}
                      >
                        {day}
                      </AppText>
                    </Pressable>
                  ) : null}
                </View>
              );
            })}
          </View>

          <Pressable
            onPress={() => {
              onChange(toISODate());
              setOpen(false);
            }}
            style={styles.todayButton}
          >
            <AppText weight="semiBold" color={colors.primary}>Usar hoy</AppText>
          </Pressable>
        </ScrollView>
      </ZoomModal>
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    width: '100%',
    gap: 8,
  },
  label: {
    fontSize: 14,
  },
  field: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pressed: {
    backgroundColor: colors.surfaceMuted,
  },
  dateText: {
    fontSize: 16,
  },
  calendarMark: {
    fontSize: 20,
    color: colors.primary,
  },
  modalContent: {
    padding: 22,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  monthTitle: {
    fontSize: 18,
  },
  navButton: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.2857%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  weekday: {
    fontSize: 12,
    color: colors.textMuted,
  },
  dayButton: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daySelected: {
    backgroundColor: colors.primary,
  },
  dayPressed: {
    backgroundColor: colors.primarySoft,
  },
  dayText: {
    fontSize: 14,
  },
  dayTextSelected: {
    color: colors.white,
  },
  todayButton: {
    alignSelf: 'center',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});
