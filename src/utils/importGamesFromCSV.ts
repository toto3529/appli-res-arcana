import { parse } from "date-fns"
import { fr } from "date-fns/locale"
import * as FileSystem from "expo-file-system"
import { database } from "src/db/database"
import GameModel from "src/models/GameModel"
import { generateUUID } from "./uuid"
import { Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

const SAF_SUBDIR_KEY = "resarcana.saf.subdir.uri"
const DEBUG = true

export const importGamesFromCSV = async () => {
  try {
    let csvContent: string | null = null
    let latestLabel: string = ""

    // helper robuste: extrait VRAI nom de fichier depuis une URI SAF
    const getFileName = (u: string) => {
      const dec = decodeURIComponent(u || "")
      // ex: content://.../document/primary:Download/ResArcanaSave/res-arcana-games-...csv
      //     -> on prend après le dernier ':' puis après le dernier '/'
      const afterColon = dec.split(":").pop() || dec
      const name = afterColon.split("/").pop() || afterColon
      return name
    }

    // 1) Lire le dossier choisi (le même que pour l'export)
    const dirUri = await AsyncStorage.getItem(SAF_SUBDIR_KEY)
    if (DEBUG) console.log("[IMPORT] dirUri from AsyncStorage:", dirUri)

    if (dirUri) {
      try {
        const uris = await FileSystem.StorageAccessFramework.readDirectoryAsync(dirUri)
        if (DEBUG) {
          console.log("[IMPORT] SAF entries count:", uris.length)
          uris.slice(0, 10).forEach((u, i) => console.log(`[IMPORT] SAF[${i}] -> ${u}`))
        }

        const entries = uris.map((u) => ({ uri: u, name: getFileName(u) })).filter((e) => e.name.toLowerCase().endsWith(".csv")) // on ne force plus le startsWith
        if (DEBUG) {
          console.log("[IMPORT] CSV candidates:", entries.length)
          entries.slice(0, 10).forEach((e, i) => console.log(`[IMPORT] CSV[${i}] name=${e.name}`))
        }

        if (entries.length > 0) {
          // tri lexicographique (ok car nom = res-arcana-games-YYYY-MM-dd_HH-mm-ss.csv)
          entries.sort((a, b) => b.name.localeCompare(a.name))
          const latest = entries[0]
          if (DEBUG) console.log("[IMPORT] latest CSV chosen:", latest.name, latest.uri)

          // @ts-ignore
          csvContent = await FileSystem.StorageAccessFramework.readAsStringAsync(latest.uri, {
            encoding: FileSystem.EncodingType.UTF8,
          })
          latestLabel = latest.name
        }
      } catch (e) {
        if (DEBUG) console.log("[IMPORT] SAF read error:", e)
        // on tombera sur le fallback documentDirectory si nécessaire
      }
    } else {
      if (DEBUG) console.log("[IMPORT] No dirUri in AsyncStorage -> will try documentDirectory")
    }

    // 2) Fallback: ancien répertoire interne de l’app
    if (!csvContent) {
      const dir = FileSystem.documentDirectory || ""
      const files = await FileSystem.readDirectoryAsync(dir)
      if (DEBUG) console.log("[IMPORT] documentDirectory files:", files)

      const csvFiles = files
        .filter((f) => f.toLowerCase().endsWith(".csv"))
        .sort()
        .reverse()
      if (csvFiles.length === 0) throw new Error("Aucun fichier CSV trouvé.")

      const latestFile = csvFiles[0]
      const filePath = dir + latestFile

      if (DEBUG) console.log("[IMPORT] Fallback latest CSV:", latestFile, "->", filePath)
      csvContent = await FileSystem.readAsStringAsync(filePath, { encoding: FileSystem.EncodingType.UTF8 })
      latestLabel = latestFile
    }

    // 3) Parse CSV
    const lines = csvContent.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").slice(1)
    if (DEBUG) console.log("[IMPORT] lines (without header):", lines.length)

    const collection = database.get<GameModel>("games")
    const allGames = await collection.query().fetch()
    let importedCount = 0

    await database.write(async () => {
      for (const raw of lines) {
        const line = raw.trim()
        if (!line) continue

        const parts = line.split(",")
        if (parts.length < 5) continue

        const dateStr = parts[1]?.trim()
        const scoreA = parts[2]?.trim()
        const scoreB = parts[3]?.trim()
        const winnerLabel = parts.slice(4).join(",").trim()

        const scoreANum = parseInt(scoreA, 10)
        const scoreBNum = parseInt(scoreB, 10)
        if (Number.isNaN(scoreANum) || Number.isNaN(scoreBNum)) continue

        const parsedDate = parse(dateStr, "dd/MM/yyyy", new Date(), { locale: fr })

        let winnerOnTie: "A" | "B" | "equal" | null = null
        if (scoreANum === scoreBNum) {
          const w = winnerLabel.toLowerCase()
          if (w === "a") winnerOnTie = "A"
          else if (w === "b") winnerOnTie = "B"
          else winnerOnTie = "equal"
        }

        const isAlreadyPresent = allGames.some((game) => {
          const sameDay =
            game.date.getDate() === parsedDate.getDate() &&
            game.date.getMonth() === parsedDate.getMonth() &&
            game.date.getFullYear() === parsedDate.getFullYear()
          const sameScores = game.scoreA === scoreANum && game.scoreB === scoreBNum
          const sameWinner = (game.winnerOnTie ?? null) === winnerOnTie
          return sameDay && sameScores && sameWinner
        })
        if (isAlreadyPresent) continue

        await collection.create((game) => {
          game._raw.id = generateUUID()
          game.date = parsedDate
          game.scoreA = scoreANum
          game.scoreB = scoreBNum
          game.winnerOnTie = winnerOnTie
        })
        importedCount++
      }
    })

    const message =
      importedCount > 0
        ? `🎉 Import terminé avec succès !\n\n${importedCount} ${importedCount === 1 ? "nouvelle partie a été ajoutée" : "nouvelles parties ont été ajoutées"} depuis :\n${latestLabel}`
        : `✅ Import terminé\nAucune nouvelle partie détectée dans :\n${latestLabel}`

    Alert.alert("Import terminé", message)
    return latestLabel
  } catch (error) {
    console.log("[IMPORT] catch error:", error)
    Alert.alert("❌ Erreur d'import", (error as Error).message)
    return null
  }
}
