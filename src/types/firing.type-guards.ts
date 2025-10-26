import { isObj } from '../utils/data.utils.ts';
import { isID, isIdObject, isISO8601, isTCone } from './data.type-guards.ts';
import type {
  IBurnerState,
  IDamperLogEntry,
  IFiringLogEntry,
  ITempLogEntry,
  IResponsibleLogEntry,
  IStateLogEntry,
  IFiring,
  TFiringLogEntryType,
  TTemperatureState,
  TFiringState,
  TFiringsListItem,
  TFiringActiveState,
  TGetFirningDataPayload,
} from './firings.d.ts';
import { isTFiringType } from './program.type-guards.ts';

export const isTFiringLogEntryType = (value : unknown) : value is TFiringLogEntryType => (
  typeof value === 'string'
  && new Set(['temp', 'firingState', 'issue', 'observation', 'damper', 'burner', 'gas', 'wood', 'responsible', 'schedule']).has(value)
);

// export const isTFiringState = (value : unknown) : value is TFiringState => (
//   typeof value === 'string'
//   && new Set([
//     'created',
//     'scheduled',
//     'packing',
//     'ready',
//     'cancelled',
//     'active',
//     'complete',
//     'aborted',
//     'cold',
//     'unpacking',
//     'empty',
//   ]).has(value)
// );
export const isTFiringState = (value : unknown) : value is TFiringState => {
  console.group('isTFiringState()');
  console.log('value:', value);
  console.log('typeof value === "string":', typeof value === 'string');
  const typeStrs = new Set([
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
    ]);
  console.log('typeStrs:', typeStrs);
  console.log('typeStrs.has(value):', typeStrs.has(value as string));
  console.groupEnd();
  return (
    typeof value === 'string'
    && typeStrs.has(value)
  );
};

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

export const isRespLog = (item : unknown) : item is IResponsibleLogEntry => (
  isFiringLogEntry(item) === true
  && (item as IResponsibleLogEntry).type === 'responsible'
  && typeof (item as IResponsibleLogEntry).isStart === 'boolean'
  && typeof (item as IResponsibleLogEntry).responsibilityType === 'string'
);

export const isStateChangeLog = (item : unknown) : item is IStateLogEntry => (
  isFiringLogEntry(item) === true
  && (item as IStateLogEntry).type === 'firingState'
  && typeof (item as IStateLogEntry).newState === 'string'
  && typeof (item as IStateLogEntry).oldState === 'string'
);

export const isDampertLog = (item : unknown) : item is IDamperLogEntry => (
  isFiringLogEntry(item) === true
  && (item as IDamperLogEntry).type === 'damper'
  && typeof (item as IDamperLogEntry).damperAdjustment === 'number'
);

export const isBurnerStateLog = (item : unknown) : item is IBurnerState => (
  isID((item as IBurnerState).burnerID) === true
  && typeof (item as IBurnerState).burnerPosition === 'string'
  && typeof (item as IBurnerState).burnerType === 'string'
  && typeof (item as IBurnerState).valvePosition === 'number'
  && (item as IBurnerState).valvePosition >= 0
  && (item as IBurnerState).valvePosition <= 100
  && typeof (item as IBurnerState).primaryAir === 'number'
  && (item as IBurnerState).primaryAir >= 0
  && (item as IBurnerState).primaryAir <= 100
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
