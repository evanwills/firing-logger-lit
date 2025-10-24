import type { FConverter, ID } from "../../types/data-simple.d.ts";
import type { TSvgPathItem } from "../../types/data.d.ts";
import { isID, isIdObject, isISO8601, isTCone } from "../../types/data.type-guards.ts";
import { isFiringLogEntry, isTFiringLogEntryType, isTFiringState, isTTemperatureState } from "../../types/firing.type-guards.ts";
import type { IFiring, IFiringLogEntry, ITempLogEntry } from "../../types/firings.d.ts";
import { isTFiringType } from "../../types/program.type-guards.ts";
import type { TFiringType, TProgramListRenderItem } from "../../types/programs.d.ts";
import type { TOptionValueLabel } from "../../types/renderTypes.d.ts";
import { isObj } from "../../utils/data.utils.ts";
import { orderOptionsByLabel } from "../../utils/render.utils.ts";

/**
 * Generates a standard error message for invalid program (or program
 * step) data properties.
 *
 * @param prop Program property that is invalid
 * @param type Type of property (string, number, etc)
 * @param obj Object that has the property (program, step, etc)
 *
 * @returns Human readable error message
 */
const getFiringError = (
  prop: string,
  value: unknown,
  type: string = 'value',
  objType: string = 'firing',
) : string | null => {
  console.log(`firing.${prop}:`, value);

  return `${objType} data is invalid! It does not have a valid `
  + `\`${prop}\` ${type}.`;
}

export const validateFiringData = (item: unknown) : string | null => {
  if (isIdObject(item) === false) {
    console.log('item:', item);
    console.log('isIdObject(item):', isIdObject(item));
    return 'firing data is not an ID object';
  }

  if (isID((item as IFiring).kilnID) === false) {
    return getFiringError('kilnID', (item as IFiring).kilnID, 'ID');
  }

  if (isID((item as IFiring).programID) === false) {
    return getFiringError('programID', (item as IFiring).programID, 'ID');
  }

  if (isID((item as IFiring).ownerID) === false) {
    return getFiringError('ownerID', (item as IFiring).ownerID, 'ID');
  }

  if (isID((item as IFiring).diaryID) === false && (item as IFiring).diaryID !== null) {
    return getFiringError('ownerID', (item as IFiring).ownerID, 'ID or Null');

  }
  if (isTFiringType((item as IFiring).firingType) === false) {
    return getFiringError('firingType', (item as IFiring).firingType, 'Firing type');
  }

  if (isISO8601((item as IFiring).scheduledStart) === false && (item as IFiring).scheduledStart !== null) {
    return getFiringError('scheduledStart', (item as IFiring).scheduledStart, 'ISO8601 or null');
  }

  if (isISO8601((item as IFiring).scheduledEnd) === false && (item as IFiring).scheduledEnd !== null) {
    return getFiringError('scheduledEnd', (item as IFiring).scheduledEnd, 'ISO8601 or null');
  }
  if (isISO8601((item as IFiring).scheduledCold) === false && (item as IFiring).scheduledCold !== null) {
    return getFiringError('scheduledCold', (item as IFiring).scheduledCold, 'ISO8601 or null');
  }

  if (isISO8601((item as IFiring).packed) === false && (item as IFiring).packed !== null) {
    return getFiringError('packed', (item as IFiring).packed, 'ISO8601 or null');
  }

  if (isISO8601((item as IFiring).actualStart) === false && (item as IFiring).actualStart !== null) {
    return getFiringError('actualStart', (item as IFiring).actualStart, 'ISO8601 or null');
  }

  if (isISO8601((item as IFiring).actualEnd) === false && (item as IFiring).actualEnd !== null) {
    return getFiringError('actualEnd', (item as IFiring).actualEnd, 'ISO8601 or null');
  }

  if (isISO8601((item as IFiring).actualCold) === false && (item as IFiring).actualCold !== null) {
    return getFiringError('actualCold', (item as IFiring).actualCold, 'ISO8601 or null');
  }

  if (isISO8601((item as IFiring).unpacked) === false && (item as IFiring).unpacked !== null) {
    return getFiringError('unpacked', (item as IFiring).unpacked, 'ISO8601 or null');
  }

  if (typeof (item as IFiring).maxTemp !== 'number') {
    return getFiringError('maxTemp', (item as IFiring).maxTemp, 'number');
  }

  if (isTCone((item as IFiring).cone) === false) {
    return getFiringError('cone', (item as IFiring).cone, 'TCone');
  }

  if (isTFiringState((item as IFiring).firingState) === false) {
    return getFiringError('firingState', (item as IFiring).firingState, 'string');
  }

  if (isTTemperatureState((item as IFiring).temperatureState) === false) {
    return getFiringError('temperatureState', (item as IFiring).temperatureState, 'string');
  }

  return null;
};

export const validateFiringLogEntry = (item: unknown) : string | null => {
  if (isObj(item) === false) {
    console.log('item:', item);
    console.log('isFiringLogEntry(item):', isFiringLogEntry(item));
    return 'firing temp log data is not a firing log entry object';
  }

  if (isID((item as IFiringLogEntry).id) === false) {
    return getFiringError('id', (item as IFiringLogEntry).id, 'string', 'IFiringLogEntry');
  }
  if (isID((item as IFiringLogEntry).firingID) === false) {
    return getFiringError('firingID', (item as IFiringLogEntry).firingID, 'string', 'IFiringLogEntry');
  }
  if (isID((item as IFiringLogEntry).userID) === false) {
    return getFiringError('userID', (item as IFiringLogEntry).userID, 'string', 'IFiringLogEntry');
  }
  if (isISO8601((item as IFiringLogEntry).time) === false) {
    return getFiringError('time', (item as IFiringLogEntry).time, 'string', 'IFiringLogEntry');
  }
  if (isTFiringLogEntryType((item as IFiringLogEntry).type) === false) {
    return getFiringError('type', (item as IFiringLogEntry).type, 'string', 'IFiringLogEntry');
  }
  if (typeof (item as IFiringLogEntry).notes !== 'string' &&  (item as IFiringLogEntry).notes !== null) {
    return getFiringError('notes', (item as IFiringLogEntry).notes, 'string or null', 'IFiringLogEntry');
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

export const tempLog2SvgPathItem = (item : ITempLogEntry) : TSvgPathItem => ({
  timeOffset: item.timeOffset,
  actualTime: item.time,
  temp: item.tempActual,
});

export const getKilnsByFiringType = (
  list : TProgramListRenderItem[],
  type : TFiringType | null,
) : TOptionValueLabel[] => {
  const tmp = list.filter((item : TProgramListRenderItem) : boolean => item.type === type)
    .map((item : TProgramListRenderItem) : TOptionValueLabel => ({ value: item.kilnID, label: item.kilnName}));

  const output = [];
  const ids : Set<string> = new Set();

  for (const item of tmp) {
    if (ids.has(item.value) === false) {
      ids.add(item.value);
      output.push(item);
    }
  }

  return orderOptionsByLabel(output);
};

export const getProgramsByTypeAndKiln = (
  list : TProgramListRenderItem[],
  type : TFiringType | null,
  kilnID : ID | null,
  tConverter : FConverter,
  tUnit : string,
) : TOptionValueLabel[] => orderOptionsByLabel(
  list.filter((item : TProgramListRenderItem) : boolean => (item.type === type && item.kilnID === kilnID))
    .map((item : TProgramListRenderItem) : TOptionValueLabel => ({ value: item.programID, label: `${item.programName} (Cone: ${item.cone} - ${tConverter(item.maxTemp)}°${tUnit}})` })),
);
