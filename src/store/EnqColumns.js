import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // initially not collapse and easy for ternary, just check status and do
  name: false,
  phone: false,
  email: false,
  current_edu: false,
  country_interested: false,
  university_interested: false,
  course_interested: false,
  level_applying_for: false,
  intake_interested: false,
  assigned_user: false,
  enq_status: false,
  added_by: false,
  notes: false,
  date: false,
};
const enqColumn = createSlice({
  name: "EnqColumn",
  initialState,
  reducers: {
    setEnqColumnStatus(state, action) {
      state[action.payload.key] = !state[action.payload.key];
    },
    setEnqColumnStatusss(state, action) {
      state[action.payload.key] = !state[action.payload.key];
    },
  },
});

export const enqAction = enqColumn.actions;

export default enqColumn.reducer;
