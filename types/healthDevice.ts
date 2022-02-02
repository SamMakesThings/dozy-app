export type HealthDeviceProvider =
  | 'fitbit'
  | 'oura'
  | 'withings'
  | 'training peaks'
  | 'suunto'
  | 'garmin'
  | 'polar'
  | 'wahoo'
  | 'huawei'
  | 'wear os'
  | 'zwift'
  | 'google'
  | 'samsung'
  | 'apple'
  | 'peloton'
  | 'eight sleep'
  | 'xiaomi'
  | 'freestyle libre'
  | 'dexcom'
  | 'concept2'
  | 'ifit'
  | 'tempofit'
  | 'ihealth';

export interface HealthDeviceData {
  provider: HealthDeviceProvider;
  sessionId?: string;
  widgetUrl?: string;
  userId?: string; // Terra user ID
}

export interface SessionRequestResponse {
  success: boolean;
  message?: string;
  sessionId?: string;
  widgetUrl?: string;
}

export interface TerraRequestResponse<T> {
  success: boolean;
  message?: string;
  data?: T[];
}

export interface HRVSample {
  hrv: number | null;
  timestamp: string | null;
}

export interface HRSample {
  timestamp: string | null;
  bpm: number | null;
}

export interface BreathSample {
  breaths_per_min: number | null;
  timestamp: string | null;
}

export interface SPO2Sample {
  timestamp: string | null;
  percentage: number | null;
}

export interface SnoringSample {
  duration: number | null;
  timestamp: string | null;
}

export interface HypnogramSample {
  level: SleepLevel | null;
  timestamp: string | null;
}

export enum SleepLevel {
  unknown = 0,
  awake = 1,
  sleeping = 2,
  outOfBed = 3,
  light = 4,
  deep = 5,
  rem = 6,
}

export interface TerraSleepData {
  heart_rate_data: {
    summary: {
      user_hr_max: number;
      min_hr: number;
      avg_hr_variability: number;
      avg_hr: number;
      max_hr: number;
    };
    detailed: {
      hrv_samples: Array<HRVSample>;
      hr_samples: Array<HRSample>;
    };
  };
  respiration_data: {
    breaths_data: {
      samples: Array<BreathSample>;
      end_time: string | null;
      start_time: string | null;
      max_breaths_per_min: number | null;
      min_breaths_per_min: number | null;
      avg_breaths_per_min: number | null;
      on_demand_reading: boolean | null;
    };
    oxygen_saturation_data: {
      samples: Array<SPO2Sample>;
      end_time: string | null;
      start_time: string | null;
      on_demand_reading: boolean | null;
    };
    snoring_data: {
      num_snoring_events: number | null;
      samples: Array<SnoringSample>;
      end_time: string | null;
      start_time: string | null;
      total_snoring_duration: number | null;
    };
  };
  metadata: {
    sleep_efficiency: number;
    end_time: string;
    start_time: string;
    sleep_duration_planned: number;
  };
  sleep_durations_data: {
    awake: {
      num_out_of_bed_events: number;
      num_wakeup_events: number;
      duration_after_wakeup: number;
      waso: number;
      duration_before_sleeping: number;
      duration_long_interruption: number;
      duration_awake_state: number;
      duration_short_interruption: number;
    };
    other: {
      duration_unmeasurable_sleep: number;
      duration_in_bed: number;
    };
    hypnogram_samples: Array<HypnogramSample>;
    asleep: {
      duration_deep_sleep_state: number;
      duration_REM_sleep_state: number;
      duration_asleep_state: number;
      num_REM_events: number;
      duration_light_sleep_state: number;
    };
  };
  temperature_data: {
    delta: number;
  };
}
