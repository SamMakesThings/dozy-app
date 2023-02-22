import { useRef, useEffect, useMemo, useCallback, createRef } from 'react';
import {
  NavigationContainerRef,
  NavigationState,
  PartialState,
  StackActions,
} from '@react-navigation/native';

export interface NavigationContextValue {
  onStateChange: (state: NavigationState) => void;
}

export default class Navigation {
  static currentRouteName: string | undefined;

  static rootNavigator = createRef<NavigationContainerRef>();

  static isInTabNavigator = false;

  static useNavigationService(
    subscriptions: ((currentRoute?: string, prevRoute?: string) => void)[] = [],
    initialSubscriptions: ((currentRoute?: string) => void)[] = [],
  ): NavigationContextValue {
    const routeNameRef = useRef<string>();
    Navigation.rootNavigator = useRef<NavigationContainerRef>(null);

    useEffect(() => {
      routeNameRef.current = Navigation.getActiveRouteName(
        Navigation.rootNavigator.current!.getRootState(),
      )!;
      Navigation.currentRouteName = routeNameRef.current;
      initialSubscriptions.forEach((initialSubscription) => {
        initialSubscription(routeNameRef.current);
      });
    }, []);

    const onStateChange = useCallback(
      (currentState: NavigationState): void => {
        const prevRouteName: string | undefined = routeNameRef.current;
        const currentRouteName: string =
          Navigation.getActiveRouteName(currentState)!;

        subscriptions.forEach((subscription) => {
          subscription(currentRouteName, prevRouteName);
        });

        routeNameRef.current = currentRouteName;
        Navigation.currentRouteName = currentRouteName;
      },
      [subscriptions],
    );

    const navigationContext = useMemo(
      (): NavigationContextValue => ({
        onStateChange,
      }),
      [onStateChange],
    );

    return navigationContext;
  }

  static getActiveRouteName(
    navigationState: NavigationState | PartialState<NavigationState>,
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

  static setIsInTabNavigator(value: boolean): void {
    Navigation.isInTabNavigator = value;
  }

  static navigate(name: string, params?: Record<string, any>): void {
    Navigation.rootNavigator.current?.navigate(name, params);
  }

  static push(name: string, params?: Record<string, any>): void {
    Navigation.rootNavigator.current?.dispatch(StackActions.push(name, params));
  }
}
