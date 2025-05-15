import { createSlice } from "@reduxjs/toolkit";
//import ts type
import type { RootState } from "@/store/index";

const fishSlice = createSlice({
  name: "fish",
  initialState: {
    fishCount: 88,
  },
  reducers: {
    incrementFish(state) {
      state.fishCount = state.fishCount + 1;
    },
    decrementFish(state) {
      state.fishCount = state.fishCount - 1;
    },
  },
});

export const selectCount = (state: RootState) => state.fish.fishCount;

export const { incrementFish, decrementFish } = fishSlice.actions;

export default fishSlice.reducer;
