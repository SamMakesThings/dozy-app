const { getDefaultConfig } = require('@expo/metro-config');

let defaultConfig = getDefaultConfig(__dirname);

/* module.exports = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer')
  },
  resolver: {
    assetExts: [
      ...defaultConfig.resolver.assetExts.filter((ext) => ext !== 'svg')
    ],
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg']
  }
}; */

defaultConfig.resolver.sourceExts.push('svg');

defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter(
  (ext) => ext !== 'svg'
);

defaultConfig.transformer.babelTransformerPath = require.resolve(
  'react-native-svg-transformer'
);

module.exports = defaultConfig;
