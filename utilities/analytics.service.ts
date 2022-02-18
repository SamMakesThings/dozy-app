import { useEffect } from 'react';
import analytics from '@react-native-firebase/analytics';

import { convertAnalyticsEventName } from './common';
import { SeparatelyTrackedScreens } from '../constants/AnalyticsEvents';

export default class Analytics {
  static currentRouteName: string | undefined;

  static useAnalytics = (userId?: string): void => {
    useEffect((): void => {
      if (userId) {
        Analytics.setUserId(userId);
      }
    }, [userId]);
  };

  static logScreenChange(
    currentRouteName: string,
    prevRouteName?: string,
  ): void {
    if (prevRouteName !== currentRouteName) {
      analytics().logScreenView({
        screen_name: currentRouteName,
        screen_class: currentRouteName,
      });
      if (SeparatelyTrackedScreens.includes(currentRouteName)) {
        // Tracks this screen as a separate event
        Analytics.logEvent(`${currentRouteName} screen`);
      }
    }
  }

  static logEvent(name: string, params?: Record<string, any>): Promise<void> {
    return analytics().logEvent(convertAnalyticsEventName(name), params);
  }

  static setUserId(id: string | null): Promise<void> {
    return analytics().setUserId(id);
  }
}
