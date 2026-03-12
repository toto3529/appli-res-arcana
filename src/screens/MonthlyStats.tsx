import { calculateMonthlyStats, getCurrentWinStreak, getFilteredGamesByMonth, getMonthLabel } from "@utils/statsHelpers"
import { useMemo, useState } from "react"
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native"
import { Game } from "src/stores/gameStore"
import { useStatsStyles } from "./StatsScreen.styles"
import { usePlayerStore } from "@stores/playerStore"
import PieChart from "@components/PieChart"

interface Props {
  games: Game[]
}

const MonthlyStats = ({ games }: Props) => {
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0)
  const sharedStyles = useStatsStyles()
  const { playerA, playerB } = usePlayerStore()

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
          {filteredGames.length < 2 ? (
            <Text style={sharedStyles.warning}>Pas assez de parties enregistrées.</Text>
          ) : (
            <>
              {/* Score du mois */}
              <View style={sharedStyles.block}>
                <Text style={sharedStyles.blockTitle}>Score du mois</Text>
                <View style={sharedStyles.row}>
                  <View style={sharedStyles.column}>
                    <Text style={sharedStyles.playerName}>{playerA}</Text>
                    <Text style={sharedStyles.playerValue}>{stats.totalPointsA} pts</Text>
                  </View>
                  <View style={sharedStyles.separator} />
                  <View style={sharedStyles.column}>
                    <Text style={sharedStyles.playerName}>{playerB}</Text>
                    <Text style={sharedStyles.playerValue}>{stats.totalPointsB} pts</Text>
                  </View>
                </View>
              </View>

              {/* Série de victoires en cours */}
              <View style={sharedStyles.block}>
                <Text style={sharedStyles.blockTitle}>Série de victoires en cours</Text>
                <Text style={sharedStyles.blockText}>
                  {currentStreak.count > 0
                    ? `${currentStreak.player === "A" ? playerA : playerB} – ${currentStreak.count} victoire${currentStreak.count > 1 ? "s" : ""}`
                    : "ni l’un ni l’autre 😅"}
                </Text>
              </View>

              {/* % Victoires / Parties */}
              <View style={sharedStyles.block}>
                <Text style={sharedStyles.blockTitle}>Nombre de parties : {stats.totalGames}</Text>

                <View style={sharedStyles.winRateBar}>
                  {stats.winRateA > 0 && (
                    <View style={[sharedStyles.winRateSegmentA, { flex: stats.winRateA }]}>
                      <Text style={sharedStyles.winRateSegmentText}>{stats.winRateA}%</Text>
                    </View>
                  )}
                  {stats.drawRate > 0 && (
                    <View style={[sharedStyles.winRateSegmentDraw, { flex: stats.drawRate }]}>
                      <Text style={sharedStyles.winRateSegmentText}>{stats.drawRate}%</Text>
                    </View>
                  )}
                  {stats.winRateB > 0 && (
                    <View style={[sharedStyles.winRateSegmentB, { flex: stats.winRateB }]}>
                      <Text style={sharedStyles.winRateSegmentText}>{stats.winRateB}%</Text>
                    </View>
                  )}
                </View>

                <View style={sharedStyles.row}>
                  <View style={sharedStyles.half}>
                    <Text style={sharedStyles.label}>{playerA}</Text>
                  </View>
                  <View style={sharedStyles.half}>
                    <Text style={[sharedStyles.label, { textAlign: "right" }]}>{playerB}</Text>
                  </View>
                </View>
              </View>

              {/* Donut Répartitions Victoires / Défaites */}
              <View style={sharedStyles.block}>
                <Text style={sharedStyles.blockTitle}>Répartition Victoires / Défaites</Text>
                <View style={sharedStyles.pieContainer}>
                  <PieChart valueA={stats.winRateA} valueB={stats.winRateB} valueDraw={stats.drawRate} labelA={playerA} labelB={playerB} />
                </View>
              </View>

              {/* Dernières parties */}
              <View style={sharedStyles.block}>
                <Text style={sharedStyles.blockTitle}>Historique des dernières parties</Text>
                <View style={sharedStyles.historyRow}>
                  <View style={sharedStyles.historyColumn}>
                    <Text style={sharedStyles.blockText}>{playerA}</Text>
                    <View style={{ flexDirection: "row", gap: 4, marginTop: 4 }}>
                      {stats.lastResults.slice(-5).map((r, i) => (
                        <Text
                          key={i}
                          style={
                            r === "A" ? sharedStyles.historyLetterWin : r === "B" ? sharedStyles.historyLetterLoss : sharedStyles.historyLetterDraw
                          }
                        >
                          {r === "A" ? "V" : r === "B" ? "D" : "N"}
                        </Text>
                      ))}
                    </View>
                  </View>
                  <View style={sharedStyles.historyColumn}>
                    <Text style={sharedStyles.blockText}>{playerB}</Text>
                    <View style={{ flexDirection: "row", gap: 4, marginTop: 4 }}>
                      {stats.lastResults.slice(-5).map((r, i) => (
                        <Text
                          key={i}
                          style={
                            r === "B" ? sharedStyles.historyLetterWin : r === "A" ? sharedStyles.historyLetterLoss : sharedStyles.historyLetterDraw
                          }
                        >
                          {r === "B" ? "V" : r === "A" ? "D" : "N"}
                        </Text>
                      ))}
                    </View>
                  </View>
                </View>
              </View>

              {/* Moyenne des points */}
              <View style={sharedStyles.block}>
                <Text style={sharedStyles.blockTitle}>Moyenne de points / partie</Text>
                <View style={sharedStyles.row}>
                  <View style={sharedStyles.column}>
                    <Text style={sharedStyles.playerLabel}>{playerA}</Text>
                    <Text style={sharedStyles.blockText}>{stats.avgScoreA} pts</Text>
                  </View>
                  <Text style={sharedStyles.separator}>|</Text>
                  <View style={sharedStyles.column}>
                    <Text style={sharedStyles.playerLabel}>{playerB}</Text>
                    <Text style={sharedStyles.blockText}>{stats.avgScoreB} pts</Text>
                  </View>
                </View>
              </View>

              {/* Meilleure victoire */}
              <View style={sharedStyles.block}>
                <Text style={sharedStyles.blockTitle}>Meilleure victoire</Text>
                <View style={sharedStyles.rowBetween}>
                  <View style={sharedStyles.playerStat}>
                    <Text style={sharedStyles.playerName}>{playerA}</Text>
                    <Text style={sharedStyles.playerValue}>+ {stats.bestVictoryA} pts</Text>
                  </View>
                  <View style={sharedStyles.playerStat}>
                    <Text style={sharedStyles.playerName}>{playerB}</Text>
                    <Text style={sharedStyles.playerValue}>+ {stats.bestVictoryB} pts</Text>
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
