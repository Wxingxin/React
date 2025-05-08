//导入zustand的create 函数
import { create } from "zustand";
import type { fishUseStoreType } from "@/vite-env";
import { persist, createJSONStorage } from "zustand/middleware";

//使用create函数创建useStore 的 Hook
const fishUseStore = create<fishUseStoreType>()(
  persist(
    (set, get) => {
      //return 中可以存放全局共享的 数据 和 方法
      return {
        fish: 88,
        incrementFish: () => set((pre) => ({ fish: pre.fish + 1 })),
        resetFish: () => set({ fish: 88 }),
        asyncIncrementFish: () => {
          setTimeout(() => {
            get().incrementFish();
          }, 1000);
        },
      };
    },
    {
      name: "fish-session",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

//导出useStore
export default fishUseStore;
