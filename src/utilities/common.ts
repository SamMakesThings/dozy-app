export function convertAnalyticsEventName(originalName: string): string {
  const strWithUnderscore = originalName
    .replace(/[^a-z0-9\s_]/gi, '')
    .trim()
    .replace(/\s+_*|_+\s*/g, '_');

  return (
    /^[0-9]/.test(strWithUnderscore)
      ? `Event_${strWithUnderscore}`
      : strWithUnderscore
  ).substr(0, 40);
}
