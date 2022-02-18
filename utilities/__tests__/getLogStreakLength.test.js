import { isPreviousDay } from '../getLogStreakLength';

it('succeeds when date2 is within the previous day', () => {
  const date1 = new Date('2021-06-01 12:59:00 PDT');
  const date2 = new Date('2021-05-31 05:06:07 PDT');

  expect(isPreviousDay(date1, date2)).toBeTruthy();
});

it('fails when date2 is before the previous day', () => {
  const date1 = new Date('2021-06-01 12:59:00 PDT');
  const date2 = new Date('2021-05-30 05:06:07 PDT');

  expect(isPreviousDay(date1, date2)).toBeFalsy();
});
