import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';

import { colors, overlay, silver } from '@/theme';

import type { StyleProfileAxis } from '../styleProfile';

type Props = {
  axes: StyleProfileAxis[];
};

/** Gap between the board's outer edge and where a label's anchor point sits. */
const LABEL_GAP = 18;
/** Worst-case horizontal reach of the longest label ("Streetwear") at this font size. */
const LABEL_TEXT_RESERVE = 64;
const VERTICAL_LABEL_RESERVE = 34;
const CANVAS_SIDE_MARGIN = 12;
const MIN_BOARD_RADIUS = 62;
const MAX_BOARD_RADIUS = 120;
const BULLSEYE_RADIUS = 14;
const RING_COUNT = 4;
const WEDGE_COLORS = [silver[800], silver[900]];

function axisAngle(index: number, total: number) {
  return (index * 2 * Math.PI) / total;
}

/** Anchor + baseline nudge so labels sit outside the board without clipping or overlapping. */
function labelPlacement(angle: number) {
  const dx = Math.sin(angle);
  const dy = -Math.cos(angle);
  const anchor = dx > 0.3 ? 'start' : dx < -0.3 ? 'end' : 'middle';
  const dyOffset = dy > 0.3 ? 12 : dy < -0.3 ? -2 : 4;
  return { anchor, dyOffset } as const;
}

export function DartboardChart({ axes }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const total = axes.length;

  // Size the board from the actual screen width so labels always have room
  // to fully render on any device, capped so it doesn't balloon on tablets.
  const availableWidth = screenWidth - CANVAS_SIDE_MARGIN * 2;
  const boardRadius = Math.min(
    MAX_BOARD_RADIUS,
    Math.max(MIN_BOARD_RADIUS, availableWidth / 2 - LABEL_GAP - LABEL_TEXT_RESERVE),
  );
  const labelRadius = boardRadius + LABEL_GAP;
  const width = (labelRadius + LABEL_TEXT_RESERVE) * 2;
  const height = (labelRadius + VERTICAL_LABEL_RESERVE) * 2;
  const centerX = width / 2;
  const centerY = height / 2;

  const pointAt = (angle: number, radius: number) => ({
    x: centerX + radius * Math.sin(angle),
    y: centerY - radius * Math.cos(angle),
  });

  const wedgeAngleStep = (2 * Math.PI) / total;

  return (
    <View style={styles.wrap}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* The board — 8 alternating wedges, one per style, like a real dartboard. */}
        {axes.map((axis, index) => {
          const center = axisAngle(index, total);
          const start = pointAt(center - wedgeAngleStep / 2, boardRadius);
          const end = pointAt(center + wedgeAngleStep / 2, boardRadius);
          const path = `M ${centerX},${centerY} L ${start.x},${start.y} A ${boardRadius},${boardRadius} 0 0,1 ${end.x},${end.y} Z`;
          return <Path key={axis.label} d={path} fill={WEDGE_COLORS[index % 2]} />;
        })}

        {/* Scoring rings, purely decorative — reinforces the dartboard read. */}
        {Array.from({ length: RING_COUNT }, (_, ring) => (
          <Circle
            key={ring}
            cx={centerX}
            cy={centerY}
            r={(boardRadius * (ring + 1)) / RING_COUNT}
            fill="none"
            stroke={overlay.whiteSoft}
            strokeWidth={1}
          />
        ))}

        {/* Bullseye — landing closest to it means the strongest style match. */}
        <Circle cx={centerX} cy={centerY} r={BULLSEYE_RADIUS} fill={colors.primary} />
        <Circle
          cx={centerX}
          cy={centerY}
          r={BULLSEYE_RADIUS + 5}
          fill="none"
          stroke={overlay.primaryOutline}
          strokeWidth={2}
        />

        {/* One "dart" per style — the higher the score, the closer to bullseye it lands. */}
        {axes.map((axis, index) => {
          const angle = axisAngle(index, total);
          const throwRadius = BULLSEYE_RADIUS + (boardRadius - BULLSEYE_RADIUS) * (1 - axis.value);
          const { x, y } = pointAt(angle, throwRadius);
          return (
            <Circle
              key={axis.label}
              cx={x}
              cy={y}
              r={6}
              fill={colors.white}
              stroke={colors.primary}
              strokeWidth={2.5}
            />
          );
        })}

        {/* Axis labels, positioned outward with anchor/baseline tuned per side. */}
        {axes.map((axis, index) => {
          const angle = axisAngle(index, total);
          const { x, y } = pointAt(angle, labelRadius);
          const { anchor, dyOffset } = labelPlacement(angle);
          return (
            <SvgText
              key={axis.label}
              x={x}
              y={y + dyOffset}
              fontSize={11}
              fontWeight="600"
              fill={colors.textMuted}
              textAnchor={anchor}
            >
              {axis.label}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
});
