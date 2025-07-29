import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface PlayerState {
  playerA: string
  playerB: string
  setPlayerA: (name: string) => void
  setPlayerB: (name: string) => void
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      playerA: "",
      playerB: "",
      setPlayerA: (name) => set({ playerA: name }),
      setPlayerB: (name) => set({ playerB: name }),
    }),
    {
      name: "player-names", // clé de stockage
      storage: createJSONStorage(() => AsyncStorage), // on utilise AsyncStorage
    },
  ),
)
