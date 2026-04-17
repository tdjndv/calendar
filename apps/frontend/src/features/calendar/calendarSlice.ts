import { createSlice } from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit"
type CalendarState = {
  selectedDate: string | null;
  currentMonth: string;
};

const initialState: CalendarState = {
  selectedDate: null,
  currentMonth: "2026-04",
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    setSelectedDate(state, action: PayloadAction<string | null>) {
      state.selectedDate = action.payload;
    },
    setCurrentMonth(state, action: PayloadAction<string>) {
      state.currentMonth = action.payload;
    },
  },
});

export const { setSelectedDate, setCurrentMonth } = calendarSlice.actions;
export default calendarSlice.reducer;