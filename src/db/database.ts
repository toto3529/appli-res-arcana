import { Database } from "@nozbe/watermelondb"
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite"
import { mySchema } from "./schema"
import Game from "../models/GameModel"
import { migrations } from "./migrations"

// On crée l’adapter SQLite avec schéma et migrations
const adapter = new SQLiteAdapter({
  schema: mySchema,
  migrations, // schemaMigrations provenant de src/db/migrations.ts
  dbName: "arcana.db",
})

// On instancie la base en passant l’adapter et les modèles et on active les actions (= les transactions)
export const database = new Database({
  adapter,
  modelClasses: [Game],
})
