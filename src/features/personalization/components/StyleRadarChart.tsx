import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Circle, Line, Polygon, Text as SvgText } from 'react-native-svg';

import { colors, overlay } from '@/theme';

import type { StyleProfileAxis } from '../styleProfile';

type Props = {
  axes: StyleProfileAxis[];
};

const GRID_LEVELS = 4;
const LABEL_GAP = 18;
const LABEL_TEXT_RESERVE = 64;
const VERTICAL_LABEL_RESERVE = 34;
const CANVAS_SIDE_MARGIN = 12;
const MIN_RADIUS = 66;
const MAX_RADIUS = 118;

function axisAngle(index: number, total: number) {
  return (index * 2 * Math.PI) / total;
}

function labelPlacement(angle: number) {
  const dx = Math.sin(angle);
  const dy = -Math.cos(angle);
  const anchor = dx > 0.3 ? 'start' : dx < -0.3 ? 'end' : 'middle';
  const dyOffset = dy > 0.3 ? 12 : dy < -0.3 ? -2 : 4;
  return { anchor, dyOffset } as const;
}

export function StyleRadarChart({ axes }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const total = axes.length;
  const dominantIndex = axes.reduce((best, a, i) => (a.value > axes[best].value ? i : best), 0);

  // Entrance reveal (scale + fade) and a continuous radar "ping" glow.
  const reveal = useRef(new Animated.Value(0)).current;
  const ping = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(reveal, {
      toValue: 1,
      friction: 7,
      tension: 50,
      useNativeDriver: true,
    }).start();
    const loop = Animated.loop(
      Animated.timing(ping, {
        toValue: 1,
        duration: 2600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [reveal, ping]);

  const availableWidth = screenWidth - CANVAS_SIDE_MARGIN * 2;
  const maxRadius = Math.min(
    MAX_RADIUS,
    Math.max(MIN_RADIUS, availableWidth / 2 - LABEL_GAP - LABEL_TEXT_RESERVE),
  );
  const labelRadius = maxRadius + LABEL_GAP;
  const width = (labelRadius + LABEL_TEXT_RESERVE) * 2;
  const height = (labelRadius + VERTICAL_LABEL_RESERVE) * 2;
  const cx = width / 2;
  const cy = height / 2;

  const pointAt = (angle: number, radius: number) => ({
    x: cx + radius * Math.sin(angle),
    y: cy - radius * Math.cos(angle),
  });

  const gridPolygon = (radius: number) =>
    Array.from({ length: total }, (_, i) => {
      const { x, y } = pointAt(axisAngle(i, total), radius);
      return `${x},${y}`;
    }).join(' ');

  const dataPoints = axes.map((axis, i) => pointAt(axisAngle(i, total), maxRadius * axis.value));

  const revealScale = reveal.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });
  const pingScale = ping.interpolate({ inputRange: [0, 1], outputRange: [0.7, 2.2] });
  const pingOpacity = ping.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 0.35, 0] });

  return (
    <View style={[styles.wrap, { width, height }]}>
      {/* Continuous radar ping behind the chart */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.ping,
          {
            width: maxRadius,
            height: maxRadius,
            borderRadius: maxRadius / 2,
            transform: [{ scale: pingScale }],
            opacity: pingOpacity,
          },
        ]}
      />

      <Animated.View style={{ opacity: reveal, transform: [{ scale: revealScale }] }}>
        <Svg width={width} height={height}>
          {/* Concentric grid rings */}
          {Array.from({ length: GRID_LEVELS }, (_, level) => (
            <Polygon
              key={level}
              points={gridPolygon((maxRadius * (level + 1)) / GRID_LEVELS)}
              fill="none"
              stroke={overlay.whiteSoft}
              strokeWidth={1}
            />
          ))}

          {/* Radial spokes */}
          {axes.map((_, i) => {
            const { x, y } = pointAt(axisAngle(i, total), maxRadius);
            return (
              <Line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={overlay.whiteSoft} strokeWidth={1} />
            );
          })}

          {/* The style-profile shape */}
          <Polygon
            points={dataPoints.map((p) => `${p.x},${p.y}`).join(' ')}
            fill={overlay.primaryTint}
            stroke={colors.primary}
            strokeWidth={2}
          />

          {/* Vertex dots — the dominant style gets a larger, brighter dot */}
          {dataPoints.map((p, i) => (
            <Circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={i === dominantIndex ? 6 : 3.5}
              fill={i === dominantIndex ? colors.primary : colors.white}
              stroke={colors.white}
              strokeWidth={i === dominantIndex ? 2 : 0}
            />
          ))}

          {/* Labels */}
          {axes.map((axis, i) => {
            const angle = axisAngle(i, total);
            const { x, y } = pointAt(angle, labelRadius);
            const { anchor, dyOffset } = labelPlacement(angle);
            const isDominant = i === dominantIndex;
            return (
              <SvgText
                key={axis.label}
                x={x}
                y={y + dyOffset}
                fontSize={11}
                fontWeight={isDominant ? '700' : '600'}
                fill={isDominant ? colors.text : colors.textMuted}
                textAnchor={anchor}
              >
                {axis.label}
              </SvgText>
            );
          })}
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  ping: {
    position: 'absolute',
    backgroundColor: colors.primary,
  },
});
