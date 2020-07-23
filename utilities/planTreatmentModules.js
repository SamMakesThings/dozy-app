function planTreatmentModules(sleepLogs) {
  // sleepLogs should be an array of log objects
  // I should really just bite the bullet and learn TypeScript...

  const sampleTreatmentPlan = [
    {
      module: 'BSL',
      estDate: new Date()
    },
    {
      module: 'SCTSRT',
      estDate: new Date()
    }
  ];

  console.log(sampleTreatmentPlan);
  return sampleTreatmentPlan;
}

export default planTreatmentModules;
