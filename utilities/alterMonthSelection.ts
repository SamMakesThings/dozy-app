// A utility function to always return a valid date number given a starting date and a delta
export default function alterMonthSelection(
  prevDate: { month: number; year: number },
  changeBy: number,
): { month: number; year: number } {
  let { month, year } = prevDate;
  const adjustedMonth = month + changeBy;

  if (adjustedMonth === 12) {
    month = 0;
    year += 1;
  } else if (adjustedMonth === -1) {
    month = 11;
    year += -1;
  } else {
    month = adjustedMonth;
  }

  return { month: month, year: year };
}
