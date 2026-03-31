import { parse } from "date-fns"
import { fr } from "date-fns/locale"
import * as FileSystem from "expo-file-system"
import { database } from "src/db/database"
import GameModel from "src/models/GameModel"
import { generateUUID } from "./uuid"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { isRealGame } from "./gameFilters"

const SAF_SUBDIR_KEY = "resarcana.saf.subdir.uri"

const tryParse = (s: string) => {
  let d = parse(s, "dd/MM/yyyy HH:mm", new Date(), { locale: fr })
  if (!Number.isFinite(d.getTime())) {
    d = parse(s, "dd/MM/yyyy", new Date(), { locale: fr })
  }
  return d
}

export type ImportResult = {
  success: boolean
  title: string
  message: string
}

export const importGamesFromCSV = async (): Promise<ImportResult> => {
  try {
    let csvContent: string | null = null
    let latestLabel: string = ""

    const getFileName = (u: string) => {
      const dec = decodeURIComponent(u || "")
      const afterColon = dec.split(":").pop() || dec
      const name = afterColon.split("/").pop() || afterColon
      return name
    }

    const dirUri = await AsyncStorage.getItem(SAF_SUBDIR_KEY)

    if (dirUri) {
      try {
        const uris = await FileSystem.StorageAccessFramework.readDirectoryAsync(dirUri)
        const entries = uris.map((u) => ({ uri: u, name: getFileName(u) })).filter((e) => e.name.toLowerCase().endsWith(".csv"))

        if (entries.length > 0) {
          entries.sort((a, b) => b.name.localeCompare(a.name))
          const latest = entries[0]
          // @ts-ignore
          csvContent = await FileSystem.StorageAccessFramework.readAsStringAsync(latest.uri, {
            encoding: FileSystem.EncodingType.UTF8,
          })
          latestLabel = latest.name
        }
      } catch (e) {}
    }

    if (!csvContent) {
      const dir = FileSystem.documentDirectory || ""
      const files = await FileSystem.readDirectoryAsync(dir)
      const csvFiles = files
        .filter((f) => f.toLowerCase().endsWith(".csv"))
        .sort()
        .reverse()
      if (csvFiles.length === 0) throw new Error("Aucun fichier CSV trouvé.")

      const latestFile = csvFiles[0]
      const filePath = dir + latestFile
      csvContent = await FileSystem.readAsStringAsync(filePath, { encoding: FileSystem.EncodingType.UTF8 })
      latestLabel = latestFile
    }

    const lines = csvContent.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").slice(1)

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

        const parsedDate = tryParse(dateStr)
        if (!Number.isFinite(parsedDate.getTime())) continue

        let winnerOnTie: "A" | "B" | "draw" | null = null
        if (scoreANum === scoreBNum) {
          const w = winnerLabel.toLowerCase()
          if (w === "a") winnerOnTie = "A"
          else if (w === "b") winnerOnTie = "B"
          else winnerOnTie = "draw"
        }

        const candidate = {
          id: "tmp",
          date: parsedDate,
          scoreA: scoreANum,
          scoreB: scoreBNum,
          winnerOnTie: winnerOnTie,
        } as any

        if (!isRealGame(candidate)) continue

        const isAlreadyPresent = allGames.some((game) => {
          const sameInstant = new Date(game.date).getTime() === parsedDate.getTime()
          const sameScores = game.scoreA === scoreANum && game.scoreB === scoreBNum
          const sameWinner = (game.winnerOnTie ?? null) === winnerOnTie
          return sameInstant && sameScores && sameWinner
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

    return {
      success: true,
      title: "Import terminé",
      message:
        importedCount > 0
          ? `${importedCount} ${importedCount === 1 ? "nouvelle partie a été ajoutée" : "nouvelles parties ont été ajoutées"} depuis :\n${latestLabel}`
          : `Aucune nouvelle partie détectée dans :\n${latestLabel}`,
    }
  } catch (error) {
    return {
      success: false,
      title: "❌ Erreur d'import",
      message: (error as Error).message,
    }
  }
}
