module.exports = function (api) {
  api.cache(true)
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Nécessaire pour WatermelonDB
      ["@babel/plugin-proposal-decorators", { legacy: true }],
      ["@babel/plugin-transform-class-properties", { loose: true }],
      // Résolution des alias @stores, @utils, etc.
      ["module-resolver", {
        root: ["./src"],
        alias: {
          "@stores": "./src/stores",
          "@utils": "./src/utils",
          "@components": "./src/components",
          "@styles": "./src/styles",
          "@screens": "./src/screens",
          "@navigation": "./src/navigation",
        }
      }]
    ],
  }
}