const twoDigit = (input: number) : string => {
  return (input < 10)
    ? `0${input.toString()}`
    : input.toString();
};

export const getISO8601date = (when : number | Date | null) : string => {
  if (when === null) {
    return '';
  }
  const _when = (typeof when === 'number')
    ? new Date(when)
    : when;

  return `${_when.getFullYear()}-`
    + `${twoDigit(_when.getMonth() + 1)}-`
    + `${twoDigit(_when.getDate())}`;
}

export const getISO8601time = (when : number | Date | null) : string => {
  if (when === null) {
    return '';
  }
  const _when = (typeof when === 'number')
    ? new Date(when)
    : when;

  return `${twoDigit(_when.getHours())}:`
    + `${twoDigit(_when.getMinutes())}:`
    + `${twoDigit(_when.getSeconds())}`;
}

export const getLocalISO8601 = (when : number | Date | null) : string => {
  if (when === null) {
    return '';
  }
  const _when = (typeof when === 'number')
    ? new Date(when)
    : when;

  let off = _when.getTimezoneOffset();
  let sign = 'GMT';

  if (off > 0) {
    sign = '-';
  } else if (off < 0) {
    sign = '+';
  }
  if (off < 0) {
    off *= -1;
  }

  if (sign !== 'GMT') {
    const minutes = (off % 60);
    const hours = ((off - minutes) / 60);
    sign += `${twoDigit(hours)}:${twoDigit(minutes)}`;
  }

  return `${getISO8601date(_when)}T${getISO8601time(_when)}${sign}`;
}

export const getHumanDate = (date: Date) : string => date.toLocaleDateString();

export const dateOrNull = (input : unknown) : Date | null => {
  if (typeof input === 'string' || typeof input === 'number') {
    const output = new Date(input);

    return (output.toString() !== 'Invalid Date')
      ? output
      : null;
  }

  return null;
};
