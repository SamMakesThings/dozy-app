module.exports = function (api) {
  const babelEnv = api.env();
  const plugins = [];
  api.cache(true);

  if (babelEnv === 'production') {
    plugins.push('transform-remove-console');
  }
  plugins.push('react-native-reanimated/plugin');

  return {
    presets: ['@babel/react', 'babel-preset-expo'],
    plugins: [
      ...plugins,
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
    ],
  };
};
