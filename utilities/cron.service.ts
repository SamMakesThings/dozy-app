import functions from 'firebase-functions';
// import nodemailer from 'nodemailer';
// import Auth from './auth.service';

exports.onBoardingReminder = functions.pubsub
  .schedule('every 24 hours')
  .onRun(() => {
    // const { state } = Auth.useAuth();
    // const isOnboardingComplete = state.onboardingComplete;
    // const dayDifference = [1, 3, 5];
    // if (!isOnboardingComplete) {
    //   const isEmailDay = dayDifference.includes(1);
    // }
    return null;
  });
