import { memo, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Artwork } from './Artwork';
import { colors, spacing, typography } from '../theme';

type Props = {
  image?: string; title: string; subtitle: string; onPress: () => void;
  round?: boolean; active?: boolean; verified?: boolean; leading?: ReactNode; trailing?: ReactNode;
};

export const MediaRow = memo(function MediaRow({ image, title, subtitle, onPress, round, active, verified, leading, trailing }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}>
      {leading}
      <Artwork uri={image} size={54} round={round} />
      <View style={styles.meta}>
        <View style={styles.titleRow}>
          <Text numberOfLines={1} style={[typography.body, active && { color: colors.primary }]}>{title}</Text>
          {verified && <Ionicons name="checkmark-circle" size={14} color={colors.verified} />}
        </View>
        <Text numberOfLines={1} style={typography.caption}>{subtitle}</Text>
      </View>
      {trailing}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: 7 },
  meta: { flex: 1, gap: 3 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
