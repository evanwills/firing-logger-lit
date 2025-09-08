
import type {
  IFiringLogEntry,
  ResponsibleLogEntry,
  StateChangeLogEntry,
  TemperatureLogEntry,
} from "./data.d.ts";

export const isTempLog = (item : IFiringLogEntry) : item is TemperatureLogEntry => (
    typeof (item as TemperatureLogEntry).timeOffset === 'number'
    && typeof (item as TemperatureLogEntry).tempExpected === 'number'
    && typeof (item as TemperatureLogEntry).tempActual === 'number'
    && typeof (item as TemperatureLogEntry).state === 'string')

export const isRespLog = (item : IFiringLogEntry) : item is ResponsibleLogEntry => (
  typeof (item as ResponsibleLogEntry).isStart === 'boolean');

export const isChangeLog = (item : IFiringLogEntry) : item is StateChangeLogEntry => (
  typeof (item as StateChangeLogEntry).newState === 'boolean');
