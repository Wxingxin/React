import { create } from "zustand";
import type { fishUseStoreType } from "@/vite-env";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
// import { immer } from "zustand/middleware/immer";
//

const fishUseStore = create<fishUseStoreType>()(
  devtools(
    persist(
      (set, get) => ({
        fish: 88,
        incrementFish: () => set((pre) => ({ fish: pre.fish + 1 })),
        resetFish: () => set({ fish: 88 }),
        asyncIncrementFish: () => {
          setTimeout(() => {
            get().incrementFish();
          }, 1000);
        },
      }
    ),
      {
        name: "fish-session",
        storage: createJSONStorage(() => sessionStorage),
      }
    ),
    {
      name: "fish-devtools",
    }
  )
);

export default fishUseStore;
