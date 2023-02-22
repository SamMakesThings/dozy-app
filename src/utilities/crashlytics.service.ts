import { useEffect } from 'react';
import crashlytics from '@react-native-firebase/crashlytics';

export default class Crashlytics {
  static useCrashlytics(userId?: string): void {
    useEffect((): void => {
      if (userId) {
        Crashlytics.setUserId(userId);
      }
    }, [userId]);
  }

  static async setUserId(id: string): Promise<null> {
    return crashlytics().setUserId(id);
  }

  static async setAttribute(name: string, value: string): Promise<null> {
    return crashlytics().setAttribute(name, value);
  }

  static async setAttributes(
    attributes: Record<string, string>,
  ): Promise<null> {
    return crashlytics().setAttributes(attributes);
  }

  static log(message: string): void {
    return crashlytics().log(message);
  }

  static recordError(error: Error, jsErrorName?: string): void {
    return crashlytics().recordError(error, jsErrorName);
  }
}
