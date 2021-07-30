module.exports = function (api) {
  const babelEnv = api.env();
  const plugins = [];
  api.cache(true);

  if (babelEnv === 'production') {
    plugins.push('transform-remove-console');
  }

  return {
    presets: ['@babel/react', 'babel-preset-expo'],
    plugins
  };
};
