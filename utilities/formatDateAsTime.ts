// Takes a JS Date object, returns a string of the form "1:00 AM"
export function formatDateAsTime(inputDate: Date) {
  return inputDate.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric'
  });
}
