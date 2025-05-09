//导入zustand的create 函数
import type { bearsUseStoreType } from "@/vite-env";
import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";

//使用create函数创建useStore 的 Hook
const bearsUseStore = create<bearsUseStoreType>()(
  devtools(
    persist(
      (set, get) => {
        //return 中可以存放全局共享的 数据 和 方法
        return {
          bears: 9,
          BearsIs88: () => set({ bears: 88 }),
          incrementBears: () => set((pre) => ({ bears: pre.bears + 1 })),
          resetBears: () => set({ bears: 9 }),
          stepBears: (step = 1) =>
            set((pre) => ({ bears: (pre.bears += step) })),
          asyncIncrementBears: () => {
            setTimeout(() => {
              get().incrementBears();
            }, 1000);
          },
        };
      },
      {
        name: "bears-storage",
        //默认为 localStorage
        storage: createJSONStorage(() => localStorage),
      }
    ),
    { name: "bears-devtools" }
  )
);

//导出useStore
export default bearsUseStore;
