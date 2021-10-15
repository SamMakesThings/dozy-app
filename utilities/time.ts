import moment from 'moment';
import TimeConstants from '../constants/Versions';

export function convertLocalDateToUTCWithSameValues(date: Date): Date {
  return moment.utc(moment(date).format('YYYY-MM-DD HH:mm')).toDate();
}

export function convertUTCDateToLocalWithSameValues(date: Date): Date {
  return moment(moment(date).utc().format('YYYY-MM-DD HH:mm')).toDate();
}

export function encodeLocalTime(date: Date): { value: Date; version: string } {
  return {
    version: TimeConstants.timeDataVersion,
    value: convertLocalDateToUTCWithSameValues(date),
  };
}

export function decodeUTCTime(date: Date, version?: string): Date {
  let localDate: Date;

  if (version === '0.2') {
    localDate = convertUTCDateToLocalWithSameValues(date);
  } else {
    localDate = date;
  }

  return localDate;
}
