import { database } from "src/db/database"
import { create } from "zustand"
import GameModel from "../models/GameModel"

// Interface exposée aux composants : on ne stocke que les champs utiles
export interface Game {
  id: string
  date: Date
  scoreA: number
  scoreB: number
  winnerOnTie?: "A" | "B" | "equal" | null
}

// Définition du shape du store
interface GameState {
  games: Game[]
  loadGames: () => Promise<void>
  addGame: (game: Omit<Game, "id">) => Promise<void>
  updateGame: (id: string, newA: number, newB: number, winnerOnTie?: "A" | "B" | "equal" | null) => Promise<void>
  deleteGame: (id: string) => Promise<void>
  resetStats: () => Promise<void>
}

// Création du store
export const useGameStore = create<GameState>((set, get) => ({
  // --- État initial ---
  games: [],

  // Charge toutes les parties depuis WatermelonDB et met à jour le state
  loadGames: async () => {
    // On récupère la collection 'games' et on fetch tous les enregistrements
    const raws = await database.get<GameModel>("games").query().fetch()
    // On transforme les modèles WatermelonDB en objets JS simples
    const mapped = raws.map((game) => ({
      id: game.id,
      date: game.date,
      scoreA: game.scoreA,
      scoreB: game.scoreB,
      winnerOnTie: game.winnerOnTie ?? null,
    }))

    // On met à jour le state local
    set({ games: mapped })
  },

  // Créé une nouvelle partie et recharge la liste
  addGame: async ({ date, scoreA, scoreB, winnerOnTie }) => {
    // On ouvre une transaction WatermelonDB
    await database.write(async () => {
      // On crée un nouvel enregistrement dans la collection 'games'
      await database.get<GameModel>("games").create((game) => {
        game.date = date
        game.scoreA = scoreA
        game.scoreB = scoreB
        game.winnerOnTie = winnerOnTie ?? null
      })
    })
    // On recharge la liste pour rafraîchir l’écran
    await get().loadGames()
  },

  // Met à jour une partie existante
  updateGame: async (id, newA, newB, winnerOnTie = null) => {
    await database.write(async () => {
      // On trouve l’enregistrement par son id
      const record = await database.get<GameModel>("games").find(id)
      // On appelle la méthode custom writer définie dans ton modèle
      await record.update((g) => {
        g.scoreA = newA
        g.scoreB = newB
        g.winnerOnTie = winnerOnTie
      })
    })
    // On recharge la liste pour rafraîchir l’écran
    await get().loadGames()
  },

  // Supprime une partie
  deleteGame: async (id) => {
    await database.write(async () => {
      // On trouve l’enregistrement par son id
      const record = await database.get<GameModel>("games").find(id)
      // On le marque comme supprimé (soft-delete)
      await record.markAsDeleted()
    })
    // On recharge la liste pour rafraîchir l’écran
    await get().loadGames()
  },

  // Supprime toutes les parties
  resetStats: async () => {
    await database.write(async () => {
      const allGames = await database.get<GameModel>("games").query().fetch()
      for (const game of allGames) {
        await game.markAsDeleted() // soft-delete
      }
    })
    await get().loadGames()
  },
}))
