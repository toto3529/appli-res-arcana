import { View, Text, ScrollView, Switch, Button, Alert, StyleSheet, TextInput, TouchableOpacity } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useThemeStore } from "@stores/themeStore"
import { useGameStore } from "@stores/gameStore"
import { usePlayerStore } from "@stores/playerStore"
import { exportGamesToCSV } from "@utils/exportGamesToCSV"

export default function SettingsScreen() {
  const insets = useSafeAreaInsets()

  const isDark = useThemeStore((s) => s.isDark())
  const setMode = useThemeStore((s) => s.setMode)
  const resetStats = useGameStore((s) => s.resetStats)
  const games = useGameStore((s) => s.games)

  const playerA = usePlayerStore((s) => s.playerA)
  const playerB = usePlayerStore((s) => s.playerB)
  const setPlayerA = usePlayerStore((s) => s.setPlayerA)
  const setPlayerB = usePlayerStore((s) => s.setPlayerB)

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

      {/* Bloc 2 - Infos joueurs (mock) */}
      <View style={[styles.block, { backgroundColor: isDark ? "#18181b" : "#e4e4e7" }]}>
        <Text style={[styles.blockLabel, { color: isDark ? "#fff" : "#000", marginBottom: 8 }]}>👤 Nom des joueurs</Text>
        <TextInput
          placeholder="A"
          value={playerA}
          onChangeText={setPlayerA}
          style={[styles.input, { backgroundColor: isDark ? "#2a2a2a" : "#fff", color: isDark ? "#fff" : "#000" }]}
        />
        <TextInput
          placeholder="B"
          value={playerB}
          onChangeText={setPlayerB}
          style={[styles.input, { backgroundColor: isDark ? "#2a2a2a" : "#fff", color: isDark ? "#fff" : "#000" }]}
        />
      </View>

      {/* Bloc 3 - Import CSV */}
      <View style={[styles.block, { backgroundColor: isDark ? "#18181b" : "#e4e4e7" }]}>
        <Button title="📥 Import save (.csv)" onPress={() => Alert.alert("Info", "Fonctionnalité à venir")} />
      </View>

      {/* Bloc 4 - Export CSV */}
      <TouchableOpacity
        style={[styles.block, { backgroundColor: isDark ? "#18181b" : "#e4e4e7" }]}
        onPress={async () => {
          try {
            const path = await exportGamesToCSV(games)
            Alert.alert("✅ CSV généré", `Fichier sauvegardé avec succès !\n\n📁 Chemin :\n${path}`, [{ text: "OK", style: "default" }])
          } catch (err: any) {
            Alert.alert("❌ Erreur", err.message || "Une erreur est survenue.")
          }
        }}
      >
        <Text style={[styles.blockTitle, { color: isDark ? "#fff" : "#000" }]}>📤 Export CSV</Text>
        <Text style={[styles.blockText, { color: isDark ? "#fff" : "#000" }]}>Sauvegarder vos parties dans un fichier CSV</Text>
      </TouchableOpacity>

      {/* Bloc 5 - Reset stats */}
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
  blockTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#fff",
  },
})
