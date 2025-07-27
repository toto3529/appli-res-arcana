module.exports = function (api) {
  api.cache(true)
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Gestion des décorateurs en "legacy" (nécessaire pour WatermelonDB)
      ["@babel/plugin-proposal-decorators", { legacy: true }],
      // Nécessaire pour les décorateurs de propriétés
      ["@babel/plugin-proposal-class-properties", { loose: true }],
      // ce plugin doit toujours être le **dernier**
      "react-native-worklets/plugin",
    ],
  }
}
