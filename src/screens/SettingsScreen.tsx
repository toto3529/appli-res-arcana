import { View, Text, ScrollView, Switch, Button, Alert, StyleSheet, TextInput } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useThemeStore } from "@stores/themeStore"
import { useGameStore } from "@stores/gameStore"
import { usePlayerStore } from "@stores/playerStore"
import { exportGamesToCSV } from "@utils/exportGamesToCSV"
import { importGamesFromCSV } from "@utils/importGamesFromCSV"
import { useCallback, useEffect, useState } from "react"
import { getCurrentSafDir, resetSafLocation } from "@utils/safStorage"
import { useFocusEffect } from "@react-navigation/native"

export default function SettingsScreen() {
  const insets = useSafeAreaInsets()

  const isDark = useThemeStore((s) => s.isDark())
  const setMode = useThemeStore((s) => s.setMode)
  const resetStats = useGameStore((s) => s.resetStats)
  const rawGames = useGameStore((state) => state.games)
  const games = rawGames.filter((g) => g.id !== "__placeholder__")

  const playerA = usePlayerStore((s) => s.playerA)
  const playerB = usePlayerStore((s) => s.playerB)
  const setPlayerA = usePlayerStore((s) => s.setPlayerA)
  const setPlayerB = usePlayerStore((s) => s.setPlayerB)

  const [currentPath, setCurrentPath] = useState<string | null>(null)

  useEffect(() => {
    getCurrentSafDir().then(setCurrentPath)
  }, [])

  useFocusEffect(
    useCallback(() => {
      getCurrentSafDir().then(setCurrentPath)
    }, []),
  )

  const toggleTheme = () => {
    setMode(isDark ? "light" : "dark")
  }

  const handleResetStats = () => {
    Alert.alert("Confirmation", "Voulez-vous vraiment supprimer toutes les statistiques ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Oui",
        style: "destructive",
        onPress: async () => {
          await resetStats()
          Alert.alert("✅ Terminé", "Toutes les parties ont été supprimées.")
        },
      },
    ])
  }

  const handleResetFolder = async () => {
    await resetSafLocation()
    setCurrentPath(null)
    Alert.alert("Réinitialisé", "Le dossier de sauvegarde sera redemandé au prochain export.")
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: isDark ? "#000" : "#fff",
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingHorizontal: 16,
      }}
    >
      {/* Titre */}
      <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>⚙️ Settings</Text>

      {/* Bloc 1 - Thème */}
      <View style={[styles.block, { backgroundColor: isDark ? "#18181b" : "#e4e4e7" }]}>
        <Text style={[styles.blockLabel, { color: isDark ? "#fff" : "#000" }]}>{isDark ? "🌙 Mode sombre" : "☀️ Mode clair"}</Text>
        <Switch value={isDark} onValueChange={toggleTheme} />
      </View>

      {/* Bloc 2 - Infos joueurs */}
      <View style={[styles.block, { backgroundColor: isDark ? "#18181b" : "#e4e4e7" }]}>
        <Text style={[styles.blockLabel, { color: isDark ? "#fff" : "#000", marginBottom: 8 }]}>👤 Nom des joueurs</Text>
        <TextInput
          placeholder="A"
          value={playerA}
          onChangeText={setPlayerA}
          style={[styles.input, { backgroundColor: isDark ? "#2a2a2a" : "#fff", color: isDark ? "#fff" : "#000" }]}
        />
        <TextInput
          placeholder="Bfdgdfgdfgd"
          value={playerB}
          onChangeText={setPlayerB}
          style={[styles.input, { backgroundColor: isDark ? "#2a2a2a" : "#fff", color: isDark ? "#fff" : "#000" }]}
        />
      </View>

      {/* Bloc 3 - Import CSV */}
      <View style={[styles.block, { backgroundColor: isDark ? "#18181b" : "#e4e4e7" }]}>
        <Button
          title="📥 Import save (.csv)"
          onPress={async () => {
            await importGamesFromCSV()
          }}
        />
      </View>

      {/* Bloc 4 - Export CSV */}
      <View style={[styles.block, { backgroundColor: isDark ? "#18181b" : "#e4e4e7" }]}>
        <Button
          title="📤 Export save (.csv)"
          onPress={async () => {
            const dir = await exportGamesToCSV(games)
            if (dir) setCurrentPath(dir)
          }}
        />
      </View>

      {/* Bloc 5 - Reset dossier sauvegarde */}
      <View style={[styles.block, { backgroundColor: isDark ? "#18181b" : "#e4e4e7" }]}>
        <Button title="♻️ Réinitialiser dossier" color="red" onPress={handleResetFolder} />
        <Text style={{ color: isDark ? "#ccc" : "#333", fontSize: 12, marginTop: 8 }}>
          {currentPath ? decodeURIComponent(currentPath) : "Aucun dossier défini"}
        </Text>
      </View>

      {/* Bloc 6 - Reset stats */}
      <View style={[styles.block, { backgroundColor: isDark ? "#18181b" : "#e4e4e7" }]}>
        <Button title=" Reset stats" color="red" onPress={handleResetStats} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  block: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  blockLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  blockText: {
    fontSize: 15,
    marginBottom: 4,
  },
  input: {
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
})
