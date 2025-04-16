import { configureStore } from "@reduxjs/toolkit";
import gameData from "./slices/game.slice";

const store = configureStore({
  reducer: {
    GameData: gameData,
  },
});

export default store;
