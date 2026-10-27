import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { navigationRef } from '../navigation/RootNavigator';
import { colors, layout } from '../theme';

type Icon = keyof typeof Ionicons.glyphMap;
const TABS: { label: string; icon: Icon; onPress?: () => void }[] = [
  { label: 'Home', icon: 'home-outline' },
  { label: 'Search', icon: 'search', onPress: () => { if (navigationRef.isReady()) navigationRef.navigate('SearchHome'); } },
  { label: 'Your Library', icon: 'library-outline' },
  { label: 'Premium', icon: 'musical-note-outline' },
  { label: 'Create', icon: 'add' },
];

export const BottomBar = memo(function BottomBar() {
  const { bottom } = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { height: layout.tabBarHeight + bottom, paddingBottom: bottom }]}>
      {TABS.map((t) => {
        const active = t.label === 'Search';
        return (
          <Pressable key={t.label} onPress={t.onPress} style={styles.tab} accessibilityRole="tab">
            <Ionicons name={t.icon} size={22} color={active ? colors.primary : colors.muted} />
            <Text style={[styles.label, active && { color: colors.primary }]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  bar: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', backgroundColor: 'rgba(4,13,12,0.97)', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  label: { fontSize: 10, color: colors.muted, fontWeight: '600' },
});
