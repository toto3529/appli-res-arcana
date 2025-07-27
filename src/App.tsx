import { LogBox } from "react-native"
// Ignore ce warning précis
LogBox.ignoreLogs(["Text strings must be rendered within a <Text> component"])
import { useEffect } from "react"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { DatabaseProvider } from "@nozbe/watermelondb/react"
import { database } from "./db/database"
import { useGameStore } from "./store/gameStore"
import { usePlayerStore } from "./store/playerStore"
import MainNavigation from "./navigation/MainNavigation"
import { GestureHandlerRootView } from "react-native-gesture-handler"

export default function App() {
  // const loadGames = useGameStore((s) => s.loadGames)
  // const games = useGameStore((s) => s.games)
  // const playerA = usePlayerStore((s) => s.playerA)
  // const playerB = usePlayerStore((s) => s.playerB)

  // useEffect(() => {
  //   loadGames()
  // }, [])

  // useEffect(() => {
  //   console.log("🗃️ games state changed:", games)
  // }, [games])

  // useEffect(() => {
  //   console.log("🏷️ Players:", { playerA, playerB })
  // }, [playerA, playerB])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {" "}
      {/* ← wrapper ajouté */}
      <SafeAreaProvider>
        <DatabaseProvider database={database}>
          <MainNavigation />
          <StatusBar style="auto" />
        </DatabaseProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
