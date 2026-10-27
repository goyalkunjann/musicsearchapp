import { useEffect, useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MiniPlayer } from './MiniPlayer';
import { NowPlaying } from './NowPlaying';
import { usePlayerStore } from '../../store/playerStore';
import { colors, layout, spring } from '../../theme';

const CLAMP = Extrapolation.CLAMP;

/**
 * One container drives both states with a single `progress` shared value (0 = mini, 1 = full).
 * Only transform/opacity are animated -> UI thread, no layout passes.
 */
export function PlayerSheet() {
  const hasSong = usePlayerStore((s) => s.current !== null);
  const expanded = usePlayerStore((s) => s.expanded);
  const setExpanded = usePlayerStore((s) => s.setExpanded);
  const { height } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();
  const collapsedY = height - layout.miniHeight - layout.tabBarHeight - bottom - 8;
  const progress = useSharedValue(0);

  useEffect(() => { progress.value = withSpring(expanded ? 1 : 0, spring); }, [expanded, progress]);

  const pan = useMemo(() => Gesture.Pan().runOnJS(true).enabled(expanded)
    .onUpdate((e) => { progress.value = Math.min(1, Math.max(0, 1 - e.translationY / (height * 0.5))); })
    .onEnd((e) => {
      const close = e.translationY > height * 0.15 || e.velocityY > 900;
      progress.value = withSpring(close ? 0 : 1, spring);
      setExpanded(!close);
    }), [expanded, height, progress, setExpanded]);

  const container = useAnimatedStyle(() => ({ transform: [{ translateY: interpolate(progress.value, [0, 1], [collapsedY, 0]) }] }));
  const bg = useAnimatedStyle(() => ({ opacity: progress.value }));
  const mini = useAnimatedStyle(() => ({ opacity: interpolate(progress.value, [0, 0.3], [1, 0], CLAMP) }));
  const full = useAnimatedStyle(() => ({ opacity: interpolate(progress.value, [0.4, 1], [0, 1], CLAMP) }));

  if (!hasSong) return null;
  return (
    <Animated.View pointerEvents="box-none" style={[styles.container, { height }, container]}>
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: colors.bg }, bg]} />
      <GestureDetector gesture={pan}>
        <Animated.View pointerEvents={expanded ? 'auto' : 'none'} style={[StyleSheet.absoluteFill, full]}>
          <NowPlaying onCollapse={() => setExpanded(false)} />
        </Animated.View>
      </GestureDetector>
      <Animated.View pointerEvents={expanded ? 'none' : 'auto'} style={[styles.mini, mini]}>
        <MiniPlayer onPress={() => setExpanded(true)} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 0, left: 0, right: 0 },
  mini: { position: 'absolute', top: 0, left: 8, right: 8 },
});
