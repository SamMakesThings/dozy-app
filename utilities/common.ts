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

export class Deffered {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  promise: Promise<Record<string, any>>;

  resolve: (value: Record<string, any>) => void = () => undefined;

  reject: (reason?: any) => void = () => undefined;
}

export function extractParamsFromUrl(
  url: string,
  caseSensitive = true,
): Record<string, any> {
  // we'll store the parameters here
  const obj: Record<string, any> = {};
  if (!url) {
    return obj;
  }
  // get query string from url
  const indexOfParam = url.indexOf('?');
  let queryString = indexOfParam !== -1 ? url.slice(indexOfParam + 1) : '';
  // if query string exists
  if (queryString) {
    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];
    // split our query string into its component parts
    const arr = queryString.split('&');
    for (let i = 0; i < arr.length; i++) {
      // separate the keys and the values
      const indexOfValue = arr[i].indexOf('=');
      const a = [
        arr[i].substr(0, indexOfValue),
        arr[i].substr(indexOfValue + 1),
      ];
      // set parameter name and value (use 'true' if empty)
      let paramName = a[0];
      const paramValue = typeof a[1] === 'undefined' ? true : a[1];
      // (optional) keep case consistent
      if (!caseSensitive) {
        paramName = paramName.toLowerCase();
      }
      //if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();
      // if the paramName ends with square brackets, e.g. colors[] or colors[2]
      if (paramName.match(/\[(\d+)?\]$/)) {
        // create key if it doesn't exist
        const key = paramName.replace(/\[(\d+)?\]/, '');
        if (!obj[key]) obj[key] = [];
        // if it's an indexed array e.g. colors[2]
        if (paramName.match(/\[\d+\]$/)) {
          // get the index value and add the entry at the appropriate position
          const index = /\[(\d+)\]/.exec(paramName)?.[1];
          obj[key][index!] = paramValue;
        } else {
          // otherwise add the value to the end of the array
          obj[key].push(paramValue);
        }
      } else {
        // we're dealing with a string
        if (!obj[paramName]) {
          // if it doesn't exist, create property
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === 'string') {
          // if property does exist and it's a string, convert it to an array
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          // otherwise add the property
          obj[paramName].push(paramValue);
        }
      }
    }
  }

  return obj;
}
