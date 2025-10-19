import { isObj } from "../utils/data.utils.ts";
import { isID, isIdObject, isISO8601, isTCone } from "./data.type-guards.ts";
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
} from "./firings.d.ts";
import { isTFiringType } from './program.type-guards.ts';

export const isTFiringLogEntryType = (value : unknown) : value is TFiringLogEntryType => (
  typeof value === 'string'
  && ['temp', 'firingState', 'damper', 'burner', 'gas', 'wood', 'responsible'].includes(value)
);
export const isTFiringState = (value : unknown) : value is TFiringState => (
  typeof value === 'string'
  && ['scheduled', 'packing', 'ready', 'active', 'complete', 'cold', 'unpacking', 'empty', 'aborted'].includes(value)
);
export const isTTemperatureState = (value : unknown) : value is TTemperatureState => (
  typeof value === 'string'
  && ['underError', 'under', 'expected', 'over', 'overError', 'n/a'].includes(value)
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
  && typeof (item as IStateLogEntry).newState === 'boolean'
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
  && isID((item as IFiring).ownerID) === true
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
  && typeof (item as IFiring).maxTemp === 'number'
  && isTCone((item as IFiring).cone) === true
  && (isISO8601((item as IFiring).actualStart) || (item as IFiring).actualStart === null)
  && (isISO8601((item as IFiring).actualEnd) || (item as IFiring).actualEnd === null)
);
