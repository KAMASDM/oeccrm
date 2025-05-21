import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // initially not collapse and easy for ternary, just check status and do
  sideBarStatus: false,
  notification: {
    show: false,
    heading: null,
    msg: null,
  },
};
const uiStore = createSlice({
  name: "UIState",
  initialState,
  reducers: {
    changeSideBarStatus(state) {
      state.sideBarStatus = !state.sideBarStatus;
    },
    setNotification(state, action) {
      state.notification.show = action.payload.show;
      state.notification.heading = action.payload.heading;
      state.notification.msg = action.payload.msg;
    },
  },
});

export const uiAction = uiStore.actions;

export default uiStore.reducer;
