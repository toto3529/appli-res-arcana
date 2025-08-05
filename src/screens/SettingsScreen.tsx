import { View, Text, ScrollView, Switch, Button, Alert, StyleSheet } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useThemeStore } from "@stores/themeStore"
import { useGameStore } from "@stores/gameStore"

export default function SettingsScreen() {
  const insets = useSafeAreaInsets()

  const theme = useThemeStore((s) => s.effectiveTheme())
  const isDark = theme === "dark"
  const setMode = useThemeStore((s) => s.setMode)
  const resetStats = useGameStore((s) => s.resetStats)

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
        <Text style={[styles.blockText, { color: isDark ? "#fff" : "#000" }]}>👤 Joueur 1 : Toto</Text>
        <Text style={[styles.blockText, { color: isDark ? "#fff" : "#000" }]}>👤 Joueur 2 : Lulu</Text>
      </View>

      {/* Bloc 3 - Import CSV */}
      <View style={[styles.block, { backgroundColor: isDark ? "#18181b" : "#e4e4e7" }]}>
        <Button title="📥 Import save (.csv)" onPress={() => Alert.alert("Info", "Fonctionnalité à venir")} />
      </View>

      {/* Bloc 4 - Export CSV */}
      <View style={[styles.block, { backgroundColor: isDark ? "#18181b" : "#e4e4e7" }]}>
        <Button title="📤 Export save (.csv)" onPress={() => Alert.alert("Info", "Fonctionnalité à venir")} />
      </View>

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
})
