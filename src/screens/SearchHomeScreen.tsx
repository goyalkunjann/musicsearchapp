import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SearchBarPlaceholder } from '../components/SearchBar';
import { StackedCategories } from '../components/StackedCategories';
import { useAsync } from '../hooks/useAsync';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { CATEGORY_DEFS, fetchCategories } from '../services/deezer';
import { colors, spacing, typography } from '../theme';

export default function SearchHomeScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'SearchHome'>) {
  const { top } = useSafeAreaInsets();
  const { data } = useAsync(fetchCategories, []);
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: top + spacing.lg }}>
      <View style={styles.head}>
        <Text style={typography.title}>Search</Text>
        <View style={styles.avatar}><Ionicons name="person" size={18} color={colors.muted} /></View>
      </View>
      <View style={styles.bar}><SearchBarPlaceholder onPress={() => navigation.navigate('SearchInput')} /></View>
      <StackedCategories data={data ?? CATEGORY_DEFS} onSelect={(c) => navigation.navigate('SearchInput', { initialQuery: c.query })} />
    </View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  bar: { flexDirection: 'row', paddingHorizontal: spacing.lg, marginTop: spacing.md },
});
