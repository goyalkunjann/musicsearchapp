import { memo } from 'react';
import { Pressable, StyleSheet, Text, TextInput } from 'react-native';
import Animated, { LinearTransition, ZoomIn, ZoomOut } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme';

type Props = { value: string; onChangeText: (t: string) => void; onSubmit: () => void; onClear: () => void; autoFocus?: boolean };

export const SearchBar = memo(function SearchBar({ value, onChangeText, onSubmit, onClear, autoFocus }: Props) {
  return (
    <Animated.View layout={LinearTransition.springify().damping(18)} style={styles.bar}>
      <Ionicons name="search" size={18} color={colors.muted} />
      <TextInput autoFocus={autoFocus} value={value} onChangeText={onChangeText} onSubmitEditing={onSubmit}
        returnKeyType="search" placeholder="What do you want to listen to?" placeholderTextColor={colors.muted}
        style={styles.input} autoCorrect={false} selectionColor={colors.primary} />
      {value.length > 0 && (
        <Animated.View entering={ZoomIn.duration(150)} exiting={ZoomOut.duration(120)}>
          <Pressable onPress={onClear} hitSlop={10} accessibilityLabel="Clear search">
            <Ionicons name="close-circle" size={18} color={colors.muted} />
          </Pressable>
        </Animated.View>
      )}
    </Animated.View>
  );
});

/** Tappable, non-editable bar used on the home screen. */
export const SearchBarPlaceholder = memo(function SearchBarPlaceholder({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.bar} accessibilityRole="search">
      <Ionicons name="search" size={18} color={colors.muted} />
      <Text style={[styles.input, { color: colors.muted }]}>What do you want to listen to?</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  bar: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, height: 46, paddingHorizontal: spacing.md, borderRadius: radius.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  input: { flex: 1, color: colors.text, fontSize: 15 },
});
