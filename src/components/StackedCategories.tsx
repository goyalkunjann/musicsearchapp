import { memo, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, type SharedValue } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useChromeInset } from '../hooks/useChromeInset';
import { colors } from '../theme';
import type { Category } from '../types';

const ITEM = 92;
const CARD_H = 156;
const START = 2;
const CLAMP = Extrapolation.CLAMP;

const Item = memo(function Item({ item, index, y, onSelect }: { item: Category; index: number; y: SharedValue<number>; onSelect: (c: Category) => void }) {
  // d = signed distance (in items) from the centre. All animation is UI-thread worklets.
  const outer = useAnimatedStyle(() => ({ zIndex: Math.round(100 - Math.abs(index - y.value / ITEM) * 10) }));
  const card = useAnimatedStyle(() => {
    const d = index - y.value / ITEM;
    const a = Math.abs(d);
    return {
      opacity: interpolate(a, [0, 1, 2, 3], [1, 0.9, 0.6, 0.35], CLAMP),
      transform: [
        { perspective: 700 },
        { rotateX: `${interpolate(d, [-2, -1, 0, 1, 2], [62, 48, 0, -48, -62], CLAMP)}deg` },
        { scale: interpolate(a, [0, 1, 2], [1, 0.92, 0.82], CLAMP) },
      ],
    };
  });
  const focus = useAnimatedStyle(() => ({ opacity: interpolate(Math.abs(index - y.value / ITEM), [0, 0.6], [1, 0], CLAMP) }));

  return (
    <Animated.View style={[styles.cell, outer]}>
      <Animated.View style={[styles.card, card]}>
        <Pressable onPress={() => onSelect(item)} style={StyleSheet.absoluteFill}>
          <LinearGradient colors={['#1B3A33', '#0A1513']} style={StyleSheet.absoluteFill} />
          {item.image ? <Image source={{ uri: item.image }} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} recyclingKey={item.id} /> : null}
          <LinearGradient colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.05)']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={StyleSheet.absoluteFill} />
          <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.border, focus]} />
          <View style={styles.text}>
            <Text style={styles.title}>{item.title}</Text>
            <Animated.Text style={[styles.sub, focus]}>{item.subtitle}</Animated.Text>
          </View>
          <Animated.View style={[styles.play, focus]}><Ionicons name="play" size={22} color="#001a10" /></Animated.View>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
});

export const StackedCategories = memo(function StackedCategories({ data, onSelect }: { data: Category[]; onSelect: (c: Category) => void }) {
  const chrome = useChromeInset();
  const [h, setH] = useState(0);
  const ref = useRef<Animated.ScrollView>(null);
  const y = useSharedValue(ITEM * START);
  const onScroll = useAnimatedScrollHandler((e) => { y.value = e.contentOffset.y; });

  useEffect(() => { if (h) ref.current?.scrollTo({ y: ITEM * START, animated: false }); }, [h]);

  return (
    <View style={{ flex: 1, marginBottom: chrome - 24 }} onLayout={(e) => setH(e.nativeEvent.layout.height)}>
      {h > 0 && (
        <Animated.ScrollView ref={ref} onScroll={onScroll} scrollEventThrottle={16} showsVerticalScrollIndicator={false}
          snapToInterval={ITEM} decelerationRate="fast" contentContainerStyle={{ paddingVertical: (h - ITEM) / 2 }}>
          {data.map((c, i) => <Item key={c.id} item={c} index={i} y={y} onSelect={onSelect} />)}
        </Animated.ScrollView>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  cell: { height: ITEM },
  card: { position: 'absolute', left: 22, right: 22, top: (ITEM - CARD_H) / 2, height: CARD_H, borderRadius: 24, overflow: 'hidden', backgroundColor: colors.surface },
  border: { borderRadius: 24, borderWidth: 2, borderColor: colors.primary },
  text: { position: 'absolute', left: 18, bottom: 16, right: 80 },
  title: { color: colors.text, fontSize: 26, fontWeight: '800', fontStyle: 'italic' },
  sub: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },
  play: { position: 'absolute', right: 16, bottom: 16, width: 50, height: 50, borderRadius: 25, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
});
