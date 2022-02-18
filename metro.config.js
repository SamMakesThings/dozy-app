const { getDefaultConfig } = require('expo/metro-config');

let defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  transformer: {
    assetPlugins: ['expo-asset/tools/hashAssetFiles'],
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: [
      ...defaultConfig.resolver.assetExts.filter((ext) => ext !== 'svg'),
    ],
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
  },
};
