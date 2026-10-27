import { memo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, typography } from '../theme';

type Props = { variant: 'loading' | 'empty' | 'error'; title?: string; subtitle?: string; onRetry?: () => void };

export const StateView = memo(function StateView({ variant, title, subtitle, onRetry }: Props) {
  if (variant === 'loading') return <View style={styles.wrap}><ActivityIndicator color={colors.primary} size="large" /></View>;
  return (
    <View style={styles.wrap}>
      <Ionicons name={variant === 'error' ? 'cloud-offline-outline' : 'musical-notes-outline'} size={48} color={colors.muted} />
      <Text style={typography.heading}>{title ?? (variant === 'error' ? 'Something went wrong' : 'No results')}</Text>
      {subtitle && <Text style={[typography.caption, { textAlign: 'center' }]}>{subtitle}</Text>}
      {variant === 'error' && onRetry && (
        <Pressable onPress={onRetry} style={styles.btn}><Text style={{ fontWeight: '700' }}>Try again</Text></Pressable>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 10, paddingTop: 80, paddingHorizontal: 32 },
  btn: { marginTop: 8, backgroundColor: colors.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: radius.pill },
});
