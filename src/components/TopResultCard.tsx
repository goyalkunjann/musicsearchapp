import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme';
import type { Artist } from '../types';
import { compact } from '../utils/format';

export const TopResultCard = memo(function TopResultCard({ artist, onPress }: { artist: Artist; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && { opacity: 0.88 }]}>
      <LinearGradient colors={['#0F3D2E', '#081512']} style={StyleSheet.absoluteFill} />
      <Image source={{ uri: artist.image }} style={styles.photo} contentFit="cover" transition={300} />
      <LinearGradient colors={['#0B2A21', 'rgba(11,42,33,0.85)', 'transparent']} locations={[0.3, 0.55, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
      <View style={styles.text}>
        <View style={styles.row}>
          <Text numberOfLines={1} style={[typography.heading, { fontSize: 24 }]}>{artist.name}</Text>
          <Ionicons name="checkmark-circle" size={18} color={colors.verified} />
        </View>
        <Text style={[typography.caption, { color: colors.text, marginTop: 6 }]}>Artist</Text>
        {artist.fans ? <Text style={typography.caption}>{compact(artist.fans)} monthly listeners</Text> : null}
      </View>
      <View style={styles.play}><Ionicons name="play" size={22} color="#001a10" /></View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: { marginHorizontal: spacing.lg, height: 132, borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, justifyContent: 'center' },
  photo: { position: 'absolute', right: 0, top: 0, bottom: 0, width: '62%' },
  text: { paddingHorizontal: spacing.lg, width: '62%' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  play: { position: 'absolute', right: 14, bottom: 14, width: 46, height: 46, borderRadius: 23, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
});
