import { create } from 'zustand';

export type SelectedDateState = {
  selectedDate: {
    month: number;
    year: number;
    date: Date;
  };
  alterMonthSelection: (changeBy: number) => void;
};

export const useSelectedDateStore = create<SelectedDateState>((set) => ({
  month: new Date().getMonth(),
  selectedDate: {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    date: new Date(),
  },
  alterMonthSelection: (changeBy: number) =>
    set((state) => {
      let { month, year, date } = state.selectedDate;
      const adjustedMonth = month + changeBy;

      if (adjustedMonth === 12) {
        month = 0;
        year += 1;
      } else if (adjustedMonth === -1) {
        month = 11;
        year += -1;
      } else {
        month = adjustedMonth;
      }

      date.setMonth(month, 15);
      date.setFullYear(year);

      return { selectedDate: { month: month, year: year, date: date } };
    }),
}));
