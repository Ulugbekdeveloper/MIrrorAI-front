import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Line, Path, Polygon } from 'react-native-svg';

import { colors, overlay, radius, spacing, typography } from '@/theme';

type Props = {
  /** 0–1 match strength the needle sweeps to. */
  value: number;
  /** The selected style's name, shown as the readout. */
  label: string;
};

const STROKE = 16;
const GAP = spacing.lg;
const MAX_WIDTH = 300;
const SWEEP_START = 180; // left end of the arc (degrees, SVG y-down)
const SWEEP_END = 360; // right end, passing over the top (270 = up)
const TICK_COUNT = 8;
const NEEDLE_TAIL = 18; // counterweight length behind the pivot
const NEEDLE_SVG_W = 18;

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

/** Clockwise arc (SVG sweep flag 1) from startAngle → endAngle. */
function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polar(cx, cy, r, startAngle);
  const end = polar(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

export function StyleSpeedGauge({ value, label }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const gaugeWidth = Math.min(screenWidth - GAP * 2, MAX_WIDTH);
  const r = (gaugeWidth - STROKE) / 2;
  const cx = gaugeWidth / 2;
  const cy = r + STROKE / 2;
  const svgHeight = cy + STROKE;

  const percent = Math.round(value * 100);
  const needleLen = r * 0.72;

  // Needle sweep (native-driver rotate) + a count-up on the number (JS-driven,
  // separate value so there's no driver mixing on any single node).
  const needle = useRef(new Animated.Value(0)).current;
  const count = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    Animated.spring(needle, {
      toValue: 1,
      friction: 6,
      tension: 38,
      delay: 250,
      useNativeDriver: true,
    }).start();

    const id = count.addListener(({ value: v }) => setDisplay(Math.round(v * percent)));
    Animated.timing(count, {
      toValue: 1,
      duration: 1300,
      delay: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    return () => count.removeListener(id);
  }, [needle, count, percent]);

  // Needle points up (toward 270°) at rotation 0; map value 0→1 to −90°→+90°.
  const rotate = needle.interpolate({
    inputRange: [0, 1],
    outputRange: ['-90deg', `${value * 180 - 90}deg`],
  });

  // Three colored zones — muted → primary → success (a strong match lands green).
  const third = (SWEEP_END - SWEEP_START) / 3;

  // Needle blade drawn tip-up in its own small SVG; the pivot sits at
  // (NEEDLE_SVG_W / 2, needleLen), which we align to the gauge center.
  const mid = NEEDLE_SVG_W / 2;
  const needlePoints = [
    `${mid},0`, // sharp tip
    `${mid + 4.5},${needleLen * 0.86}`, // right shoulder (widest, near hub)
    `${mid},${needleLen + NEEDLE_TAIL}`, // counterweight point
    `${mid - 4.5},${needleLen * 0.86}`, // left shoulder
  ].join(' ');

  return (
    <View style={styles.wrap}>
      <View style={{ width: gaugeWidth, height: svgHeight }}>
        <Svg width={gaugeWidth} height={svgHeight}>
          {/* Soft green halo behind the "strong match" zone */}
          <Path
            d={arcPath(cx, cy, r, SWEEP_START + third * 2, SWEEP_END)}
            stroke={colors.success}
            strokeOpacity={0.22}
            strokeWidth={STROKE + 12}
            strokeLinecap="round"
            fill="none"
          />

          <Path
            d={arcPath(cx, cy, r, SWEEP_START, SWEEP_START + third)}
            stroke={overlay.whiteStrong}
            strokeWidth={STROKE}
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d={arcPath(cx, cy, r, SWEEP_START + third, SWEEP_START + third * 2)}
            stroke={colors.primary}
            strokeWidth={STROKE}
            fill="none"
          />
          <Path
            d={arcPath(cx, cy, r, SWEEP_START + third * 2, SWEEP_END)}
            stroke={colors.success}
            strokeWidth={STROKE}
            strokeLinecap="round"
            fill="none"
          />

          {/* Tick marks */}
          {Array.from({ length: TICK_COUNT + 1 }, (_, i) => {
            const angle = SWEEP_START + (i / TICK_COUNT) * (SWEEP_END - SWEEP_START);
            const inner = polar(cx, cy, r - STROKE / 2 - 6, angle);
            const outer = polar(cx, cy, r - STROKE / 2 - 1, angle);
            return (
              <Line
                key={i}
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke={overlay.whiteMedium}
                strokeWidth={2}
              />
            );
          })}
        </Svg>

        {/* Needle — a shaped SVG blade inside a natively-rotated wrapper that
            pivots around the gauge center (cx, cy). */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.needleWrap,
            {
              left: cx - needleLen,
              top: cy - needleLen,
              width: needleLen * 2,
              height: needleLen * 2,
              transform: [{ rotate }],
            },
          ]}
        >
          <Svg
            width={NEEDLE_SVG_W}
            height={needleLen + NEEDLE_TAIL}
            style={{ position: 'absolute', left: needleLen - mid, top: 0 }}
          >
            <Polygon points={needlePoints} fill={colors.white} />
          </Svg>
        </Animated.View>

        {/* Hub — two rings for depth, with a soft glow */}
        <View style={[styles.hubOuter, { left: cx - HUB / 2, top: cy - HUB / 2 }]}>
          <View style={styles.hubInner} />
        </View>
      </View>

      <View style={styles.readout}>
        <Text style={styles.eyebrow}>STYLE MATCH</Text>
        <View style={styles.percentRow}>
          <Text style={styles.percent}>{display}</Text>
          <Text style={styles.percentSign}>%</Text>
        </View>
        <View style={styles.styleChip}>
          <Ionicons name="sparkles" size={13} color={colors.success} />
          <Text style={styles.styleChipText}>{label}</Text>
        </View>
      </View>
    </View>
  );
}

const HUB = 26;

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  needleWrap: { position: 'absolute', alignItems: 'center' },
  hubOuter: {
    position: 'absolute',
    width: HUB,
    height: HUB,
    borderRadius: HUB / 2,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 6,
  },
  hubInner: {
    width: HUB - 10,
    height: HUB - 10,
    borderRadius: (HUB - 10) / 2,
    backgroundColor: colors.primary,
  },
  readout: { alignItems: 'center', gap: spacing.xxs, marginTop: spacing.sm },
  eyebrow: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: colors.textDim,
  },
  // Baseline-aligned so the "%" sits on the number's baseline, not floating
  // as a superscript.
  percentRow: { flexDirection: 'row', alignItems: 'baseline' },
  percent: {
    ...typography.displayLg,
    fontSize: 60,
    lineHeight: 64,
    fontWeight: '800',
    color: colors.text,
    fontVariant: ['tabular-nums'],
    letterSpacing: -2,
  },
  percentSign: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textMuted,
    marginLeft: 2,
  },
  styleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: spacing.xxs,
    paddingVertical: 5,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: overlay.successOutline,
    backgroundColor: overlay.successTint,
  },
  styleChipText: {
    ...typography.bodyStrong,
    color: colors.success,
    fontWeight: '800',
  },
});
