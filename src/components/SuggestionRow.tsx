import { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';

type Props = { text: string; index: number; recent?: boolean; onPress: (t: string) => void };

/** Staggered spring entrance: delay grows with index. */
export const SuggestionRow = memo(function SuggestionRow({ text, index, recent, onPress }: Props) {
  return (
    <Animated.View entering={FadeInDown.delay(index * 45).springify().damping(16)}>
      <Pressable onPress={() => onPress(text)} style={styles.row}>
        <Ionicons name={recent ? 'time-outline' : 'search'} size={18} color={colors.muted} />
        <Text style={[typography.body, { flex: 1 }]}>{text}</Text>
        <Ionicons name="arrow-up-outline" size={16} color={colors.muted} style={{ transform: [{ rotate: '-45deg' }] }} />
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: 14 } });
