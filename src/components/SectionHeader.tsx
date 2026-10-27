import { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';

export const SectionHeader = memo(function SectionHeader({ title, onAction }: { title: string; onAction?: () => void }) {
  return (
    <Pressable disabled={!onAction} onPress={onAction} style={styles.row}>
      <Text style={typography.heading}>{title}</Text>
      {onAction && <Text style={styles.action}>See all <Ionicons name="chevron-forward" size={12} color={colors.text} /></Text>}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.sm },
  action: { color: colors.text, fontSize: 13, fontWeight: '600' },
});
