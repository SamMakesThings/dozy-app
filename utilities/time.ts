import moment from 'moment';
import momentTZ from 'moment-timezone';
import TimeConstants from '../constants/Versions';
import { TimeFormat } from '../types/time';

export function convertLocalDateToUTCWithSameValues(date: Date): Date {
  return moment.utc(moment(date).format('YYYY-MM-DD HH:mm')).toDate();
}

export function convertUTCDateToLocalWithSameValues(date: Date): Date {
  return moment(moment(date).utc().format('YYYY-MM-DD HH:mm')).toDate();
}

export function encodeLocalTime(date: Date): TimeFormat {
  return {
    version: TimeConstants.timeDataVersion,
    value: date,
    timezone: momentTZ.tz.guess(true),
  };
}

export function decodeServerTime(data: TimeFormat): Date {
  let localDate: Date;

  if (data.version === '0.3') {
    localDate = moment(
      momentTZ(data.value).tz(data.timezone!).format('YYYY-MM-DD HH:mm'),
    ).toDate();
  } else if (data.version === '0.2') {
    localDate = convertUTCDateToLocalWithSameValues(data.value);
  } else {
    localDate = data.value;
  }

  return localDate;
}
