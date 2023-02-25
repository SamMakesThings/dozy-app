import firestore from '@react-native-firebase/firestore';
import { Chat, SleepLog, Task } from '../types/custom';
import CoachConstants from '../constants/Coach';
import { Coach } from '../types/coach';

export type AppState = {
  isLoading: boolean;
  isSigningIn: boolean;
  isSignout: boolean;
  userId: string | undefined;
  userData: Record<string, any>;
  onboardingComplete: boolean | undefined;
  coach: Coach;
  profileData: Record<string, any>;
  sleepLogs: SleepLog[];
  authLoading: boolean;
  chats: Chat[] | [];
  tasks: Task[];
};

export const initialState: AppState = {
  isLoading: false,
  isSigningIn: false,
  isSignout: false,
  userId: undefined,
  userData: {},
  onboardingComplete: undefined,
  coach: CoachConstants.defaultCoach,
  profileData: {},
  sleepLogs: [],
  authLoading: false,
  chats: [
    {
      chatId: '',
      time: firestore.Timestamp.now(),
      message: '',
      sender: '',
      sentByUser: true,
    },
  ],
  tasks: [],
};

export type ACTION =
  | {
      type: 'RESTORE_TOKEN';
      token: string;
      profileData: Record<string, any>;
    }
  | {
      type: 'SIGN_IN';
      token: string;
      onboardingComplete: boolean;
      profileData: Record<string, any>;
      userData: Record<string, any>;
    }
  | { type: 'SIGN_OUT' }
  | {
      type: 'UPDATE_USERDATA';
      userData: Record<string, any>;
      onboardingComplete: boolean | undefined;
    }
  | { type: 'SET_SLEEPLOGS'; sleepLogs: SleepLog[] }
  | { type: 'SET_CHATS'; chats: Chat[] | [] }
  | { type: 'SET_TASKS'; tasks: Task[] }
  | { type: 'CHANGE_SELECTED_MONTH'; changeMonthBy: any }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'SET_SIGNINGIN'; isSigningIn: boolean }
  | { type: 'FINISH_ONBOARDING' }
  | { type: 'SET_COACH'; coach: Coach };

export const appReducer = (prevState: AppState, action: ACTION): AppState => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...prevState,
        userId: action.token,
        profileData: action.profileData,
      };
    case 'SIGN_IN':
      return {
        ...prevState,
        isSignout: false,
        userId: action.token,
        onboardingComplete: action.onboardingComplete,
        profileData: action.profileData,
        userData: action.userData,
      };
    case 'SIGN_OUT':
      return {
        ...prevState,
        isSignout: true,
        userId: undefined,
        onboardingComplete: undefined,
      };
    case 'UPDATE_USERDATA':
      return {
        ...prevState,
        userData: action.userData,
        onboardingComplete: action.onboardingComplete,
      };
    case 'SET_SLEEPLOGS':
      return {
        ...prevState,
        sleepLogs: action.sleepLogs,
      };
    case 'SET_CHATS':
      return {
        ...prevState,
        chats: action.chats,
      };
    case 'SET_TASKS':
      return {
        ...prevState,
        tasks: action.tasks,
      };
    case 'SET_LOADING':
      return {
        ...prevState,
        isLoading: action.isLoading,
      };
    case 'SET_SIGNINGIN': {
      return {
        ...prevState,
        isSigningIn: action.isSigningIn,
      };
    }
    case 'FINISH_ONBOARDING':
      return {
        ...prevState,
        onboardingComplete: true,
      };
    case 'SET_COACH':
      return {
        ...prevState,
        coach: action.coach,
      };
  }
};
