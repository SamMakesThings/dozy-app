import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import moment from 'moment';
import Auth from '../../utilities/auth.service';
import { sendEmail } from '../../utilities/email.service';

admin.initializeApp(functions.config().firebase);

export const onboardingReminder = functions.pubsub
  .schedule('every 24 hours')
  .onRun(() => {
    const {
      state: { onboardingComplete, userData },
    } = Auth.useAuth();
    const dayDifference = [1, 3, 5];
    const signUpDate = userData?.signUpDate?.toDate();

    if (!onboardingComplete && !!signUpDate) {
      const today = moment();
      // Get the day difference between current day and day of sign up
      const daysFromSignUp = today.diff(moment(signUpDate, 'days'));
      const daysFormatted = moment.duration(daysFromSignUp, 'days').asDays();

      const isEmailDay = dayDifference.includes(daysFormatted);

      if (isEmailDay) {
        sendEmail(userData.email);
      }
    }
    return null;
  });
