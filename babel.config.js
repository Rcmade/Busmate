module.exports = function (api) {
  const isProduction = api.env('production');
  const plugins = [];

  if (isProduction) {
    plugins.push('transform-remove-console');
  }

  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: plugins,
  };
};
