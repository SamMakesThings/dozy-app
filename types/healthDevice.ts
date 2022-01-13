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
