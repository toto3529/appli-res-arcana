import { useEffect, useState } from "react"
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "src/navigation/types"
import { database } from "src/db/database"
import Game from "src/models/Game.ts"

type Props = NativeStackScreenProps<RootStackParamList, "EditGame">

export default function EditGameScreen({ route, navigation }: Props) {
  const { id } = route.params
  const [game, setGame] = useState<Game | null>(null)
  const [date, setDate] = useState(new Date())
  const [scoreA, setScoreA] = useState("")
  const [scoreB, setScoreB] = useState("")
  const [showPicker, setShowPicker] = useState(false)

  useEffect(() => {
    const load = async () => {
      const collection = database.get<Game>("games")
      const found = await collection.find(id)
      setGame(found)
      setDate(found.date)
      setScoreA(found.scoreA.toString())
      setScoreB(found.scoreB.toString())
    }

    load().catch((e) => {
      console.error("❌ Erreur chargement partie", e)
      Alert.alert("Erreur", "Impossible de charger la partie.")
      navigation.goBack()
    })
  }, [id])

  const save = async () => {
    if (!game) return

    await database.write(async () => {
      await game.update((g) => {
        g.date = date
        g.scoreA = parseInt(scoreA)
        g.scoreB = parseInt(scoreB)
      })
    })

    Alert.alert("✅ Modifié", "La partie a bien été mise à jour.")
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modifier la partie</Text>

      <Text style={styles.label}>Date de la partie :</Text>
      <Button title={date.toLocaleDateString()} onPress={() => setShowPicker(true)} />
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(_, d) => {
            if (d) setDate(d)
            setShowPicker(false)
          }}
        />
      )}

      <Text style={styles.label}>Score Joueur A :</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={scoreA} onChangeText={setScoreA} />

      <Text style={styles.label}>Score Joueur B :</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={scoreB} onChangeText={setScoreB} />

      <View style={styles.buttonWrapper}>
        <Button title="Enregistrer les modifications" onPress={save} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 24 },
  label: { fontSize: 16, marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  buttonWrapper: {
    marginTop: 12,
  },
})
