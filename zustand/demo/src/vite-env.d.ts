/// <reference types="vite/client" />

type bearsType = {
  bears: number;
  BearsIs88: () => void;
  incrementBears: () => void;
  resetBears: () => void;
  stepBears: (step?) => void;
  asyncIncrementBears: () => void;
};
