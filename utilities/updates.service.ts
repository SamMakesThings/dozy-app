import React from 'react';
import { AppState, AppStateStatus } from 'react-native';
import * as ExpoUpdates from 'expo-updates';

type SetCheckingUpdateStateFunc = (isChecking: boolean) => void;

export class Updates {
  static useUpdating = (): boolean => {
    const [isCheckingUpdate, setCheckingUpdate] = React.useState<boolean>(
      false
    );

    React.useEffect(() => {
      Updates.checkForUpdate(setCheckingUpdate);

      const handleAppStateChange = async (
        newState: AppStateStatus
      ): Promise<void> => {
        if (newState === 'active') {
          Updates.checkForUpdate(setCheckingUpdate);
        }
      };
      AppState.addEventListener('change', handleAppStateChange);

      return () => {
        AppState.removeEventListener('change', handleAppStateChange);
      };
    }, []);

    return isCheckingUpdate;
  };

  static async checkForUpdate(
    updateState: SetCheckingUpdateStateFunc
  ): Promise<void> {
    if (__DEV__) {
      return;
    }

    try {
      const update = await ExpoUpdates.checkForUpdateAsync();
      if (update.isAvailable) {
        updateState(true);

        await ExpoUpdates.fetchUpdateAsync();
        await ExpoUpdates.reloadAsync();

        return;
      }
    } catch (error) {
      if (__DEV__) {
        console.log('Updates error: ', error);
      }
    }

    updateState(false);
  }
}
