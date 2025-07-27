import { database } from "src/db/database"
import { create } from "zustand"
import GameModel from "../models/Game"

// Interface exposée aux composants : on ne stocke que les champs utiles
export interface Game {
  id: string
  date: Date
  scoreA: number
  scoreB: number
}

// Définition du shape du store
interface GameState {
  games: Game[]
  loadGames: () => Promise<void>
  addGame: (g: Omit<Game, "id">) => Promise<void>
  updateGame: (id: string, newA: number, newB: number) => Promise<void>
  deleteGame: (id: string) => Promise<void>
}

// Création du store
export const useGameStore = create<GameState>((set, get) => ({
  // --- État initial ---
  games: [],

  // Charge toutes les parties depuis WatermelonDB et met à jour le state
  loadGames: async () => {
    // On récupère la collection 'games' et on fetch tous les enregistrements
    const raws = await database.get<GameModel>("games").query().fetch()
    //console.log("🎲 raw games from DB:", raws)
    // On transforme les modèles WatermelonDB en objets JS simples
    const mapped = raws.map((g) => ({
      id: g.id,
      date: g.date,
      scoreA: g.scoreA,
      scoreB: g.scoreB,
    }))

    // On met à jour le state local
    set({ games: mapped })
  },

  // Créé une nouvelle partie et recharge la liste
  addGame: async ({ date, scoreA, scoreB }) => {
    // On ouvre une transaction WatermelonDB
    await database.write(async () => {
      // On crée un nouvel enregistrement dans la collection 'games'
      await database.get<GameModel>("games").create((g) => {
        g.date = date
        g.scoreA = scoreA
        g.scoreB = scoreB
      })
    })
    // On recharge la liste pour rafraîchir l’écran
    await get().loadGames()
  },

  // Met à jour une partie existante
  updateGame: async (id, newA, newB) => {
    await database.write(async () => {
      // On trouve l’enregistrement par son id
      const record = await database.get<GameModel>("games").find(id)
      // On appelle la méthode custom writer définie dans ton modèle
      await (record as any).updateScores(newA, newB)
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
}))
