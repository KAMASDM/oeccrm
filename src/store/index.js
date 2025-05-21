import { configureStore } from "@reduxjs/toolkit";
import uiStore from "./uiStore";
import authStore from "./authStore";
import enqColumn from "./EnqColumns";
import appColumn from "./appColumns";

const store = configureStore({
  reducer: {
    uiStore,
    authStore,
    enqColumn,
    appColumn,
  },
});

export default store;
