import { Model } from "@nozbe/watermelondb"
import { field, date, writer } from "@nozbe/watermelondb/decorators"

export default class Game extends Model {
  static table = "games"

  @date("date") date!: Date
  @field("scoreA") scoreA!: number
  @field("scoreB") scoreB!: number

  @writer async updateScores(newA: number, newB: number) {
    await this.update((g) => {
      g.scoreA = newA
      g.scoreB = newB
    })
  }
}
