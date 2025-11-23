import { isObj } from '../utils/data.utils.ts';
import { isID, isIdObject, isISO8601, isTCone } from './data.type-guards.ts';
import type {
  IFiring,
  TTemperatureState,
  TFiringState,
  TFiringsListItem,
  TFiringActiveState,
  TGetFirningDataPayload,
} from './firings.d.ts';
import type {
  IBurnerStateLogEntry,
  IDamperLogEntry,
  IFiringLogEntry,
  ITempLogEntry,
  IResponsibleLogEntry,
  IStateLogEntry,
  TFiringLogEntryType,
  IScheduleLogEntry,
} from './firing-logs.d.ts';
import { isTFiringType } from './program.type-guards.ts';

export const isTFiringLogEntryType = (value : unknown) : value is TFiringLogEntryType => (
  typeof value === 'string'
  && new Set([
    'burner',
    'damper',
    'firingState',
    'gas',
    'issue',
    'observation',
    'responsible',
    'schedule',
    'stage',
    'temp',
    'wood',
  ]).has(value)
);

export const isTFiringState = (value : unknown) : value is TFiringState => (
  typeof value === 'string'
  && new Set([
    'created',
    'scheduled',
    'packing',
    'ready',
    'cancelled',
    'active',
    'complete',
    'aborted',
    'cold',
    'unpacking',
    'empty',
  ]).has(value)
);

export const isTFiringActiveState = (value : unknown) : value is TFiringActiveState => (
  typeof value === 'string' && new Set(['normal', 'cancelled', 'aborted']).has(value)
);

export const isTTemperatureState = (value : unknown) : value is TTemperatureState => (
  typeof value === 'string'
  && new Set(['underError', 'under', 'expected', 'over', 'overError', 'n/a']).has(value)
);

export const isFiringLogEntry = (item: unknown) : item is IFiringLogEntry => (
  isObj(item) === true
  && isID((item as IFiringLogEntry).id) === true
  && isID((item as IFiringLogEntry).firingID) === true
  && isID((item as IFiringLogEntry).userID) === true
  && (isID((item as IFiringLogEntry).supersededByID) === true
  || (item as IFiringLogEntry).supersededByID === null)
  && isISO8601((item as IFiringLogEntry).createdTime) === true
  && isISO8601((item as IFiringLogEntry).time) === true
  && isTFiringLogEntryType((item as IFiringLogEntry).type)
  && (typeof (item as IFiringLogEntry).notes === 'string'
  || (item as IFiringLogEntry).notes === null)
);

export const isTempLog = (item : unknown) : item is ITempLogEntry => (
  isFiringLogEntry(item) === true
  && (item as IFiringLogEntry).type === 'temp'
  && typeof (item as ITempLogEntry).timeOffset === 'number'
  && typeof (item as ITempLogEntry).tempExpected === 'number'
  && typeof (item as ITempLogEntry).tempActual === 'number'
  && typeof (item as ITempLogEntry).state === 'string'
);

export const isSchedulepLog = (item : unknown) : item is IScheduleLogEntry => (
  isFiringLogEntry(item) === true
  && isISO8601((item as IScheduleLogEntry).newStart) === true
  && isISO8601((item as IScheduleLogEntry).oldStart) === true
);

export const isRespLog = (item : unknown) : item is IResponsibleLogEntry => (
  isFiringLogEntry(item) === true
  && (item as IResponsibleLogEntry).type === 'responsible'
  && typeof (item as IResponsibleLogEntry).isStart === 'boolean'
  && typeof (item as IResponsibleLogEntry).responsibilityType === 'string'
);

export const isStateChangeLog = (item : unknown) : item is IStateLogEntry => (
  isFiringLogEntry(item) === true
  && (item as IStateLogEntry).type === 'firingState'
  && typeof (item as IStateLogEntry).current === 'string'
  && typeof (item as IStateLogEntry).previous === 'string'
);

export const isDampertLog = (item : unknown) : item is IDamperLogEntry => (
  isFiringLogEntry(item) === true
  && (item as IDamperLogEntry).type === 'damper'
  && typeof (item as IDamperLogEntry).damperAdjustment === 'number'
);

export const isBurnerStateLog = (item : unknown) : item is IBurnerStateLogEntry => (
  isID((item as IBurnerStateLogEntry).burnerID) === true
  && typeof (item as IBurnerStateLogEntry).burnerPosition === 'string'
  && typeof (item as IBurnerStateLogEntry).burnerType === 'string'
  && typeof (item as IBurnerStateLogEntry).valvePosition === 'number'
  && (item as IBurnerStateLogEntry).valvePosition >= 0
  && (item as IBurnerStateLogEntry).valvePosition <= 100
  && typeof (item as IBurnerStateLogEntry).primaryAir === 'number'
  && (item as IBurnerStateLogEntry).primaryAir >= 0
  && (item as IBurnerStateLogEntry).primaryAir <= 100
);

export const isIFiring = (item: unknown) : item is IFiring => (
  isIdObject(item)
  && isID((item as IFiring).kilnID) === true
  && isID((item as IFiring).programID) === true
  && (isID((item as IFiring).ownerID) === true
  || (item as IFiring).ownerID === 'unknown')
  && (isID((item as IFiring).diaryID) === true || (item as IFiring).diaryID === null)
  && isTFiringType((item as IFiring).firingType) === true
  && (isISO8601((item as IFiring).scheduledStart) || (item as IFiring).scheduledStart === null)
  && (isISO8601((item as IFiring).scheduledEnd) || (item as IFiring).scheduledEnd === null)
  && (isISO8601((item as IFiring).scheduledCold) || (item as IFiring).scheduledCold === null)
  && (isISO8601((item as IFiring).packed) || (item as IFiring).packed === null)
  && (isISO8601((item as IFiring).actualStart) || (item as IFiring).actualStart === null)
  && (isISO8601((item as IFiring).actualEnd) || (item as IFiring).actualEnd === null)
  && (isISO8601((item as IFiring).actualCold) || (item as IFiring).actualCold === null)
  && (isISO8601((item as IFiring).unpacked) || (item as IFiring).unpacked === null)
  && typeof (item as IFiring).maxTemp === 'number'
  && isTCone((item as IFiring).cone) === true
  && typeof (item as IFiring).active === 'boolean'
  && typeof (item as IFiring).isRetro === 'boolean'
  && isTFiringState((item as IFiring).firingState) === true
  && isTFiringActiveState((item as IFiring).firingActiveState) === true
  && isTTemperatureState((item as IFiring).temperatureState) === true
);

export const isTFiringsListItem = (item : unknown) : item is TFiringsListItem => (
  isIdObject(item)
  && isID((item as TFiringsListItem).programID) === true
  && typeof (item as TFiringsListItem).programName === 'string'
  && typeof (item as TFiringsListItem).programURL === 'string'
  && isID((item as TFiringsListItem).kilnID) === true
  && typeof (item as TFiringsListItem).kilnName === 'string'
  && typeof (item as TFiringsListItem).kilnURL === 'string'
  && isTFiringType((item as TFiringsListItem).firingType) === true
  && typeof (item as TFiringsListItem).maxTemp === 'number'
  && isTCone((item as TFiringsListItem).cone) === true
  && (isISO8601((item as TFiringsListItem).start) || (item as TFiringsListItem).start === null)
  && (isISO8601((item as TFiringsListItem).end) || (item as TFiringsListItem).end === null)
);

export const isTGetFirningDataPayload = (item : unknown) : item is TGetFirningDataPayload => (
  (item as TGetFirningDataPayload).firing instanceof Promise
  && (item as TGetFirningDataPayload).kiln instanceof Promise
  && (item as TGetFirningDataPayload).program instanceof Promise
  && (item as TGetFirningDataPayload).firingStates instanceof Promise
  && (item as TGetFirningDataPayload).firingTypes instanceof Promise
  && (item as TGetFirningDataPayload).firingTypes instanceof Promise
  && (item as TGetFirningDataPayload).temperatureStates instanceof Promise
  && typeof (item as TGetFirningDataPayload).ownerName === 'string');
