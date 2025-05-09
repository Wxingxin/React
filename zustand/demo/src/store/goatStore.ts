import { create } from "zustand";

import { persist, createJSONStorage, devtools } from "zustand/middleware";
// import { immer } from "zustand/middleware/immer";

type GoatType = {
  goats: number;
};

const GoatUseStore = create<GoatType>()(
  devtools(
    persist(
      () => ({
        goats: 666,
      }),
      {
        name: "goats-session",
        storage: createJSONStorage(() => sessionStorage),
      }
    ),
    {
      name: "goats-devtools",
    }
  )
);

export const incrementGoats = () =>
  GoatUseStore.setState((pre) => ({ goats: pre.goats + 1 }));

export const resetGoats = () => GoatUseStore.setState({ goats: 666 });

export const asyncIncremenGoats = () => {
  setTimeout(() => {
    incrementGoats()
  }, 1000);
}

export default GoatUseStore;
