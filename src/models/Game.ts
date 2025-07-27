import { Model } from "@nozbe/watermelondb"
import { field, date, writer } from "@nozbe/watermelondb/decorators"

export default class Game extends Model {
  static table = "games"

  @date("date") date!: Date
  @field("scoreA") scoreA!: number
  @field("scoreB") scoreB!: number
  @field("winner_on_tie") winnerOnTie!: "A" | "B" | "equal" | null

  @writer async updateScores(newA: number, newB: number, winnerOnTie?: "A" | "B" | "equal" | null) {
    await this.update((g) => {
      g.scoreA = newA
      g.scoreB = newB
      g.winnerOnTie = winnerOnTie ?? null
    })
  }
}
