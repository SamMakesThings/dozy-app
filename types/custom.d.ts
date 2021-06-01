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
  logId: string;
  bedTime: firebase.firestore.Timestamp;
  fallAsleepTime: firebase.firestore.Timestamp;
  wakeTime: firebase.firestore.Timestamp;
  upTime: firebase.firestore.Timestamp;
  sleepDuration: number;
  sleepEfficiency: number;
  nightMinsAwake: number;
  minsToFallAsleep: number;
  wakeCount: number;
  SCTAnythingNonSleepInBed?: boolean;
  SCTNonSleepActivities?: string;
  notes: string;
  tags: string[];
}

export type Chat = {
  chatId?: string;
  sender: string;
  message: string;
  time: firebase.firestore.Timestamp | Date;
  sentByUser: boolean;
};

export type Task = {
  label: string;
  completedTimestamp?: firebase.firestore.Timestamp;
  dailyRecurring: boolean;
  source: string;
  visibleAfterDate?: firebase.firestore.Timestamp;
  notification?: {
    enabled: boolean;
    notifTime: firebase.firestore.Timestamp;
  };
  taskId: string;
};
