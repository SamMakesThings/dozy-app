import React from 'react';
import alterMonthSelection from './alterMonthSelection';

export function getMainAppReducer() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
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
    },
    {
      isLoading: true,
      isSignout: false,
      userId: null,
      onboardingComplete: false,
      profileData: null,
      sleepLogs: [],
      selectedDate: {
        month: new Date().getMonth(),
        year: new Date().getFullYear()
      }
    }
  );

  return [state, dispatch];
}
