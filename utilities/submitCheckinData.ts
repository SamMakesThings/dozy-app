import '@firebase/firestore';
import * as firebase from 'firebase';
import { FbLib } from '../config/firebaseConfig';

interface Args {
  userId: string;
  nextCheckinDatetime: Date;
  lastCheckinDatetime: Date;
  checkinPostponed: boolean;
  newCheckinModule: string;
  targetTimeInBed: number;
  targetBedTime: Date;
  targetWakeTime: Date;
  treatmentPlan: Array<object>;
}

// Does using the ref.update function overwrite maps?
// If so, then add previous treatmentsHistory as an input and feed firestore
// ...the updated version

// Function that updates currentTreatments, nextCheckin, and treatmentsHistory in Firebase
// Mandatory inputs: dates re: next checkin, SRT changes, treatment to be added to
// ...currentTreatments, and data to be added to treatmentsHistory.
async function submitCheckinData({ userId }: Args) {
  // Initialize relevant Firebase values
  const db: firebase.firestore.Firestore = FbLib.firestore();
  const userDocRef = db.collection('users').doc(userId);
  const userTreatmentsColRef = userDocRef.collection('treatmentsHistory');

  // Update nextCheckin
  // If postponed, update checkin date while not updating anything else
  userDocRef.update({});

  // Update currentTreatments

  // Update treatmentsHistory

  // Return whether or not the call was successful
  return true;
}
