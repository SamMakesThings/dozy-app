import moment from 'moment';
import treatments from '../constants/Treatments';

function planTreatmentModules({ currentTreatments }) {
  // sleepLogs should be an array of log objects
  // I should really just bite the bullet and learn TypeScript...

  const defaultTreatmentOrder = Object.keys(treatments);

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

  // Add the remaining treatments in priority order
  let addDays = 2;
  defaultTreatmentOrder.forEach((module) => {
    if (
      !treatmentPlan.some((item) => item.module === module) &&
      treatments[module].optional === false
    ) {
      treatmentPlan.push({
        module: module,
        estDate: moment().add(addDays, 'days'),
        started: false
      });
      addDays += 7;
    }
  });

  /*
  const sampleTreatmentPlan = [
    {
      module: 'BSL',
      estDate: new Date()
    },
    {
      module: 'SCTSRT',
      estDate: new Date()
    }
  ]; */

  console.log(treatmentPlan);

  // Output should be an ordered array of objects
  return treatmentPlan;
}

export default planTreatmentModules;
