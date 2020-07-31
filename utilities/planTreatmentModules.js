import moment from 'moment';
import treatments from '../constants/Treatments';

function planTreatmentModules({ sleepLogs, currentTreatments }) {
  // sleepLogs should be an array of log objects
  // I should really just bite the bullet and learn TypeScript...

  let treatmentPlan = [];

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

  // TODO: Sort the already-completed treatments by date

  // So there are 3 main treatment paths (with additions if noncompliance or jet lag):
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
  let addDays = 2;
  defaultTreatmentOrder.forEach((module) => {
    if (
      !treatmentPlan.some((item) => item.module === module) &&
      treatments[module].optional === false
    ) {
      treatmentPlan.push({
        module: module,
        estDate: moment().add(addDays, 'days').toDate(),
        started: false
      });
      addDays += 7;
    }
  });

  console.log(treatmentPlan);

  // Output should be an ordered array of objects
  return treatmentPlan;
}

export default planTreatmentModules;
