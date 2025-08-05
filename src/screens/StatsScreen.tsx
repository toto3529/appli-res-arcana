import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native"
import { useGameStore } from "@stores/gameStore"
import MonthlyStats from "./MonthlyStats"
import { SafeAreaView } from "react-native-safe-area-context"
import { GlobalStats } from "./GlobalStats"
import { useThemeStore } from "@stores/themeStore"

export default function StatsScreen() {
  const { games } = useGameStore()
  const [tab, setTab] = useState<"month" | "global">("month")
  const { isDark } = useThemeStore()
  const background = isDark ? "#000" : "#f9f9f9"
  const inactiveTabBackground = isDark ? "#222" : "#eaeaea"
  const inactiveTabText = isDark ? "#ccc" : "#333"

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: background,
      paddingTop: 0,
    },
    tabContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 16,
      marginHorizontal: 16,
      borderWidth: 1,
      borderRadius: 8,
      overflow: "hidden",
      borderColor: isDark ? "#444" : "#ccc",
    },
    tabButton: {
      flex: 1,
      paddingVertical: 12,
      backgroundColor: inactiveTabBackground,
      alignItems: "center",
    },
    activeTab: {
      backgroundColor: "#007bff",
    },
    tabText: {
      fontWeight: "bold",
      color: inactiveTabText,
    },
    activeTabText: {
      color: "white",
    },
    content: {
      padding: 16,
    },
  })

  return (
    <SafeAreaView style={styles.container}>
      {/* Tabs Mois / Global */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tabButton, tab === "month" && styles.activeTab]} onPress={() => setTab("month")}>
          <Text style={[styles.tabText, tab === "month" && styles.activeTabText]}>Mois</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, tab === "global" && styles.activeTab]} onPress={() => setTab("global")}>
          <Text style={[styles.tabText, tab === "global" && styles.activeTabText]}>Global</Text>
        </TouchableOpacity>
      </View>

      {/* Contenu */}
      <ScrollView contentContainerStyle={styles.content}>
        {tab === "month" ? <MonthlyStats games={games} /> : <GlobalStats games={games} />}
      </ScrollView>
    </SafeAreaView>
  )
}
