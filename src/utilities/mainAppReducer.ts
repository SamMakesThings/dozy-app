export type AppState = {
  isLoading: boolean;
  isSigningIn: boolean;
  isSignout: boolean;
  userId: string | undefined;
  profileData: Record<string, any>;
  authLoading: boolean;
};

export const initialState: AppState = {
  isLoading: false,
  isSigningIn: false,
  isSignout: false,
  userId: undefined,
  profileData: {},
  authLoading: false,
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
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'SET_SIGNINGIN'; isSigningIn: boolean };

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
        profileData: action.profileData,
      };
    case 'SIGN_OUT':
      return {
        ...prevState,
        isSignout: true,
        userId: undefined,
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
  }
  return prevState;
};
