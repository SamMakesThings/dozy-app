import {
  useEffect,
  useMemo,
  useRef,
  useCallback,
  MutableRefObject
} from 'react';
import analytics from '@react-native-firebase/analytics';
import {
  NavigationContainerRef,
  NavigationState,
  PartialState
} from '@react-navigation/native';

export interface AnalyticsContextValue {
  navigationRef: MutableRefObject<NavigationContainerRef>;
  onStateChange: (state: NavigationState) => void;
}

export class Analytics {
  static useAnalytics = (userId?: string): AnalyticsContextValue => {
    const routeNameRef = useRef<string>();
    const navigationRef = useRef<NavigationContainerRef>(null);

    useEffect(() => {
      navigationRef.current.getRootState();
      routeNameRef.current = Analytics.getActiveRouteName(
        navigationRef.current.getRootState()
      );
      analytics().logScreenView({
        screen_name: routeNameRef.current,
        screen_class: routeNameRef.current
      });
    }, []);

    useEffect((): void => {
      Analytics.setUserId(userId);
    }, [userId]);

    const onStateChange = useCallback((currentState: NavigationState): void => {
      const prevRouteName: string = routeNameRef.current;
      const currentRouteName: string = Analytics.getActiveRouteName(
        currentState
      );

      if (prevRouteName !== currentRouteName) {
        analytics().logScreenView({
          screen_name: currentRouteName,
          screen_class: currentRouteName
        });
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
  ): string {
    if (!navigationState) {
      return null;
    }

    const route = navigationState.routes[navigationState.index];
    if (route.state?.routes) {
      return this.getActiveRouteName(route.state);
    }

    return route.name;
  }

  static logEvent(name: string, params?: Record<string, any>): Promise<void> {
    return analytics().logEvent(name, params);
  }

  static setUserId(id: string): Promise<void> {
    return analytics().setUserId(id);
  }
}
