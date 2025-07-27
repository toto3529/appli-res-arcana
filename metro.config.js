// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("@expo/metro-config")

module.exports = (() => {
  const config = getDefaultConfig(__dirname)

  // Prioriser le champ "react-native" (qui pointe vers build/index.js) puis "browser" et enfin "main"
  config.resolver.mainFields = ["react-native", "browser", "main"]

 // Autoriser la résolution des fichiers *.reanimated.js pour pouvoir importer Swipeable.reanimated.js
  config.resolver.sourceExts.push("reanimated.js")
  return config
})()
