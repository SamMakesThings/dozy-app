export interface BasicTimeFormat {
  version?: string;
  value: Date;
}

export interface TimeFormat extends BasicTimeFormat {
  timezone?: string;
}
