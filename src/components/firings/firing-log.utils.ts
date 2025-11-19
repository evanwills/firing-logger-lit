import type { TSvgPathItem } from '../../types/data.d.ts';
import type { ID, ISO8601 } from '../../types/data-simple.d.ts';
import {
  isID,
  isIdObject,
  isISO8601,
} from '../../types/data.type-guards.ts';
import {
  isFiringLogEntry,
  isTFiringLogEntryType,
  isTFiringState,
 } from '../../types/firing.type-guards.ts';
import type {
  IFiringLogEntry,
  INewFiringStateLogEntryOptions,
  INewLogEntryOptions,
  INewTempLogEntryOptions,
  INewScheduleLogEntryOptions,
  IStateLogEntry,
  ITempLogEntry,
  IScheduleLogEntry,
  TFiringLogEntryType,
} from '../../types/firing-logs.d.ts';
import { getUID } from '../../utils/data.utils.ts';
import { getLocalISO8601 } from '../../utils/date-time.utils.ts';
import { isNonEmptyStr } from '../../utils/string.utils.ts';
import { getFiringError } from './firing-data.utils.ts';


export const validateFiringLogEntry = (item: unknown) : string | null => {
  if (isIdObject(item) === false) {
    console.log('item:', item);
    console.log('isFiringLogEntry(item):', isFiringLogEntry(item));
    return 'firing temp log data is not a firing log entry object';
  }

  if (isID(item.id) === false) {
    return getFiringError('id', item.id, 'string', 'IFiringLogEntry');
  }
  if (isID(item.firingID) === false) {
    return getFiringError('firingID', item.firingID, 'string', 'IFiringLogEntry');
  }
  if (isID(item.userID) === false) {
    return getFiringError('userID', item.userID, 'string', 'IFiringLogEntry');
  }
  if (isISO8601(item.time) === false) {
    return getFiringError('time', item.time, 'string', 'IFiringLogEntry');
  }
  if (isISO8601(item.createdTime) === false && item.createdTime !== null) {
    return getFiringError('createdTime', item.createdTime, 'string or null', 'IFiringLogEntry');
  }
  if (isID(item.supersededByID) === false && item.supersededByID !== null) {
    return getFiringError('supersededByID', item.time, 'string or null', 'IFiringLogEntry');
  }
  if (isTFiringLogEntryType(item.type) === false) {
    return getFiringError('type', item.type, 'string', 'IFiringLogEntry');
  }
  if (typeof item.notes !== 'string' &&  item.notes !== null) {
    return getFiringError('notes', item.notes, 'string or null', 'IFiringLogEntry');
  }

  return null;
};

export const validateTempLogEntry = (item: unknown) : string | null => {
  const tmp = validateFiringLogEntry(item);

  if (tmp !== null) {
    return tmp;
  }
  if ((item as ITempLogEntry).type !== 'temp') {
    return getFiringError('type', (item as ITempLogEntry).type, 'string', 'ITempLogEntry');
  }
  if (typeof (item as ITempLogEntry).timeOffset !== 'number') {
    return getFiringError('timeOffset', (item as ITempLogEntry).timeOffset, 'number', 'ITempLogEntry');
  }
  if (typeof (item as ITempLogEntry).tempExpected !== 'number') {
    return getFiringError('tempExpected', (item as ITempLogEntry).tempExpected, 'number', 'ITempLogEntry');
  }
  if (typeof (item as ITempLogEntry).tempActual !== 'number') {
    return getFiringError('tempActual', (item as ITempLogEntry).tempActual, 'number', 'ITempLogEntry');
  }
  if (typeof (item as ITempLogEntry).state !== 'string') {
    return getFiringError('state', (item as ITempLogEntry).state, 'string', 'ITempLogEntry');
  }

  return null;
}

export const validateStateLogEntry = (item: unknown) : string | null => {
  const tmp = validateFiringLogEntry(item);

  if (tmp !== null) {
    return tmp;
  }
  if ((item as IStateLogEntry).type !== 'firingState') {
    return getFiringError('type', (item as IStateLogEntry).type, 'string', 'IStateLogEntry');
  }
  if (isTFiringState((item as IStateLogEntry).current) === false) {
    return getFiringError('current', (item as IStateLogEntry).current, 'string', 'IStateLogEntry');
  }
  if (isTFiringState((item as IStateLogEntry).previous) === false) {
    return getFiringError('tempExpected', (item as IStateLogEntry).previous, 'string', 'IStateLogEntry');
  }

  return null;
};

export const tempLog2SvgPathItem = (item : ITempLogEntry) : TSvgPathItem => ({
  timeOffset: item.timeOffset,
  actualTime: item.time,
  temp: item.tempActual,
});

export const getLastLogEntry = (log : IFiringLogEntry[]) : IFiringLogEntry | null => {
  const output = log.slice(-1);

  return (output[0] !== undefined)
    ? output[0]
    : null;
};

export const sortLogByTime = <T extends IFiringLogEntry>(log : T[], reverse : boolean = false) : T[] => {
  const output = [...log];

  let less = -1;
  let more = 1;

  if (reverse === true) {
    less = 1;
    more = -1;
  }

  output.sort((a : IFiringLogEntry, b : IFiringLogEntry) : number => {
    if (a.time < b.time) {
      return less;
    }

    if (a.time > b.time) {
      return more;
    }

    return 0;
  });

  return output;
};

/**
 * Creates a new firing log entry object
 *
 * @param firingID
 * @param userID
 * @param param2
 *
 * @returns New firing log entry object
 */
export const getNewLogEntry = (
  firingID: ID,
  userID: ID,
  actualStart : ISO8601 | null,
  { type, notes, time, createdTime } : INewLogEntryOptions,
) : IFiringLogEntry => {
  // console.group('getNewLogEntry()');
  // console.log('firingID:', firingID);
  // console.log('userID:', userID);
  // console.log('actualStart:', actualStart);
  // console.log('options:', { type, notes, time, createdTime });
  // console.groupEnd();
  const _time = (isISO8601(time) === true)
      ? time
      : getLocalISO8601(null);

  const timeOffset = (isISO8601(actualStart))
    ? Math.round((new Date(_time).getTime() - new Date(actualStart).getTime()) / 1000)
    : null;

  return {
    id: getUID(),
    firingID,
    userID,
    createdTime: (isISO8601(createdTime) === true)
      ? createdTime
      : getLocalISO8601(Date.now()),
    supersededByID: null,
    time: _time,
    timeOffset,

    type : (isTFiringLogEntryType(type))
      ? type
      : 'temp',
    notes : isNonEmptyStr(notes)
      ? notes
      : null,
  };
};

export const getStatusLogEntry = (
  firingID: ID,
  userID: ID,
  actualStart : ISO8601 | null,
  options : INewFiringStateLogEntryOptions,
) : IStateLogEntry => ({
    ...getNewLogEntry(
      firingID,
      userID,
      actualStart,
      {
        ...options,
        type: 'firingState',
      },
    ),
    previous: options.previous,
    current: options.current,
  } as IStateLogEntry);

export const getTempLogEntry = (
  firingID: ID,
  userID: ID,
  actualStart : ISO8601 | null,
  options : INewTempLogEntryOptions,
) : ITempLogEntry => ({
    ...getNewLogEntry(
      firingID,
      userID,
      actualStart,
      {
        ...options,
        type: 'temp',
      },
    ),
    tempExpected: options.tempExpected,
    tempActual: options.tempActual,
    state: options.state,
  } as ITempLogEntry);

export const getScheduleLogEntry = (
  firingID: ID,
  userID: ID,
  options : INewScheduleLogEntryOptions,
) : IScheduleLogEntry => ({
  ...getNewLogEntry(
    firingID,
    userID,
    null,
    {
      ...options,
      type: 'schedule',
      time: getLocalISO8601(null),
    },
  ),
  current: options.current,
  previous: options.previous,
} as IScheduleLogEntry);

export const getModalBtnText = (type: TFiringLogEntryType | '') : string => {
  switch (type) {
    case 'temp':
      return 'Log temperature';
    case 'firingState':
      return 'Update Firing State';
    case 'schedule':
      return 'Reschedule Firing';
    case 'responsible':
      return 'Update responsibility';
    default:
      return 'Add Log Entry';
  }
}
