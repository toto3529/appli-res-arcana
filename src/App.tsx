import { LogBox, View } from "react-native"
LogBox.ignoreLogs(["Text strings must be rendered within a <Text> component"])

import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { DatabaseProvider } from "@nozbe/watermelondb/react"
import { database } from "./db/database"
import MainNavigation from "./navigation/MainNavigation"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { useThemeStore } from "@stores/themeStore"
import { useEffect, useState } from "react"
import { usePlayerStore } from "@stores/playerStore"
import BootSplash from "react-native-bootsplash"

export default function App() {
  const loadTheme = useThemeStore((s) => s.loadTheme)
  const theme = useThemeStore((s) => s.mode)
  const loadPlayers = usePlayerStore((s) => s.loadPlayers)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const init = async () => {
      await loadTheme()
      await loadPlayers()
      setIsReady(true)
      await BootSplash.hide({ fade: true })
    }
    init()
  }, [])

  if (!isReady) return null

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <DatabaseProvider database={database}>
          <View style={{ flex: 1, backgroundColor: theme === "dark" ? "#000" : "#fff" }}>
            <MainNavigation />
            <StatusBar style={theme === "dark" ? "light" : "dark"} />
          </View>
        </DatabaseProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
