import { create } from 'zustand';
import { SleepLog } from '../types/custom';

export type SelectedSleepLogsState = {
  sleepLogs: SleepLog[];
  setSleepLogs: (sleepLogs: SleepLog[]) => void;
};

export const useSleepLogsStore = create<SelectedSleepLogsState>((set) => ({
  sleepLogs: [],
  setSleepLogs: (sleepLogs) =>
    set(() => {
      return { sleepLogs: sleepLogs };
    }),
}));
