import { View, Text, StyleSheet } from "react-native"

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text>Réglages (noms des joueurs)</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
})
