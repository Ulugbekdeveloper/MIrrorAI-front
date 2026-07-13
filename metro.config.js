const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable importing .svg files as React components via react-native-svg-transformer.
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
};

config.resolver = {
  ...config.resolver,
  assetExts: [
    ...config.resolver.assetExts.filter((ext) => ext !== 'svg'),
    // Not in Metro's default asset list — needed for the onboarding images.
    'avif',
  ],
  sourceExts: [...config.resolver.sourceExts, 'svg'],
};

module.exports = config;
