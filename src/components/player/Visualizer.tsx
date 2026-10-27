import { memo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { colors } from '../../theme';

const BAR_H = 200;
const BARS = Array.from({ length: 30 }, (_, i) => i);

const Bar = memo(function Bar({ playing, seed }: { playing: boolean; seed: number }) {
  const h = useSharedValue(0.12);
  useEffect(() => {
    h.value = playing
      ? withRepeat(withTiming(0.25 + ((seed * 37) % 70) / 100, { duration: 350 + ((seed * 53) % 500) }), -1, true)
      : withTiming(0.12);
  }, [playing, seed, h]);
  // transform-only: anchored to the bottom, no layout work
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: ((1 - h.value) * BAR_H) / 2 }, { scaleY: h.value }] }));
  return <Animated.View style={[styles.bar, style]} />;
});

export const Visualizer = memo(function Visualizer({ playing }: { playing: boolean }) {
  return <View style={styles.row}>{BARS.map((i) => <Bar key={i} seed={i + 1} playing={playing} />)}</View>;
});

const styles = StyleSheet.create({
  row: { height: BAR_H, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 5 },
  bar: { width: 5, height: BAR_H, borderRadius: 3, backgroundColor: colors.primary },
});
