import { calculateMonthlyStats, getCurrentWinStreak, getFilteredGamesByMonth, getMonthLabel } from "@utils/statsHelpers"
import { useMemo, useState } from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { Game } from "src/stores/gameStore"
import { useAppStyles } from "src/styles/useAppStyles"
import { usePlayerStore } from "@stores/playerStore"
import { useThemeStore } from "@stores/themeStore"
import PieChart from "@components/PieChart"

interface Props {
  games: Game[]
}

const MonthlyStats = ({ games }: Props) => {
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0)
  const styles = useAppStyles()
  const { playerA, playerB } = usePlayerStore()
  const isDark = useThemeStore((s) => s.isDark())

  const currentDate = useMemo(() => {
    const now = new Date()
    const date = new Date(now.getFullYear(), now.getMonth() + currentMonthOffset, 1)
    return date
  }, [currentMonthOffset])

  const filteredGames = useMemo(() => getFilteredGamesByMonth(games, currentDate), [games, currentDate])
  const stats = useMemo(() => calculateMonthlyStats(filteredGames), [filteredGames])
  const currentStreak = useMemo(() => getCurrentWinStreak(filteredGames), [filteredGames])

  const handlePrevMonth = () => setCurrentMonthOffset((prev) => prev - 1)
  const handleNextMonth = () => setCurrentMonthOffset((prev) => prev + 1)

  return (
    <View style={styles.container}>
      {/* Sélection du mois */}
      <View style={styles.monthSelector}>
        <TouchableOpacity onPress={handlePrevMonth} style={styles.monthButton}>
          <Text style={styles.monthButtonText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.monthLabel}>{getMonthLabel(currentDate)}</Text>
        <TouchableOpacity onPress={handleNextMonth} style={styles.monthButton}>
          <Text style={styles.monthButtonText}>{">"}</Text>
        </TouchableOpacity>
      </View>

      {filteredGames.length < 2 ? (
        <Text style={styles.warning}>Pas assez de parties enregistrées.</Text>
      ) : (
        <View style={styles.blocksWrapper}>
          {/* Score du mois */}
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Score du mois</Text>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.blockSubtitle}>{playerA}</Text>
                <Text style={styles.blockText}>{stats.totalPointsA} pts</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.blockSubtitle}>{playerB}</Text>
                <Text style={styles.blockText}>{stats.totalPointsB} pts</Text>
              </View>
            </View>
          </View>

          {/* Série de victoires en cours */}
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Série de victoires en cours</Text>
            <Text style={styles.blockText}>
              {currentStreak.count > 0
                ? `${currentStreak.player === "A" ? playerA : playerB} : ${currentStreak.count} victoire${currentStreak.count > 1 ? "s" : ""}`
                : "ni l'un ni l'autre 😅"}
            </Text>
          </View>

          {/* % Victoires / Parties */}
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Nombre de parties : {stats.totalGames}</Text>
            <View style={styles.winRateBar}>
              {stats.winRateA > 0 && (
                <View style={[styles.winRateSegmentA, { flex: stats.winRateA }]}>
                  <Text style={styles.winRateSegmentText}>{stats.winA}</Text>
                </View>
              )}
              {stats.drawRate > 0 && (
                <View style={[styles.winRateSegmentDraw, { flex: stats.drawRate }]}>
                  <Text style={styles.winRateSegmentText}>{stats.draws}</Text>
                </View>
              )}
              {stats.winRateB > 0 && (
                <View style={[styles.winRateSegmentB, { flex: stats.winRateB }]}>
                  <Text style={styles.winRateSegmentText}>{stats.winB}</Text>
                </View>
              )}
            </View>
            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.label}>
                  {playerA} : {stats.winA} victoires
                </Text>
              </View>
              <View style={styles.half}>
                <Text style={[styles.label, { textAlign: "right" }]}>
                  {playerB} : {stats.winB} victoires
                </Text>
              </View>
            </View>
          </View>

          {/* Répartition V/D */}
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Répartition Victoires / Défaites</Text>
            <View style={styles.pieContainer}>
              <PieChart
                valueA={stats.winRateA}
                valueB={stats.winRateB}
                valueDraw={stats.drawRate}
                labelA={playerA}
                labelB={playerB}
                isDark={isDark}
              />
            </View>
          </View>

          {/* Historique des 5 dernières parties */}
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Historique des 5 dernières parties</Text>
            <View style={styles.historyRow}>
              <View style={styles.historyColumn}>
                <Text style={styles.blockText}>{playerA}</Text>
                <View style={styles.historyLetterRow}>
                  {stats.lastResults.slice(-5).map((r, i) => (
                    <Text key={i} style={r === "A" ? styles.historyLetterWin : r === "B" ? styles.historyLetterLoss : styles.historyLetterDraw}>
                      {r === "A" ? "V" : r === "B" ? "D" : "N"}
                    </Text>
                  ))}
                </View>
              </View>
              <View style={styles.historyColumn}>
                <Text style={styles.blockText}>{playerB}</Text>
                <View style={styles.historyLetterRow}>
                  {stats.lastResults.slice(-5).map((r, i) => (
                    <Text key={i} style={r === "B" ? styles.historyLetterWin : r === "A" ? styles.historyLetterLoss : styles.historyLetterDraw}>
                      {r === "B" ? "V" : r === "A" ? "D" : "N"}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* Moyenne des points */}
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Moyenne de points / partie</Text>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.blockSubtitle}>{playerA}</Text>
                <Text style={styles.blockText}>{stats.avgScoreA} pts</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.blockSubtitle}>{playerB}</Text>
                <Text style={styles.blockText}>{stats.avgScoreB} pts</Text>
              </View>
            </View>
          </View>

          {/* Meilleure victoire */}
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Meilleure victoire (écart)</Text>
            <View style={styles.rowBetween}>
              <View style={styles.playerStat}>
                <Text style={styles.blockSubtitle}>{playerA}</Text>
                <Text style={styles.blockText}>+{stats.bestVictoryA} pts</Text>
              </View>
              <View style={styles.playerStat}>
                <Text style={styles.blockSubtitle}>{playerB}</Text>
                <Text style={styles.blockText}>+{stats.bestVictoryB} pts</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

export default MonthlyStats
