import '@firebase/firestore';
import * as firebase from 'firebase';
import { FbLib } from '../config/firebaseConfig';

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
}

// Function that updates currentTreatments, nextCheckin, and treatmentsHistory in Firebase
// Mandatory inputs: dates re: next checkin, SRT changes, treatment to be added to
// ...currentTreatments, and data to be added to treatmentsHistory.
async function submitCheckinData({
  userId,
  checkinPostponed,
  nextCheckinDatetime,
  lastCheckinDatetime,
  nextCheckinModule,
  lastCheckinModule,
  targetBedTime,
  targetWakeTime,
  targetTimeInBed
}: Args) {
  try {
    // Initialize relevant Firebase values
    const db: firebase.firestore.Firestore = FbLib.firestore();
    const userDocRef = db.collection('users').doc(userId);
    const userTreatmentsColRef = userDocRef.collection('treatmentsHistory');

    // Update nextCheckin & currentTreatments
    // If postponed, update checkin date while not updating anything else
    userDocRef.update({
      nextCheckin: {
        nextCheckinDatetime: nextCheckinDatetime,
        treatmentModule: nextCheckinModule
      },
      'currentTreatments.nextCheckinDatetime': nextCheckinDatetime,
      'currentTreatments.lastCheckinDatetime': lastCheckinDatetime
    });
    if (checkinPostponed) {
      return false;
    }
    userDocRef.update({
      'currentTreatments.currentModule': lastCheckinModule,
      'currentTreatments.nextTreatmentModule': nextCheckinModule,
      ['currentTreatments.' + lastCheckinModule]: lastCheckinDatetime
    });

    // Update treatmentsHistory collection by adding doc for module
    userTreatmentsColRef.doc(lastCheckinModule).set({
      dateStarted: lastCheckinDatetime,
      targetBedTime: targetBedTime,
      targetWakeTime: targetWakeTime,
      targetTimeInBed: targetTimeInBed
    });
  } catch (error) {
    console.log(error);
  }

  // End function
  return true;
}
