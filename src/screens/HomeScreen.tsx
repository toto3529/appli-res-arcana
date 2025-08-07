import { useCallback, useRef } from "react"
import { View, Text, TouchableOpacity, Button, Alert, StyleSheet, LayoutAnimation } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import { SwipeListView, SwipeRow } from "react-native-swipe-list-view"
import { format } from "date-fns"
import { useGameStore } from "@stores/gameStore"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "src/navigation/types"
import { useThemeStore } from "@stores/themeStore"
import { usePlayerStore } from "@stores/playerStore"

type Props = NativeStackScreenProps<RootStackParamList, "HomeMain">

export default function HomeScreen({ navigation }: Props) {
  const rawGames = useGameStore((state) => state.games)
  const games = rawGames.filter((g) => g.id !== "__placeholder__")
  const loadGames = useGameStore((s) => s.loadGames)
  const deleteGame = useGameStore((s) => s.deleteGame)
  const listRef = useRef<SwipeListView<any>>(null)
  const openRowRef = useRef<SwipeRow<any> | null>(null)
  const isDark = useThemeStore((s) => s.isDark())
  const { playerA, playerB } = usePlayerStore()

  const colors = {
    background: isDark ? "#000" : "#fff",
    card: isDark ? "#1a1a1a" : "#eee",
    textMain: isDark ? "#fff" : "#000",
    textSecondary: isDark ? "#ccc" : "#666",
    win: "green",
    loss: "red",
    draw: "#888",
    buttonBg: isDark ? "#111" : "#fff",
  }

  useFocusEffect(
    useCallback(() => {
      loadGames()
    }, [loadGames]),
  )

  const handleEdit = (id: string, rowMap: { [key: string]: SwipeRow<any> }) => {
    const rowRef = rowMap[id]
    if (rowRef) rowRef.closeRow() // ← Ferme le swipe si encore ouvert
    navigation.navigate("EditGame", { id })
  }

  const confirmDelete = (id: string) => {
    Alert.alert("Supprimer la partie", "Voulez-vous vraiment supprimer cette partie ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
          deleteGame(id)
        },
      },
    ])
  }

  // On trie & slice les 20 dernières parties
  const data = [...games]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 20)
    .map((item) => ({ key: item.id, ...item }) as any) // SwipeListView exige un champ `key`

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 32,
    },
    title: {
      textAlign: "center",
      fontSize: 20,
      fontWeight: "bold",
      color: colors.textMain,
    },
    subtitle: {
      textAlign: "center",
      fontSize: 16,
      marginBottom: 12,
      color: colors.textSecondary,
    },
    listWrapper: {
      flex: 1,
      overflow: "hidden",
    },
    rowFront: {
      marginHorizontal: 16,
      marginVertical: 6,
      height: 80,
      borderRadius: 4,
      overflow: "hidden",
      backgroundColor: colors.card,
    },
    rowContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 12,
    },
    playerBox: {
      width: "30%",
      alignItems: "center",
      justifyContent: "center",
    },
    playerName: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.textMain,
    },
    status: {
      fontSize: 14,
    },
    scoreBox: {
      width: "40%",
      alignItems: "center",
      justifyContent: "center",
    },
    scoreText: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.textMain,
    },
    dateText: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
    },
    rowBack: {
      position: "absolute",
      top: 6,
      bottom: 6,
      left: 16,
      right: 16,
      height: 80,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderRadius: 4,
      overflow: "hidden",
    },
    editButton: {
      width: 80,
      height: 80,
      backgroundColor: "#4CAF50",
      justifyContent: "center",
      alignItems: "center",
      borderTopLeftRadius: 4,
      borderBottomLeftRadius: 4,
    },
    editText: {
      color: "#fff",
      fontWeight: "bold",
    },
    deleteButton: {
      width: 80,
      height: 80,
      backgroundColor: "red",
      justifyContent: "center",
      alignItems: "center",
      borderTopRightRadius: 4,
      borderBottomRightRadius: 4,
    },
    deleteText: {
      color: "#fff",
      fontWeight: "bold",
    },
    addButtonContainer: {
      position: "absolute",
      bottom: 0,
      width: "100%",
      padding: 16,
      backgroundColor: colors.buttonBg,
    },
    win: {
      color: colors.win,
    },
    loss: {
      color: colors.loss,
    },
    draw: {
      color: colors.draw,
    },
  })

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RES ARCANA</Text>
      <Text style={styles.subtitle}>Dernières parties</Text>

      <View style={styles.listWrapper}>
        <SwipeListView
          ref={listRef}
          data={data}
          bounces={false}
          keyExtractor={(item) => item.key}
          leftOpenValue={80}
          rightOpenValue={-80}
          contentContainerStyle={{ paddingBottom: 100 }}
          onRowOpen={(rowKey, rowMap) => {
            if (openRowRef.current && openRowRef.current !== rowMap[rowKey]) {
              openRowRef.current.closeRow()
            }
            openRowRef.current = rowMap[rowKey]
          }}
          renderItem={({ item }) => {
            let winA: boolean | null = item.scoreA > item.scoreB
            const draw = item.scoreA === item.scoreB

            if (draw && item.winnerOnTie === "A") winA = true
            else if (draw && item.winnerOnTie === "B") winA = false
            else if (draw && item.winnerOnTie === "equal") winA = null

            return (
              <TouchableOpacity style={styles.rowFront} activeOpacity={1}>
                <View style={styles.rowContent}>
                  {/* Joueur A */}
                  <View style={styles.playerBox}>
                    <Text style={styles.playerName}>{playerA}</Text>
                    <Text style={[styles.status, winA === true ? styles.win : winA === false ? styles.loss : styles.draw]}>
                      {winA === true ? "Victory ✅" : winA === false ? "Defeat ❌" : "Draw 🤝"}
                    </Text>
                  </View>

                  {/* Score */}
                  <View style={styles.scoreBox}>
                    <Text style={styles.scoreText}>
                      {item.scoreA} – {item.scoreB}
                    </Text>
                    <Text style={styles.dateText}>{format(item.date, "dd/MM/yyyy")}</Text>
                  </View>

                  {/* Joueur B */}
                  <View style={styles.playerBox}>
                    <Text style={styles.playerName}>{playerB}</Text>
                    <Text style={[styles.status, winA === false ? styles.win : winA === true ? styles.loss : styles.draw]}>
                      {winA === false ? "Victory ✅" : winA === true ? "Defeat ❌" : "Draw 🤝"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )
          }}
          renderHiddenItem={({ item }, rowMap) => (
            <View style={styles.rowBack}>
              {/* Swipe gauche (Éditer) */}
              <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item.key, rowMap)}>
                <Text style={styles.editText}>Éditer</Text>
              </TouchableOpacity>

              {/* Swipe droite (Supprimer) */}
              <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item.key)}>
                <Text style={styles.deleteText}>Suppr</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        <View style={styles.addButtonContainer}>
          <Button title="Ajouter une partie" onPress={() => navigation.navigate("AddGame")} />
        </View>
      </View>
    </View>
  )
}
