import { calculateMonthlyStats, getCurrentWinStreak, getFilteredGamesByMonth, getMonthLabel } from "@utils/statsHelpers"
import { useMemo, useState } from "react"
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native"
import { Game } from "src/stores/gameStore"
import { sharedStyles } from "./StatsScreen.styles"

interface Props {
  games: Game[]
}

const MonthlyStats = ({ games }: Props) => {
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0)

  const currentDate = useMemo(() => {
    const now = new Date()
    now.setMonth(now.getMonth() + currentMonthOffset)
    return now
  }, [currentMonthOffset])

  const filteredGames = useMemo(() => getFilteredGamesByMonth(games, currentDate), [games, currentDate])
  const stats = useMemo(() => calculateMonthlyStats(filteredGames), [filteredGames])
  const currentStreak = useMemo(() => getCurrentWinStreak(filteredGames), [filteredGames])
  const isLoading = false

  const handlePrevMonth = () => setCurrentMonthOffset((prev) => prev - 1)
  const handleNextMonth = () => setCurrentMonthOffset((prev) => prev + 1)

  return (
    <View style={sharedStyles.container}>
      {/* Sélection du mois */}
      <View style={styles.monthSelector}>
        <TouchableOpacity onPress={handlePrevMonth} style={styles.monthButton}>
          <Text style={styles.monthButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.monthLabel}>{getMonthLabel(currentDate)}</Text>
        <TouchableOpacity onPress={handleNextMonth} style={styles.monthButton}>
          <Text style={styles.monthButtonText}>→</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <View style={styles.blocksWrapper}>
          {filteredGames.length < 5 ? (
            <Text style={sharedStyles.warning}>Pas assez de parties enregistrées.</Text>
          ) : (
            <>
              {/* Score du mois */}
              <View style={sharedStyles.block}>
                <Text style={sharedStyles.blockTitle}>Score du mois</Text>
                <View style={styles.row}>
                  <View style={styles.column}>
                    <Text style={sharedStyles.playerName}>Joueur A</Text>
                    <Text style={sharedStyles.playerValue}>{stats.totalPointsA} pts</Text>
                  </View>
                  <View style={styles.separator} />
                  <View style={styles.column}>
                    <Text style={sharedStyles.playerName}>Joueur B</Text>
                    <Text style={sharedStyles.playerValue}>{stats.totalPointsB} pts</Text>
                  </View>
                </View>
              </View>

              {/* 📈 Série de victoires en cours */}
              <View style={sharedStyles.block}>
                <Text style={sharedStyles.blockTitle}>📈 Série de victoires en cours</Text>
                <Text style={sharedStyles.blockText}>
                  {currentStreak.count > 0
                    ? `Joueur ${currentStreak.player} – ${currentStreak.count} victoire${currentStreak.count > 1 ? "s" : ""}`
                    : "ni l’un ni l’autre 😅"}
                </Text>
              </View>

              {/* % Victoires / Parties */}
              <View style={sharedStyles.block}>
                <Text style={sharedStyles.blockTitle}>Nombre de parties : {stats.totalGames}</Text>

                <View style={styles.row}>
                  <View style={styles.half}>
                    <Text style={sharedStyles.label}>Joueur A</Text>
                    <Text style={sharedStyles.value}>{stats.winRateA}%</Text>
                  </View>
                  <View style={styles.half}>
                    <Text style={sharedStyles.label}>Joueur B</Text>
                    <Text style={sharedStyles.value}>{stats.winRateB}%</Text>
                  </View>
                </View>

                <Text style={[sharedStyles.label, { textAlign: "center", marginTop: 6 }]}>Matchs nuls : {stats.drawRate}%</Text>
              </View>

              {/* Donut Chart Placeholder */}
              <View style={sharedStyles.block}>
                <Text style={sharedStyles.blockTitle}>📊 Donut répartitions V/D</Text>
                <Text style={sharedStyles.blockText}>[À intégrer plus tard]</Text>
              </View>

              {/* Dernières parties */}
              <View style={sharedStyles.block}>
                <Text style={sharedStyles.blockTitle}>Historique des dernières parties</Text>
                <View style={styles.historyRow}>
                  <View style={styles.historyColumn}>
                    <Text style={sharedStyles.blockText}>Toto</Text>
                    <Text style={styles.historyText}>
                      {stats.lastResults
                        .slice(-5)
                        .map((r) => (r === "A" ? "V" : r === "B" ? "D" : "N"))
                        .join(" ")}
                    </Text>
                  </View>
                  <View style={styles.historyColumn}>
                    <Text style={sharedStyles.blockText}>Lulu</Text>
                    <Text style={styles.historyText}>
                      {stats.lastResults
                        .slice(-5)
                        .map((r) => (r === "B" ? "V" : r === "A" ? "D" : "N"))
                        .join(" ")}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Moyenne des points */}
              <View style={sharedStyles.block}>
                <Text style={sharedStyles.blockTitle}>Moyenne de points / partie</Text>
                <View style={styles.row}>
                  <View style={styles.column}>
                    <Text style={sharedStyles.playerLabel}>Joueur A</Text>
                    <Text style={sharedStyles.blockText}>{stats.avgScoreA} pts</Text>
                  </View>
                  <Text style={styles.separator}>|</Text>
                  <View style={styles.column}>
                    <Text style={sharedStyles.playerLabel}>Joueur B</Text>
                    <Text style={sharedStyles.blockText}>{stats.avgScoreB} pts</Text>
                  </View>
                </View>
              </View>

              {/* Meilleure victoire */}
              <View style={sharedStyles.block}>
                <Text style={sharedStyles.blockTitle}>Meilleure victoire</Text>
                <View style={styles.rowBetween}>
                  <View style={styles.playerStat}>
                    <Text style={sharedStyles.playerName}>Joueur A</Text>
                    <Text style={sharedStyles.playerValue}>{stats.bestVictoryA} pts</Text>
                  </View>
                  <View style={styles.playerStat}>
                    <Text style={sharedStyles.playerName}>Joueur B</Text>
                    <Text style={sharedStyles.playerValue}>{stats.bestVictoryB} pts</Text>
                  </View>
                </View>
              </View>
            </>
          )}
        </View>
      )}
    </View>
  )
}

export default MonthlyStats

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#000",
    flex: 1,
  },
  monthSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  monthButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#333",
    borderRadius: 8,
  },
  monthButtonText: {
    fontSize: 18,
    color: "#fff",
  },
  monthLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  blocksWrapper: {
    gap: 10,
  },
  block: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#444",
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
  },
  blockText: {
    color: "#ccc",
    fontSize: 14,
  },
  warning: {
    color: "#f99",
    fontSize: 16,
    fontStyle: "italic",
  },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
  },
  historyColumn: {
    alignItems: "center",
    flex: 1,
  },
  historyText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 4,
  },

  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  column: {
    alignItems: "center",
    marginHorizontal: 12,
  },
  separator: {
    color: "#888",
    fontSize: 18,
    marginHorizontal: 8,
  },
  playerLabel: {
    fontWeight: "bold",
    color: "#aaa",
    marginBottom: 4,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  playerStat: {
    alignItems: "center",
    flex: 1,
  },
  playerName: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 4,
  },
  playerValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  half: {
    flex: 1,
    alignItems: "center",
  },
  label: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 2,
  },
  value: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})
