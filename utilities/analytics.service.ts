import { useEffect, useMemo, useRef, useCallback, RefObject } from 'react';
import analytics from '@react-native-firebase/analytics';
import {
  NavigationContainerRef,
  NavigationState,
  PartialState
} from '@react-navigation/native';

import { convertAnalyticsEventName } from './common';
import { SeparatelyTrackedScreens } from '../constants/AnalyticsEvents';

export interface AnalyticsContextValue {
  navigationRef: RefObject<NavigationContainerRef>;
  onStateChange: (state: NavigationState) => void;
}

export class Analytics {
  static useAnalytics = (userId?: string): AnalyticsContextValue => {
    const routeNameRef = useRef<string>();
    const navigationRef = useRef<NavigationContainerRef>(null);

    useEffect(() => {
      navigationRef.current!.getRootState();
      routeNameRef.current = Analytics.getActiveRouteName(
        navigationRef.current!.getRootState()
      )!;
      analytics().logScreenView({
        screen_name: routeNameRef.current,
        screen_class: routeNameRef.current
      });
      if (SeparatelyTrackedScreens.includes(routeNameRef.current)) {
        // Tracks this screen as a separate event
        Analytics.logEvent(`${routeNameRef.current} screen`);
      }
    }, []);

    useEffect((): void => {
      if (userId) {
        Analytics.setUserId(userId);
      }
    }, [userId]);

    const onStateChange = useCallback((currentState: NavigationState): void => {
      const prevRouteName: string | undefined = routeNameRef.current;
      const currentRouteName: string = Analytics.getActiveRouteName(
        currentState
      )!;

      if (prevRouteName !== currentRouteName) {
        analytics().logScreenView({
          screen_name: currentRouteName,
          screen_class: currentRouteName
        });
        if (SeparatelyTrackedScreens.includes(currentRouteName)) {
          // Tracks this screen as a separate event
          Analytics.logEvent(`${currentRouteName} screen`);
        }
      }

      routeNameRef.current = currentRouteName;
    }, []);

    const analyticsContext = useMemo(
      (): AnalyticsContextValue => ({
        navigationRef,
        onStateChange
      }),
      [onStateChange]
    );

    return analyticsContext;
  };

  static getActiveRouteName(
    navigationState: NavigationState | PartialState<NavigationState>
  ): string | null {
    if (!navigationState) {
      return null;
    }

    const route = navigationState.routes[navigationState.index!];
    if (route.state?.routes) {
      return this.getActiveRouteName(route.state);
    }

    return route.name;
  }

  static logEvent(name: string, params?: Record<string, any>): Promise<void> {
    return analytics().logEvent(convertAnalyticsEventName(name), params);
  }

  static setUserId(id: string | null): Promise<void> {
    return analytics().setUserId(id);
  }
}
