import React, {
  useMemo,
  useState,
  createContext,
  useCallback,
  useContext,
} from 'react';
import remoteConfig from '@react-native-firebase/remote-config';
import Onboarding, { OnboardingMeta } from '../constants/Onboarding';

export interface ABTestingContextValue {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  initABTesting: () => Promise<void>;
}

export default class ABTesting {
  static Context = createContext<ABTestingContextValue | null>(null);

  static onboardingSteps: OnboardingMeta = Onboarding.defaultSteps;

  static useABTestingService(): ABTestingContextValue {
    const [isLoading, setLoading] = useState(false);

    const initABTesting = useCallback(async (): Promise<void> => {
      setLoading(true);

      try {
        ABTesting.onboardingSteps = await ABTesting.initABTesting();
      } catch {}

      setLoading(false);
    }, []);

    const abTestingContextValue = useMemo(
      (): ABTestingContextValue => ({
        isLoading,
        setLoading,
        initABTesting,
      }),
      [isLoading, initABTesting],
    );

    return abTestingContextValue;
  }

  static useABTesting(): ABTestingContextValue {
    return useContext<ABTestingContextValue>(
      ABTesting.Context as React.Context<ABTestingContextValue>,
    );
  }

  private static async initABTesting(): Promise<OnboardingMeta> {
    await remoteConfig().setConfigSettings({});
    await remoteConfig().setDefaults({
      onboardingSteps: JSON.stringify({
        version: 'A',
        data: Onboarding.defaultSteps,
      }),
    });

    await remoteConfig().fetchAndActivate();

    const snapshot = remoteConfig().getValue('onboardingSteps').asString();

    return JSON.parse(snapshot);
  }
}
