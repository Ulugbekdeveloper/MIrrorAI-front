import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { colors, radius, silver } from '@/theme';

type Props = {
  time?: string;
  /** Caps the phone's height so it can be sized to fit within remaining screen space. */
  maxHeight: number;
  children: ReactNode;
};

/** Polished metallic edge peeking out around the black frame. */
const RIM = 3.5;
/** Black border between the rim and the screen. */
const BEZEL = 8;
const CANVAS_SIDE_MARGIN = 24;
const MAX_PHONE_WIDTH = 310;
const MIN_PHONE_WIDTH = 150;
// A true iPhone 15 Pro is ≈2.17 (852x393pt), but since the mockup's height
// is capped by the page layout, width can only grow by widening the stance —
// 2.0 keeps a believable iPhone silhouette while rendering noticeably wider.
const ASPECT_RATIO = 2.0;

/** A drawn (not imaged) black iPhone — metallic rim, Dynamic Island, side buttons, status bar. */
export function PhoneMockup({ time = '10:10', maxHeight, children }: Props) {
  const { width: screenWidth } = useWindowDimensions();

  const widthFromScreen = screenWidth - CANVAS_SIDE_MARGIN * 2;
  const widthFromHeight = maxHeight / ASPECT_RATIO;
  const phoneWidth = Math.max(
    MIN_PHONE_WIDTH,
    Math.min(MAX_PHONE_WIDTH, widthFromScreen, widthFromHeight),
  );
  const phoneHeight = phoneWidth * ASPECT_RATIO;
  const rimRadius = phoneWidth * 0.18;
  const frameRadius = rimRadius - RIM;
  const screenRadius = frameRadius - BEZEL;
  const islandWidth = phoneWidth * 0.32;
  const islandHeight = Math.max(16, phoneWidth * 0.07);

  return (
    <View style={[styles.shadowWrap, { width: phoneWidth, height: phoneHeight }]}>
      {/* Polished-nickel rim — bright specular highlights alternating with
          cooler steel tones, like the natural-titanium/stainless iPhone edge. */}
      <LinearGradient
        colors={[colors.white, silver[200], silver[50], silver[400], silver[100], silver[300]]}
        locations={[0, 0.2, 0.4, 0.65, 0.85, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.rim, { borderRadius: rimRadius, padding: RIM }]}
      >
        {/* Side controls — drawn, not imaged. Positioned to match a real iPhone: action
            switch + volume rocker on the left, power button on the right. */}
        <View style={[styles.sideButton, styles.actionButton]} />
        <View style={[styles.sideButton, styles.volumeUp]} />
        <View style={[styles.sideButton, styles.volumeDown]} />
        <View style={[styles.sideButton, styles.powerButton]} />

        <View style={[styles.frame, { borderRadius: frameRadius, padding: BEZEL }]}>
          <View style={[styles.screen, { borderRadius: screenRadius }]}>
            {/* Status bar with the Dynamic Island sitting inline, camera dot lit. */}
            <View style={styles.statusBar}>
              <Text style={styles.statusTime}>{time}</Text>
              <View
                style={[
                  styles.island,
                  { width: islandWidth, height: islandHeight, borderRadius: islandHeight / 2 },
                ]}
              >
                <View style={styles.cameraDot} />
              </View>
              <View style={styles.statusIcons}>
                <Ionicons name="cellular" size={11} color={colors.textOnLight} />
                <Ionicons name="wifi" size={11} color={colors.textOnLight} />
                <Battery />
              </View>
            </View>

            <View style={styles.content}>{children}</View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

/** Drawn battery indicator at ~70% charge. */
function Battery() {
  return (
    <View style={styles.batteryRow}>
      <View style={styles.batteryBody}>
        <View style={styles.batteryFill} />
      </View>
      <View style={styles.batteryNub} />
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
  },
  rim: { flex: 1 },
  frame: {
    flex: 1,
    backgroundColor: colors.black,
  },
  screen: {
    flex: 1,
    // The mockup shows the app's light-mode try-on preview screen —
    // deliberately not this dark theme's own background.
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingHorizontal: 12,
  },
  statusTime: {
    color: colors.textOnLight,
    fontSize: 11,
    fontWeight: '700',
  },
  island: {
    backgroundColor: colors.black,
    justifyContent: 'center',
    paddingLeft: 8,
  },
  cameraDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.danger,
  },
  statusIcons: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  batteryRow: { flexDirection: 'row', alignItems: 'center' },
  batteryBody: {
    width: 19,
    height: 10,
    borderRadius: 2.5,
    borderWidth: 1,
    borderColor: colors.textOnLight,
    padding: 1,
  },
  batteryFill: {
    width: '70%',
    height: '100%',
    borderRadius: 1,
    backgroundColor: colors.textOnLight,
  },
  batteryNub: {
    width: 1.5,
    height: 4,
    marginLeft: 0.5,
    borderTopRightRadius: 1,
    borderBottomRightRadius: 1,
    backgroundColor: colors.textOnLight,
  },
  content: { flex: 1 },
  // Drawn side buttons — positioned relative to the rim.
  sideButton: {
    position: 'absolute',
    backgroundColor: silver[200],
    borderRadius: radius.sm,
  },
  actionButton: { left: -3, top: '13%', width: 3, height: 18 },
  volumeUp: { left: -3, top: '20%', width: 3, height: 32 },
  volumeDown: { left: -3, top: '30%', width: 3, height: 32 },
  powerButton: { right: -3, top: '20%', width: 3, height: 46 },
});
