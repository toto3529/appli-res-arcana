import { View, Text, StyleSheet } from "react-native"

export default function StatsScreen() {
  return (
    <View style={styles.container}>
      <Text>Stats et export CSV</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
})
