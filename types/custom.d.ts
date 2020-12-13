declare module '*.svg?inline' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

export interface Navigation {
  navigate: Function;
  goBack: Function;
  setParams: Function;
}

export interface SleepLog {
  bedTime: firebase.firestore.Timestamp;
  fallAsleepTime: firebase.firestore.Timestamp;
  wakeTime: firebase.firestore.Timestamp;
  upTime: firebase.firestore.Timestamp;
  sleepDuration: number;
  sleepEfficiency: number;
  nightMinsAwake: number;
  minsToFallAsleep: number;
}
