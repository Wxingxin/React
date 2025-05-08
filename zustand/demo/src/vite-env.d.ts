/// <reference types="vite/client" />

import type bearsUseStore from "./store/bearsStore";

// type bearsType = {
//   bears: number;
//   BearsIs88: () => void;
//   incrementBears: () => void;
//   resetBears: () => void;
//   stepBears: (step?) => void;
//   asyncIncrementBears: () => void;
//   //fish
//   fish: number;
//   incrementFish: () => void;
//   resetFish: () => void;
//   asyncIncrementFish: () => void;
// };

type bearsUseStoreType = {
  bears: number;
  BearsIs88: () => void;
  incrementBears: () => void;
  resetBears: () => void;
  stepBears: (step?) => void;
  asyncIncrementBears: () => void;
};

type fishUseStoreType = {
  fish: number;
  incrementFish: () => void;
  resetFish: () => void;
  asyncIncrementFish: () => void;
}