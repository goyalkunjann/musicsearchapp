import { memo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing } from '../theme';
import type { SearchFilter } from '../types';

const FILTERS: SearchFilter[] = ['All', 'Songs', 'Artists', 'Albums', 'Playlists'];

const Chip = memo(function Chip({ label, active, onPress }: { label: SearchFilter; active: boolean; onPress: (f: SearchFilter) => void }) {
  return (
    <Pressable onPress={() => onPress(label)} style={[styles.chip, active && styles.active]}>
      <Text style={[styles.text, active && { color: '#000' }]}>{label}</Text>
    </Pressable>
  );
});

export const FilterChips = memo(function FilterChips({ value, onChange }: { value: SearchFilter; onChange: (f: SearchFilter) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row} style={{ flexGrow: 0 }}>
      {FILTERS.map((f) => <Chip key={f} label={f} active={f === value} onPress={onChange} />)}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  row: { gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: colors.surfaceAlt },
  active: { backgroundColor: colors.primary },
  text: { color: colors.text, fontWeight: '600', fontSize: 13 },
});
