import firestore from '@react-native-firebase/firestore';

interface ReminderObject {
  expoPushToken: string;
  title?: string;
  body: string;
  type: string;
  time: Date;
  enabled: boolean;
}

interface Args {
  userId: string;
  nextCheckinDatetime: Date;
  lastCheckinDatetime: Date;
  checkinPostponed: boolean;
  nextCheckinModule: string;
  lastCheckinModule: string;
  targetTimeInBed: number;
  targetBedTime: Date;
  targetWakeTime: Date;
  sleepEfficiencyAvgBaseline?: number;
  sleepOnsetAvgBaseline?: number;
  nightMinsAwakeAvgBaseline?: number;
  sleepDurationAvgBaseline?: number;
  additionalCheckinData?: Record<string, any>;
  reminderObject?: ReminderObject | Array<ReminderObject>;
}

// Function that updates currentTreatments, nextCheckin, and treatmentsHistory in Firebase
// Mandatory inputs: dates re: next checkin, SRT changes, treatment to be added to
// ...currentTreatments, and data to be added to treatmentsHistory.
export default function submitCheckinData({
  userId,
  checkinPostponed,
  nextCheckinDatetime,
  lastCheckinDatetime,
  nextCheckinModule,
  lastCheckinModule,
  targetBedTime,
  targetWakeTime,
  targetTimeInBed,
  sleepEfficiencyAvgBaseline,
  sleepOnsetAvgBaseline,
  nightMinsAwakeAvgBaseline,
  sleepDurationAvgBaseline,
  additionalCheckinData,
  reminderObject,
}: Args): boolean {
  try {
    // Initialize relevant Firebase values
    const userDocRef = firestore().collection('users').doc(userId);
    const userTreatmentsColRef = userDocRef.collection('treatmentsHistory');

    // Update nextCheckin & currentTreatments
    // If postponed, update checkin date while not updating anything else
    if (checkinPostponed) {
      return false;
    }
    userDocRef.update({
      nextCheckin: {
        nextCheckinDatetime: nextCheckinDatetime,
        treatmentModule: nextCheckinModule,
      },
      'currentTreatments.nextCheckinDatetime': nextCheckinDatetime,
      'currentTreatments.lastCheckinDatetime': lastCheckinDatetime,
    });
    userDocRef.update({
      'currentTreatments.currentModule': lastCheckinModule,
      'currentTreatments.nextTreatmentModule': nextCheckinModule,
      ['currentTreatments.' + lastCheckinModule]: lastCheckinDatetime,
      'currentTreatments.targetBedTime': targetBedTime,
      'currentTreatments.targetWakeTime': targetWakeTime,
      'currentTreatments.targetTimeInBed': targetTimeInBed,
    });

    // If SCTSRT checkin, add baseline stats for easy reference
    if (lastCheckinModule === 'SCTSRT') {
      userDocRef.update({
        'baselineInfo.sleepEfficiencyAvg': sleepEfficiencyAvgBaseline,
        'baselineInfo.sleepOnsetAvg': sleepOnsetAvgBaseline,
        'baselineInfo.nightMinsAwakeAvg': nightMinsAwakeAvgBaseline,
        'baselineInfo.sleepDurationAvg': sleepDurationAvgBaseline,
      });
    }

    // Update treatmentsHistory collection by adding doc for module
    userTreatmentsColRef.doc(lastCheckinModule).set({
      dateStarted: lastCheckinDatetime,
      targetBedTime: targetBedTime,
      targetWakeTime: targetWakeTime,
      targetTimeInBed: targetTimeInBed,
      ...additionalCheckinData,
    });

    // If reminder set during the module, add the reminder to user db
    if (reminderObject) {
      // If a single reminderObject is passed, put it in an array
      const reminderArray =
        reminderObject.constructor !== Array
          ? [reminderObject]
          : reminderObject;
      reminderArray.map((reminder) => {
        userDocRef.collection('notifications').add(reminder);
      });
    }
  } catch (error) {
    console.log(error);
  }

  // End function
  return true;
}
