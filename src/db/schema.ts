import { appSchema, tableSchema } from "@nozbe/watermelondb"

export const mySchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: "games",
      columns: [
        // id est implicite, WatermelonDB gère un champ `id` automatiquement
        { name: "date", type: "number" }, // stockera timestamp (ms)
        { name: "scoreA", type: "number" },
        { name: "scoreB", type: "number" },
        { name: "winner_on_tie", type: "string", isOptional: true },
      ],
    }),
  ],
})
