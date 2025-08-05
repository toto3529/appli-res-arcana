import { create } from "zustand"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface PlayerStore {
  playerA: string
  playerB: string
  setPlayerA: (name: string) => void
  setPlayerB: (name: string) => void
  loadPlayers: () => Promise<void>
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  playerA: "Joueur A",
  playerB: "Joueur B",

  setPlayerA: async (name) => {
    await AsyncStorage.setItem("playerA", name)
    set({ playerA: name })
  },

  setPlayerB: async (name) => {
    await AsyncStorage.setItem("playerB", name)
    set({ playerB: name })
  },

  loadPlayers: async () => {
    const nameA = (await AsyncStorage.getItem("playerA")) || "Joueur A"
    const nameB = (await AsyncStorage.getItem("playerB")) || "Joueur B"
    set({ playerA: nameA, playerB: nameB })
  },
}))
