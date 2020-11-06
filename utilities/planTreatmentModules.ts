import moment from 'moment';
import * as firebase from 'firebase';
import treatmentsRaw from '../constants/Treatments';

interface Args {
  sleepLogs: Array<{
    tags: Array<string>;
  }>;
  currentTreatments: {
    [key: string]: firebase.firestore.Timestamp;
  };
}
const treatments: { [key: string]: { optional: boolean } } = treatmentsRaw; // Give Treatments an iterable type

function planTreatmentModules({ sleepLogs, currentTreatments }: Args) {
  let treatmentPlan: Array<{
    module: string;
    estDate: Date;
    started: boolean;
  }> = [];

  // Add already completed treatments with their dates to the list first
  Object.keys(currentTreatments).map((item) => {
    if (treatments[item]) {
      treatmentPlan.push({
        module: item,
        estDate: currentTreatments[item].toDate(),
        started: true
      });
    }
  });
  // Sort already completed treatments by date
  treatmentPlan.sort((a: { estDate: Date }, b: { estDate: Date }) => {
    return a.estDate.getTime() - b.estDate.getTime();
  });

  // At the moment, there are 3 main treatment paths (with additions if noncompliance or jet lag):
  // Relaxation, cognitive, then hygiene is the default
  // If sleep log tags often contain temperature, light, or noise, then hygiene goes first
  // If user complains of tension, stress, or anxiety, then start w/relaxation
  // If harmful beliefs (measured in a sleep log maybe?), then prioritize that
  //
  // First task is to determine if there are more hygiene or stress related tags in the logs.
  let daysDisturbedByHygiene = 0;
  let daysDisturbedByStress = 0;
  const hygieneStrings = [
    'light',
    'noise',
    'pets',
    'kids',
    'my partner',
    'heat',
    'cold',
    'bad bed'
  ];
  const stressStrings = ['worry', 'stress'];

  // Count each day where tags are present
  sleepLogs.forEach((log) => {
    log.tags.some((r) => hygieneStrings.indexOf(r) >= 0)
      ? daysDisturbedByHygiene++
      : null;
    log.tags.some((r) => stressStrings.indexOf(r) >= 0)
      ? daysDisturbedByStress++
      : null;
  });

  let defaultTreatmentOrder = Object.keys(treatments);

  // Define a priority order based on the above tags
  // Duplicates are filtered out so shouldn't matter
  if (daysDisturbedByHygiene > daysDisturbedByStress + 4) {
    defaultTreatmentOrder.splice(2, 0, 'HYG');
  }

  // Add the remaining treatments in priority order
  const nextCheckinDatetime = currentTreatments.nextCheckinDatetime.toDate();
  let isNextCheckin = true;
  let addDays = 0;
  defaultTreatmentOrder.forEach((module) => {
    if (
      !treatmentPlan.some((item) => item.module === module) &&
      treatments[module].optional === false
    ) {
      treatmentPlan.push({
        module: module,
        estDate: isNextCheckin
          ? nextCheckinDatetime
          : moment(nextCheckinDatetime).add(addDays, 'days').toDate(),
        started: false
      });
      addDays += 7;
      isNextCheckin = false;
    }
  });

  // Output should be an ordered array of objects
  return treatmentPlan;
}

export default planTreatmentModules;