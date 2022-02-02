import {
  useState,
  useContext,
  useMemo,
  useCallback,
  createContext,
} from 'react';
import { omit } from 'lodash';
import { SleepLog } from '../types/custom';
import Auth from './auth.service';
import HealthDevice from './healthDevice.service';

export type DiaryEntryStep =
  | 'TrackerStart'
  | 'BedTimeInput'
  | 'MinsToFallAsleepInput'
  | 'PMRAsk'
  | 'PITAsk'
  | 'WakeCountInput'
  | 'SCTUpCountInput'
  | 'SCTAnythingNonSleepInBedInput'
  | 'SCTNonSleepActivitiesInput'
  | 'SCTDaytimeNapsInput'
  | 'NightMinsAwakeInput'
  | 'WakeTimeInput'
  | 'UpTimeInput'
  | 'SleepRatingInput'
  | 'TagsNotesInput';

export interface DiaryEntryStepData {
  screen: DiaryEntryStep;
  progress: number;
}

export interface LogState
  extends Omit<SleepLog, 'bedTime' | 'fallAsleepTime' | 'wakeTime' | 'upTime'> {
  bedTime: Date;
  fallAsleepTime: Date;
  wakeTime: Date;
  upTime: Date;
  logDate: Date;
  isZeroSleep?: boolean;
  PMRPractice?: string;
  PITPractice?: boolean;
  SCTUpCount?: number;
  SCTDaytimeNaps?: boolean;
}

export interface DiaryEntryFlowContextValue {
  logState?: LogState;
  isPMRActive?: boolean;
  isPITActive?: boolean;
  isSCTActive?: boolean;
  initFlow: (log?: SleepLog) => DiaryEntryStepData;
  updateFlow: (
    newLogData: Partial<LogState>,
    currentStep: DiaryEntryStep,
    isUpdateFlow?: boolean,
  ) => DiaryEntryStepData & { logState: LogState };
}

class DiaryEntryFlow {
  static Context = createContext<DiaryEntryFlowContextValue | null>(null);

  static flow: DiaryEntryStep[] = [];

  static useDiaryEntryFlowService(): DiaryEntryFlowContextValue {
    const { state } = Auth.useAuth();
    const { devices } = HealthDevice.useHealthDevice();

    const [logState, setLogState] = useState<LogState | undefined>();

    const isOuraConnected = useMemo(
      () => HealthDevice.isDeviceConnected(devices, 'oura'),
      [devices],
    );

    const isPMRActive = useMemo(
      () => !!state.userData?.currentTreatments?.RLX,
      [state.userData?.currentTreatments?.RLX],
    );
    const isPITActive = useMemo(
      () => !!state.userData?.currentTreatments?.PIT,
      [state.userData?.currentTreatments?.PIT],
    );
    const isSCTActive = useMemo(
      () => !!state.userData?.currentTreatments?.SCTSRT,
      [state.userData?.currentTreatments?.SCTSRT],
    );

    const initFlow = useCallback(
      (log?: SleepLog): DiaryEntryStepData => {
        setLogState(
          log
            ? {
                ...omit(log, [
                  'bedTime',
                  'fallAsleepTime',
                  'wakeTime',
                  'upTime',
                ]),
                bedTime: log.bedTime.toDate(),
                fallAsleepTime: log.fallAsleepTime.toDate(),
                wakeTime: log.wakeTime.toDate(),
                upTime: log.upTime.toDate(),
                logDate: log.upTime.toDate(),
                isZeroSleep: false,
              }
            : undefined,
        );

        DiaryEntryFlow.flow = [
          'BedTimeInput',
          'MinsToFallAsleepInput',
          'PMRAsk',
          'PITAsk',
          'WakeCountInput',
          'SCTUpCountInput',
          'SCTAnythingNonSleepInBedInput',
          'SCTNonSleepActivitiesInput',
          'SCTDaytimeNapsInput',
          'NightMinsAwakeInput',
          'WakeTimeInput',
          'UpTimeInput',
          'SleepRatingInput',
          'TagsNotesInput',
        ];
        if (log?.isDraft || (!log && isOuraConnected)) {
          DiaryEntryFlow.flow = ['TrackerStart', ...DiaryEntryFlow.flow];
        }

        return {
          screen: DiaryEntryFlow.flow[0],
          progress: Math.round((1 / DiaryEntryFlow.flow.length) * 100) / 100,
        };
      },
      [isOuraConnected],
    );

    const updateFlow = useCallback(
      (
        newLogData: Partial<LogState>,
        currentStep: DiaryEntryStep,
        isUpdateFlow = true,
      ): DiaryEntryStepData & { logState: LogState } => {
        let nextStepData = DiaryEntryFlow.getNextStepData(
          DiaryEntryFlow.flow,
          currentStep,
        );
        const newLogState = {
          ...logState,
          ...newLogData,
        } as LogState;

        setLogState(newLogState);

        if (isUpdateFlow) {
          const getNextSteps = (
            activeStep: DiaryEntryStep,
          ): DiaryEntryStep[] => {
            const nextStepsByCurrentStep = (
              step: DiaryEntryStep,
            ): DiaryEntryStep[] => [step, ...getNextSteps(step)];
            let newSteps: DiaryEntryStep[] = [];

            if (activeStep === 'TrackerStart') {
              if (newLogState.isDraft) {
                if (isPMRActive) {
                  newSteps = nextStepsByCurrentStep('PMRAsk');
                } else if (isPITActive) {
                  newSteps = nextStepsByCurrentStep('PITAsk');
                } else if (isSCTActive) {
                  if (
                    newLogState.minsToFallAsleep >= 20 ||
                    newLogState.wakeCount >= 1
                  ) {
                    newSteps = nextStepsByCurrentStep('SCTUpCountInput');
                  } else {
                    newSteps = nextStepsByCurrentStep('SCTDaytimeNapsInput');
                  }
                } else {
                  newSteps = nextStepsByCurrentStep('SleepRatingInput');
                }
              } else {
                newSteps = nextStepsByCurrentStep('BedTimeInput');
              }
            } else if (activeStep === 'BedTimeInput') {
              newSteps = nextStepsByCurrentStep('MinsToFallAsleepInput');
            } else if (activeStep === 'MinsToFallAsleepInput') {
              if (isPMRActive) {
                newSteps = nextStepsByCurrentStep('PMRAsk');
              } else if (isPITActive) {
                newSteps = nextStepsByCurrentStep('PITAsk');
              } else if (newLogState.isZeroSleep) {
                if (isSCTActive) {
                  newSteps = nextStepsByCurrentStep('SCTUpCountInput');
                } else {
                  newSteps = nextStepsByCurrentStep('UpTimeInput');
                }
              } else {
                newSteps = nextStepsByCurrentStep('WakeCountInput');
              }
            } else if (activeStep === 'PMRAsk') {
              if (isPITActive) {
                newSteps = nextStepsByCurrentStep('PITAsk');
              } else if (newLogState.isZeroSleep) {
                if (isSCTActive) {
                  newSteps = nextStepsByCurrentStep('SCTUpCountInput');
                } else {
                  newSteps = nextStepsByCurrentStep('UpTimeInput');
                }
              } else if (newLogState.isDraft) {
                if (isSCTActive) {
                  if (
                    newLogState.minsToFallAsleep >= 20 ||
                    newLogState.wakeCount >= 1
                  ) {
                    newSteps = nextStepsByCurrentStep('SCTUpCountInput');
                  } else {
                    newSteps = nextStepsByCurrentStep('SCTDaytimeNapsInput');
                  }
                } else {
                  newSteps = nextStepsByCurrentStep('SleepRatingInput');
                }
              } else {
                newSteps = nextStepsByCurrentStep('WakeCountInput');
              }
            } else if (activeStep === 'PITAsk') {
              if (newLogState.isZeroSleep) {
                if (isSCTActive) {
                  newSteps = nextStepsByCurrentStep('SCTUpCountInput');
                } else {
                  newSteps = nextStepsByCurrentStep('UpTimeInput');
                }
              } else if (newLogState.isDraft) {
                if (isSCTActive) {
                  if (
                    newLogState.minsToFallAsleep >= 20 ||
                    newLogState.wakeCount >= 1
                  ) {
                    newSteps = nextStepsByCurrentStep('SCTUpCountInput');
                  } else {
                    newSteps = nextStepsByCurrentStep('SCTDaytimeNapsInput');
                  }
                } else {
                  newSteps = nextStepsByCurrentStep('SleepRatingInput');
                }
              } else {
                newSteps = nextStepsByCurrentStep('WakeCountInput');
              }
            } else if (activeStep === 'WakeCountInput') {
              if (isSCTActive) {
                if (
                  newLogState.minsToFallAsleep >= 20 ||
                  newLogState.wakeCount >= 1
                ) {
                  newSteps = nextStepsByCurrentStep('SCTUpCountInput');
                } else {
                  newSteps = nextStepsByCurrentStep('SCTDaytimeNapsInput');
                }
              } else if (newLogState.wakeCount === 0) {
                newSteps = nextStepsByCurrentStep('WakeTimeInput');
              } else {
                newSteps = nextStepsByCurrentStep('NightMinsAwakeInput');
              }
            } else if (activeStep === 'SCTUpCountInput') {
              newSteps = nextStepsByCurrentStep(
                'SCTAnythingNonSleepInBedInput',
              );
            } else if (activeStep === 'SCTAnythingNonSleepInBedInput') {
              if (newLogState.SCTAnythingNonSleepInBed) {
                newSteps = nextStepsByCurrentStep('SCTNonSleepActivitiesInput');
              } else {
                newSteps = nextStepsByCurrentStep('SCTDaytimeNapsInput');
              }
            } else if (activeStep === 'SCTNonSleepActivitiesInput') {
              newSteps = nextStepsByCurrentStep('SCTDaytimeNapsInput');
            } else if (activeStep === 'SCTDaytimeNapsInput') {
              if (newLogState.isZeroSleep) {
                newSteps = nextStepsByCurrentStep('UpTimeInput');
              } else if (newLogState.isDraft) {
                newSteps = nextStepsByCurrentStep('SleepRatingInput');
              } else if (newLogState.wakeCount === 0) {
                newSteps = nextStepsByCurrentStep('WakeTimeInput');
              } else {
                newSteps = nextStepsByCurrentStep('NightMinsAwakeInput');
              }
            } else if (activeStep === 'NightMinsAwakeInput') {
              newSteps = nextStepsByCurrentStep('WakeTimeInput');
            } else if (activeStep === 'WakeTimeInput') {
              newSteps = nextStepsByCurrentStep('UpTimeInput');
            } else if (activeStep === 'UpTimeInput') {
              newSteps = nextStepsByCurrentStep('SleepRatingInput');
            } else if (activeStep === 'SleepRatingInput') {
              newSteps = nextStepsByCurrentStep('TagsNotesInput');
            }

            return newSteps;
          };

          const currentStepIndex = DiaryEntryFlow.flow.indexOf(currentStep);
          const nextSteps = getNextSteps(currentStep);
          if (nextSteps.length) {
            DiaryEntryFlow.flow = [
              ...DiaryEntryFlow.flow.slice(0, currentStepIndex + 1),
              ...nextSteps,
            ];
          }
          nextStepData = DiaryEntryFlow.getNextStepData(
            DiaryEntryFlow.flow,
            currentStep,
          );
        }

        return {
          ...nextStepData,
          logState: newLogState,
        };
      },
      [logState, isPMRActive, isPITActive, isSCTActive],
    );

    const contextValue = useMemo(
      (): DiaryEntryFlowContextValue => ({
        logState,
        isPMRActive,
        isPITActive,
        isSCTActive,
        initFlow,
        updateFlow,
      }),
      [logState, isPMRActive, isPITActive, isSCTActive, initFlow, updateFlow],
    );

    return contextValue;
  }

  static getNextStepData(
    flow: DiaryEntryStep[],
    currentStep: DiaryEntryStep,
  ): DiaryEntryStepData {
    const index = flow.indexOf(currentStep);

    return {
      screen: flow[index + 1],
      progress: Math.round(((index + 1) / flow.length) * 100) / 100,
    };
  }

  static useDiaryEntryFlow(): DiaryEntryFlowContextValue {
    return useContext<DiaryEntryFlowContextValue>(
      DiaryEntryFlow.Context as React.Context<DiaryEntryFlowContextValue>,
    );
  }
}

export default DiaryEntryFlow;
