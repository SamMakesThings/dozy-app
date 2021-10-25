import momentTZ from 'moment-timezone';
import { encodeLocalTime, decodeUTCTime } from '../time';
import Time from '../../constants/Time';

describe('time utilities', () => {
  it('encodeLocalTime should have timezone field', () => {
    const encodedTime = encodeLocalTime(new Date());

    expect(encodedTime.timezone).toBeDefined();
  });

  it('decodeUTCTime should have the same hour and minute values', () => {
    const hour = 10;
    const minute = 30;
    const timezone = 'America/Los_Angeles';
    const time = momentTZ.tz(`2021-09-30 ${hour}:${minute}`, timezone).toDate();

    const decodedTime = decodeUTCTime({
      version: Time.timeDataVersion,
      value: time,
      timezone,
    });

    expect(decodedTime.getHours()).toBe(hour);
    expect(decodedTime.getMinutes()).toBe(minute);
  });
});