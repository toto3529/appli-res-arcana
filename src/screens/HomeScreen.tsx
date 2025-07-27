import { useCallback, useRef } from "react"
import { View, Text, TouchableOpacity, Button, Alert, StyleSheet, LayoutAnimation } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import { SwipeListView, SwipeRow } from "react-native-swipe-list-view"
import { format } from "date-fns"
import { useGameStore } from "src/store/gameStore"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "src/navigation/types"

type Props = NativeStackScreenProps<RootStackParamList, "HomeMain">

export default function HomeScreen({ navigation }: Props) {
  const games = useGameStore((s) => s.games)
  const loadGames = useGameStore((s) => s.loadGames)
  const deleteGame = useGameStore((s) => s.deleteGame)
  const listRef = useRef<SwipeListView<any>>(null)
  const openRowRef = useRef<SwipeRow<any> | null>(null)

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
    console.log(" Suppression demandée pour :", id)
    Alert.alert("Supprimer la partie", "Voulez-vous vraiment supprimer cette partie ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => {
          //LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
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
          //initialNumToRender={10}
          leftOpenValue={80}
          rightOpenValue={-80}
          contentContainerStyle={{ paddingBottom: 100 }}
          //removeClippedSubviews={false}

          onRowOpen={(rowKey, rowMap) => {
            if (openRowRef.current && openRowRef.current !== rowMap[rowKey]) {
              openRowRef.current.closeRow()
            }
            openRowRef.current = rowMap[rowKey]
          }}
          // renderItem={({ item }) => {
          //   const winA = item.scoreA > item.scoreB
          //   return (
          //     <TouchableOpacity style={styles.rowFront} activeOpacity={0.7}>
          //       <View style={styles.rowHeader}>
          //         <Text style={styles.date}>{format(item.date, "dd/MM/yyyy")}</Text>
          //         <Text style={[styles.indicator, winA ? styles.win : styles.loss]}>{winA ? "✓" : "✗"}</Text>
          //       </View>
          //       <Text style={styles.score}>
          //         {item.scoreA} – {item.scoreB}
          //       </Text>
          //     </TouchableOpacity>
          //   )
          // }}

          renderItem={({ item }) => {
            const winA = item.scoreA > item.scoreB
            const playerA = "Toto" // 🔁 Tu pourras remplacer dynamiquement plus tard
            const playerB = "Lulu"

            return (
              <TouchableOpacity style={styles.rowFront} activeOpacity={1}>
                <View style={styles.rowContent}>
                  {/* Joueur A (à gauche) */}
                  <View style={styles.playerBox}>
                    <Text style={styles.playerName}>{playerA}</Text>
                    <Text style={[styles.status, winA ? styles.win : styles.loss]}>{winA ? "Victory ✅" : "Defeat ❌"}</Text>
                  </View>

                  {/* Score centré */}
                  <View style={styles.scoreBox}>
                    <Text style={styles.scoreText}>
                      {item.scoreA} – {item.scoreB}
                    </Text>
                    <Text style={styles.dateText}>{format(item.date, "dd/MM/yyyy")}</Text>
                  </View>

                  {/* Joueur B (à droite) */}
                  <View style={styles.playerBox}>
                    <Text style={styles.playerName}>{playerB}</Text>
                    <Text style={[styles.status, !winA ? styles.win : styles.loss]}>{!winA ? "Victory ✅" : "Defeat ❌"}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 32,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 12,
  },
  listWrapper: {
    flex: 1,
    overflow: "hidden",
  },
  rowFront: {
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 0,
    height: 80, // ✅ Hauteur fixe
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: "#eee", // ✅ Appliqué ici pour couvrir les boutons
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
  indicator: {
    fontSize: 18,
    fontWeight: "bold",
  },
  win: {
    color: "green",
  },
  loss: {
    color: "red",
  },
  score: {
    fontSize: 20,
    textAlign: "center",
  },
  rowBack: {
    position: "absolute",
    top: 6,
    bottom: 6,
    left: 16,
    right: 16,
    height: 80, // ✅ Même hauteur que rowFront
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 4,
    overflow: "hidden",
  },

  deleteButton: {
    width: 80, // ✅ Largeur = hauteur = 80px = carré
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
    backgroundColor: "#fff",
  },
  editButton: {
    width: 80, // ✅ Largeur = hauteur = 80px = carré
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

  rowContent: {
    backgroundColor: "#eee",
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
  },

  dateText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
})
