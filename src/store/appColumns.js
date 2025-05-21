import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // initially not collapse and easy for ternary, just check status and do
  enqId: false,
  tenthMarksheet: false,
  twelvethMarksheet: false,
  diplomaMarksheet: false,
  bachelorMarksheet: false,
  masterMarksheet: false,
  lor: false,
  sop: false,
  resume: false,
  languageExam: false,
  assignedUser: false,
  status: false,
  addedBy: false,
  uniI: false,
  courseI: false,
  date: false,
  passport: false,
};
const appColumn = createSlice({
  name: "appColumn",
  initialState,
  reducers: {
    setappColumnStatus(state, action) {
      state[action.payload.key] = !state[action.payload.key];
    },
    setappColumnStatusss(state, action) {
      state[action.payload.key] = !state[action.payload.key];
    },
  },
});

export const appAction = appColumn.actions;

export default appColumn.reducer;
