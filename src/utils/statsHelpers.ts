import { Game } from "src/stores/gameStore"

export function getMonthLabel(date: Date): string {
  const mois = date.toLocaleString("fr-FR", { month: "long" })
  const année = date.getFullYear()
  return `${mois.charAt(0).toUpperCase() + mois.slice(1)} ${année}`
}

export function getFilteredGamesByMonth(games: Game[], selectedDate: Date): Game[] {
  return games.filter((game) => {
    const d = new Date(game.date)
    return d.getFullYear() === selectedDate.getFullYear() && d.getMonth() === selectedDate.getMonth()
  })
}

export function calculateMonthlyStats(games: Game[]) {
  const totalGames = games.length

  let totalPointsA = 0
  let totalPointsB = 0
  let winA = 0
  let winB = 0
  let draws = 0
  let bestVictoryA = 0
  let bestVictoryB = 0
  const lastResults: ("A" | "B" | "equal")[] = []

  games.forEach((g) => {
    totalPointsA += g.scoreA
    totalPointsB += g.scoreB

    if (g.scoreA > g.scoreB) {
      winA++
      bestVictoryA = Math.max(bestVictoryA, g.scoreA - g.scoreB)
      lastResults.push("A")
    } else if (g.scoreB > g.scoreA) {
      winB++
      bestVictoryB = Math.max(bestVictoryB, g.scoreB - g.scoreA)
      lastResults.push("B")
    } else {
      if (g.winnerOnTie === "A") {
        winA++
        lastResults.push("A")
      } else if (g.winnerOnTie === "B") {
        winB++
        lastResults.push("B")
      } else {
        draws++
        lastResults.push("equal")
      }
    }
  })

  const avgScoreA = totalGames > 0 ? (totalPointsA / totalGames).toFixed(1) : "0.0"
  const avgScoreB = totalGames > 0 ? (totalPointsB / totalGames).toFixed(1) : "0.0"

  const winRateA = totalGames > 0 ? Math.round((winA / totalGames) * 100) : 0
  const winRateB = totalGames > 0 ? Math.round((winB / totalGames) * 100) : 0
  let drawRate = 100 - winRateA - winRateB
  if (drawRate < 0) drawRate = 0
  if (drawRate > 100) drawRate = 100

  return {
    totalGames,
    totalPointsA,
    totalPointsB,
    winA,
    winB,
    draws,
    avgScoreA,
    avgScoreB,
    bestVictoryA,
    bestVictoryB,
    winRateA,
    winRateB,
    drawRate,
    lastResults,
  }
}
export function getCurrentWinStreak(games: Game[]) {
  let count = 0
  let player: "A" | "B" | null = null

  for (let i = games.length - 1; i >= 0; i--) {
    const g = games[i]

    // Déterminer le vainqueur
    let winner: "A" | "B" | null = null
    if (g.scoreA > g.scoreB) {
      winner = "A"
    } else if (g.scoreB > g.scoreA) {
      winner = "B"
    } else if (g.winnerOnTie === "A" || g.winnerOnTie === "B") {
      winner = g.winnerOnTie
    } else {
      winner = null // égalité parfaite
    }

    // Si pas de vainqueur clair, la série s’arrête
    if (!winner) break

    if (player === null) {
      player = winner
      count = 1
    } else if (winner === player) {
      count++
    } else {
      break
    }
  }

  return {
    player,
    count,
  }
}

export function calculateGlobalStats(games: Game[]) {
  const totalGames = games.length

  let totalPointsA = 0
  let totalPointsB = 0
  let winA = 0
  let winB = 0
  let draws = 0
  let bestVictoryA = 0
  let bestVictoryB = 0
  let longestStreakA = 0
  let longestStreakB = 0
  let currentStreakA = 0
  let currentStreakB = 0

  games.forEach((game) => {
    const diff = Math.abs(game.scoreA - game.scoreB)

    if (game.scoreA > game.scoreB) {
      winA++
      totalPointsA += game.scoreA
      totalPointsB += game.scoreB
      currentStreakA++
      currentStreakB = 0
      if (diff > bestVictoryA) bestVictoryA = diff
    } else if (game.scoreB > game.scoreA) {
      winB++
      totalPointsA += game.scoreA
      totalPointsB += game.scoreB
      currentStreakB++
      currentStreakA = 0
      if (diff > bestVictoryB) bestVictoryB = diff
    } else {
      draws++
      totalPointsA += game.scoreA
      totalPointsB += game.scoreB
      currentStreakA = 0
      currentStreakB = 0
    }

    if (currentStreakA > longestStreakA) longestStreakA = currentStreakA
    if (currentStreakB > longestStreakB) longestStreakB = currentStreakB
  })

  const avgScoreA = totalGames > 0 ? (totalPointsA / totalGames).toFixed(1) : "0.0"
  const avgScoreB = totalGames > 0 ? (totalPointsB / totalGames).toFixed(1) : "0.0"

  const rawRateA = totalGames > 0 ? Math.round((winA / totalGames) * 100) : 0
  const rawRateB = totalGames > 0 ? Math.round((winB / totalGames) * 100) : 0
  let drawRate = 100 - rawRateA - rawRateB
  if (drawRate < 0) drawRate = 0
  if (drawRate > 100) drawRate = 100

  return {
    totalGames,
    winA,
    winB,
    draws,
    avgScoreA,
    avgScoreB,
    rawRateA,
    rawRateB,
    drawRate,
    bestVictoryA,
    bestVictoryB,
    longestStreakA,
    longestStreakB,
  }
}
