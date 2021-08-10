import React from 'react';
import alterMonthSelection from './alterMonthSelection';
import { createCtx } from '../Context/ContextGet';

type AppState = {
  isLoading: boolean;
  isSignout: boolean;
  userId: string | null;
  userData: Record<string, any>;
  onboardingComplete: boolean;
  profileData: Record<string, any>;
  sleepLogs: any[];
  authLoading: boolean;
  chats: any[];
  tasks: any[];
  selectedDate: Record<string, any>;
};
export const initialState: AppState = {
  isLoading: true,
  isSignout: false,
  userId: null,
  userData: {},
  onboardingComplete: false,
  profileData: {},
  sleepLogs: [],
  authLoading: false,
  chats: [],
  tasks: [],
  selectedDate: {
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  }
};

export type ACTION =
  | { type: 'RESTORE_TOKEN'; token: string; profileData: {} }
  | {
      type: 'SIGN_IN';
      token: string;
      onboardingComplete: boolean;
      isAuthLoading: boolean;
      profileData: {};
    }
  | { type: 'SIGN_OUT' }
  | { type: 'UPDATE_USERDATA'; userData: {}; onboardingComplete: boolean }
  | { type: 'SET_SLEEPLOGS'; sleepLogs: [] }
  | { type: 'SET_CHATS'; chats: [] }
  | { type: 'SET_TASKS'; tasks: [] }
  | { type: 'CHANGE_SELECTED_MONTH'; changeMonthBy: any }
  | { type: 'AUTH_LOADING'; isAuthLoading: boolean }
  | { type: 'FINISH_LOADING' }
  | { type: 'FINISH_ONBOARDING' };

export const appReducer = (prevState: AppState, action: ACTION): AppState => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      console.log('store toekn:');
      return {
        ...prevState,
        userId: action.token,
        profileData: action.profileData
      };
    case 'SIGN_IN':
      return {
        ...prevState,
        isSignout: false,
        userId: action.token,
        onboardingComplete: action.onboardingComplete,
        authLoading: action.isAuthLoading,
        profileData: action.profileData
      };
    case 'SIGN_OUT':
      return {
        ...prevState,
        isSignout: true,
        userId: null
      };
    case 'UPDATE_USERDATA':
      return {
        ...prevState,
        userData: action.userData,
        onboardingComplete: action.onboardingComplete
      };
    case 'SET_SLEEPLOGS':
      return {
        ...prevState,
        sleepLogs: action.sleepLogs
      };
    case 'SET_CHATS':
      return {
        ...prevState,
        chats: action.chats
      };
    case 'SET_TASKS':
      return {
        ...prevState,
        tasks: action.tasks
      };
    case 'CHANGE_SELECTED_MONTH':
      return {
        ...prevState,
        selectedDate: alterMonthSelection(
          prevState.selectedDate,
          action.changeMonthBy
        )
      };
    case 'AUTH_LOADING':
      return {
        ...prevState,
        authLoading: action.isAuthLoading
      };
    case 'FINISH_LOADING':
      console.log('Finish loading');
      return {
        ...prevState,
        isLoading: false
      };
    case 'FINISH_ONBOARDING':
      return {
        ...prevState,
        onboardingComplete: true
      };
  }
};

// export function getMainAppReducer() {
//   const [state, dispatch] = React.useReducer();

//   return [state, dispatch];
// }
