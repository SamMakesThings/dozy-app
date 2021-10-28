import firestore from '@react-native-firebase/firestore';
import * as SecureStore from 'expo-secure-store';
import ExpoConstants from 'expo-constants';
import { Analytics } from './analytics.service';
import AnalyticsEvents from '../constants/AnalyticsEvents';

export default async function submitFeedback(
  rate: number,
  feedback?: string,
): Promise<void> {
  const userId = await SecureStore.getItemAsync('userId');

  if (userId) {
    const feedbackData = {
      rate,
      feedback,
      version: ExpoConstants.nativeAppVersion,
    };
    await firestore()
      .collection('users')
      .doc(userId)
      .collection('feedbacks')
      .add({
        ...feedbackData,
        date: new Date(),
      });
    Analytics.logEvent(AnalyticsEvents.leaveFeedback, feedbackData);
  }
}
