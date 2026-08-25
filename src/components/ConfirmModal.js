import React from 'react';
import { StyleSheet, View } from 'react-native';
import ZoomModal from './ZoomModal';
import AppText from './AppText';
import AppButton from './AppButton';
import { colors } from '../theme';

export default function ConfirmModal({ visible, title, message, onCancel, onConfirm, loading }) {
  return (
    <ZoomModal visible={visible} onClose={onCancel} maxWidth={460}>
      <View style={styles.content}>
        <View style={styles.copy}>
          <AppText weight="bold" style={styles.title}>{title}</AppText>
          <AppText style={styles.message}>{message}</AppText>
        </View>
        <View style={styles.actions}>
          <AppButton title="Cancelar" variant="ghost" onPress={onCancel} style={styles.action} />
          <AppButton title="Eliminar" variant="danger" onPress={onConfirm} loading={loading} style={styles.action} />
        </View>
      </View>
    </ZoomModal>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
    gap: 22,
  },
  copy: {
    gap: 8,
  },
  title: {
    fontSize: 22,
  },
  message: {
    color: colors.textMuted,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 10,
  },
  action: {
    minWidth: 130,
  },
});
