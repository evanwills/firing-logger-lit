
import type {
  IFiringLogEntry,
  ResponsibleLogEntry,
  StateChangeLogEntry,
  TemperatureLogEntry,
  TUser,
} from './data.d.ts';

export const isTempLog = (item : IFiringLogEntry) : item is TemperatureLogEntry => (
  typeof (item as TemperatureLogEntry).timeOffset === 'number'
  && typeof (item as TemperatureLogEntry).tempExpected === 'number'
  && typeof (item as TemperatureLogEntry).tempActual === 'number'
  && typeof (item as TemperatureLogEntry).state === 'string'
);

export const isRespLog = (item : IFiringLogEntry) : item is ResponsibleLogEntry => (
  typeof (item as ResponsibleLogEntry).isStart === 'boolean'
);

export const isChangeLog = (item : IFiringLogEntry) : item is StateChangeLogEntry => (
  typeof (item as StateChangeLogEntry).newState === 'boolean'
);


export const isUser = (user : TUser) : user is TUser => (
  typeof (user as TUser).adminLevel === 'number'
  && typeof (user as TUser).canFire === 'boolean'
  && typeof (user as TUser).canLog === 'boolean'
  && typeof (user as TUser).canPack === 'boolean'
  && typeof (user as TUser).canPrice === 'boolean'
  && typeof (user as TUser).canProgram === 'boolean'
  && typeof (user as TUser).canUnpack === 'boolean'
  && typeof (user as TUser).colourScheme === 'string'
  && typeof (user as TUser).email === 'string'
  && typeof (user as TUser).firstName === 'string'
  && typeof (user as TUser).id === 'string'
  && typeof (user as TUser).lastName === 'string'
  && typeof (user as TUser).notMetric === 'boolean'
  && typeof (user as TUser).phone === 'string'
  && typeof (user as TUser).preferredName === 'string'
  && typeof (user as TUser).username === 'string'
  && ['auto', 'light', 'dark'].includes((user as TUser).colourScheme)
);
