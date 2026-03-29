import { useState } from "react"
import { View, Text, TouchableOpacity, ScrollView } from "react-native"
import { useGameStore } from "@stores/gameStore"
import MonthlyStats from "./MonthlyStats"
import { SafeAreaView } from "react-native-safe-area-context"
import { GlobalStats } from "./GlobalStats"
import { useAppStyles } from "src/styles/useAppStyles"

export default function StatsScreen() {
  const { games } = useGameStore()
  const [tab, setTab] = useState<"month" | "global">("month")
  const styles = useAppStyles()

  return (
    <SafeAreaView style={styles.statsContainer}>
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tabButton, tab === "month" && styles.tabButtonActive]} onPress={() => setTab("month")}>
          <Text style={[styles.tabText, tab === "month" && styles.tabTextActive]}>Mois</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, tab === "global" && styles.tabButtonActive]} onPress={() => setTab("global")}>
          <Text style={[styles.tabText, tab === "global" && styles.tabTextActive]}>Global</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {tab === "month" ? <MonthlyStats games={games} /> : <GlobalStats games={games} />}
      </ScrollView>
    </SafeAreaView>
  )
}
