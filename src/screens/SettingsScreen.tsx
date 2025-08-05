import { useThemeStore } from "@stores/themeStore"
import { ScrollView, View, Text, Button, Switch } from "react-native"

export default function SettingsScreen() {
  const { isDark, toggleTheme } = useThemeStore()

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: isDark ? "#000" : "#fff",
        padding: 16,
      }}
    >
      {/* Titre */}
      <Text
        style={{
          color: isDark ? "#fff" : "#000",
          fontSize: 20,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        Settings
      </Text>

      {/* Bloc 1 - Mode sombre */}
      <View
        style={{
          backgroundColor: isDark ? "#18181b" : "#e4e4e7",
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ color: isDark ? "#fff" : "#000", fontSize: 16 }}>Mode sombre</Text>
        <Switch value={isDark} onValueChange={toggleTheme} />
      </View>

      {/* Bloc 2 - Infos joueurs (affichage uniquement) */}
      <View
        style={{
          backgroundColor: isDark ? "#18181b" : "#e4e4e7",
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
        }}
      >
        <Text style={{ color: isDark ? "#fff" : "#000", marginBottom: 4 }}>👤 Joueur 1 : Toto</Text>
        <Text style={{ color: isDark ? "#fff" : "#000" }}>👤 Joueur 2 : Lulu</Text>
      </View>

      {/* Bloc 3 - Import CSV (bouton inactif) */}
      <View
        style={{
          backgroundColor: isDark ? "#18181b" : "#e4e4e7",
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
        }}
      >
        <Button
          title="📥 Import save (.csv)"
          onPress={() => {
            alert("À implémenter")
          }}
        />
      </View>

      {/* Bloc 4 - Export CSV (bouton inactif) */}
      <View
        style={{
          backgroundColor: isDark ? "#18181b" : "#e4e4e7",
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
        }}
      >
        <Button
          title="📤 Export save (.csv)"
          onPress={() => {
            alert("À implémenter")
          }}
        />
      </View>

      {/* Bloc 5 - Reset stats (placeholder) */}
      <View
        style={{
          backgroundColor: isDark ? "#18181b" : "#e4e4e7",
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
        }}
      >
        <Button
          color="red"
          title="🗑 Reset stats"
          onPress={() => {
            alert("Ajoute une modale de confirmation ici")
          }}
        />
      </View>
    </ScrollView>
  )
}
