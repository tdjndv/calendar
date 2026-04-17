import { createSlice } from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit"
type CalendarState = {
  selectedDate: string | null;
  currentMonth: string;
};

function getCurrentMonthString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

const initialState: CalendarState = {
  selectedDate: null,
  currentMonth: getCurrentMonthString(),
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