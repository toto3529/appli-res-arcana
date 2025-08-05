import { calculateMonthlyStats, getCurrentWinStreak, getFilteredGamesByMonth, getMonthLabel } from "@utils/statsHelpers"
import { useMemo, useState } from "react"
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native"
import { Game } from "src/stores/gameStore"
import { useStatsStyles } from "./StatsScreen.styles"

interface Props {
  games: Game[]
}

const MonthlyStats = ({ games }: Props) => {
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0)
  const sharedStyles = useStatsStyles()

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
      <View style={sharedStyles.monthSelector}>
        <TouchableOpacity onPress={handlePrevMonth} style={sharedStyles.monthButton}>
          <Text style={sharedStyles.monthButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={sharedStyles.monthLabel}>{getMonthLabel(currentDate)}</Text>
        <TouchableOpacity onPress={handleNextMonth} style={sharedStyles.monthButton}>
          <Text style={sharedStyles.monthButtonText}>→</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <View style={sharedStyles.blocksWrapper}>
          {filteredGames.length < 5 ? (
            <Text style={sharedStyles.warning}>Pas assez de parties enregistrées.</Text>
          ) : (
            <>
              {/* Score du mois */}
              <View style={sharedStyles.block}>
                <Text style={sharedStyles.blockTitle}>Score du mois</Text>
                <View style={sharedStyles.row}>
                  <View style={sharedStyles.column}>
                    <Text style={sharedStyles.playerName}>Joueur A</Text>
                    <Text style={sharedStyles.playerValue}>{stats.totalPointsA} pts</Text>
                  </View>
                  <View style={sharedStyles.separator} />
                  <View style={sharedStyles.column}>
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

                <View style={sharedStyles.row}>
                  <View style={sharedStyles.half}>
                    <Text style={sharedStyles.label}>Joueur A</Text>
                    <Text style={sharedStyles.value}>{stats.winRateA}%</Text>
                  </View>
                  <View style={sharedStyles.half}>
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
                <View style={sharedStyles.historyRow}>
                  <View style={sharedStyles.historyColumn}>
                    <Text style={sharedStyles.blockText}>Toto</Text>
                    <Text style={sharedStyles.historyText}>
                      {stats.lastResults
                        .slice(-5)
                        .map((r) => (r === "A" ? "V" : r === "B" ? "D" : "N"))
                        .join(" ")}
                    </Text>
                  </View>
                  <View style={sharedStyles.historyColumn}>
                    <Text style={sharedStyles.blockText}>Lulu</Text>
                    <Text style={sharedStyles.historyText}>
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
                <View style={sharedStyles.row}>
                  <View style={sharedStyles.column}>
                    <Text style={sharedStyles.playerLabel}>Joueur A</Text>
                    <Text style={sharedStyles.blockText}>{stats.avgScoreA} pts</Text>
                  </View>
                  <Text style={sharedStyles.separator}>|</Text>
                  <View style={sharedStyles.column}>
                    <Text style={sharedStyles.playerLabel}>Joueur B</Text>
                    <Text style={sharedStyles.blockText}>{stats.avgScoreB} pts</Text>
                  </View>
                </View>
              </View>

              {/* Meilleure victoire */}
              <View style={sharedStyles.block}>
                <Text style={sharedStyles.blockTitle}>Meilleure victoire</Text>
                <View style={sharedStyles.rowBetween}>
                  <View style={sharedStyles.playerStat}>
                    <Text style={sharedStyles.playerName}>Joueur A</Text>
                    <Text style={sharedStyles.playerValue}>{stats.bestVictoryA} pts</Text>
                  </View>
                  <View style={sharedStyles.playerStat}>
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

const styles = StyleSheet.create({})
