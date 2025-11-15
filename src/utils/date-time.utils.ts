import type { ISO8601 } from "../types/data-simple.d.ts";
import { isISO8601 } from "../types/data.type-guards.ts";

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

export const getISO8601time = (
  when : Date | number | string | null,
  noSeconds : boolean = false
) : string => {
  if (when === null) {
    return '';
  }
  const _when = (typeof when === 'number' || typeof when === 'string')
    ? new Date(when)
    : when;

  const seconds = (noSeconds === true)
    ? ''
    : `:${twoDigit(_when.getSeconds())}`;

  return `${twoDigit(_when.getHours())}:`
    + `${twoDigit(_when.getMinutes())}${seconds}`;
}

export const getLocalISO8601 = (when : number | Date | null, noSeconds : boolean = false) : string => {
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

  return `${getISO8601date(_when)}T${getISO8601time(_when, noSeconds)}${sign}`;
}

export const updateISO8601time = (
  oldTime : unknown,
  newTime : string
) : ISO8601 => (isISO8601(oldTime) === false)
    ? newTime as ISO8601
    : `${oldTime.substring(0, 11)}${newTime}:00${oldTime.substring(19)}` as ISO8601;

export const getIsoDateTimeSimple = (when : number | Date | null) : string => {
  if (when === null) {
    return '';
  }
  const _when = (typeof when === 'number')
    ? new Date(when)
    : when;

  return `${getISO8601date(_when)}T${getISO8601time(_when, true)}`;
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

export const humanDateTime = (input : ISO8601) : string => new Date(input)
  .toLocaleString()
  .replace(':00 ', ' ');

export const makeISO8601simple = (input : ISO8601) : ISO8601 => input.replace(/(?::\d{2})?(?:\.\d+)?(?:[+-]\d{2}:\d{2}|GMT[+-]\d{2}:\d{2}|GMT)$/, '');
