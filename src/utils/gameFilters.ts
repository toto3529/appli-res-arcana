import { Game } from "@stores/gameStore"

export function isRealGame(g: Game): boolean {
  // 1) Pas le placeholder technique
  if (g.id === "__placeholder__") return false

  // 2) Date valide
  const t = new Date(g.date).getTime()
  if (!Number.isFinite(t)) return false

  // 3) Pas un enregistrement 0-0 “non décidé”
  // winnerOnTie: "A" | "B" | "draw" | null
  const undecidedZeroZero = g.scoreA === 0 && g.scoreB === 0 && (g as any).winnerOnTie == null
  if (undecidedZeroZero) return false

  return true
}

export function sanitizeGames(games: Game[]): Game[] {
  return games.filter(isRealGame)
}
