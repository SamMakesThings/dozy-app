import moment from 'moment';

export function convertAnalyticsEventName(originalName: string): string {
  const strWithUnderscore = originalName
    .replace(/[^a-z0-9\s_]/gi, '')
    .trim()
    .replace(/\s+_*|_+\s*/g, '_');

  return (/^[0-9]/.test(strWithUnderscore)
    ? `Event_${strWithUnderscore}`
    : strWithUnderscore
  ).substr(0, 40);
}

export function convertLocalDateToUTCWithSameValues(date: Date): Date {
  return moment.utc(moment(date).format('YYYY-MM-DD HH:mm')).toDate();
}

export function convertUTCDateToLocalWithSameValues(date: Date): Date {
  return moment(moment(date).utc().format('YYYY-MM-DD HH:mm')).toDate();
}
