module.exports = function BabelConfig(api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["expo-router/babel"]
  };
};
