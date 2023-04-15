import { create } from 'zustand';
import { Coach } from '../types/coach';
import CoachConstants from '../constants/Coach';

export type UserDataState = {
  userData: Record<string, any>;
  isOnboardingComplete: boolean;
  coach: Coach;
  updateUserData: (newUserData: Record<string, any>) => void;
  setOnboardingComplete: () => void;
  setCoach: (coach: Coach) => void;
};

export const useUserDataStore = create<UserDataState>((set, get) => ({
  userData: {},
  isOnboardingComplete: false,
  coach: CoachConstants.defaultCoach,
  updateUserData: (newUserData) => {
    if (newUserData != get().userData) {
      set(() => {
        return { userData: newUserData };
      });
    }
  },
  setOnboardingComplete: () =>
    set(() => {
      return { isOnboardingComplete: true };
    }),
  setCoach: (coach) =>
    set((state) => {
      return { ...state, coach: coach };
    }),
}));
