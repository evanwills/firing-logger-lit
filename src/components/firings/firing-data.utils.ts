import { isID, isIdObject, isISO8601, isTCone } from "../../types/data.type-guards.ts";
import { isTFiringState, isTTemperatureState } from "../../types/firing.type-guards.ts";
import type { IFiring } from "../../types/firings.d.ts";
import { isTFiringType } from "../../types/program.type-guards.ts";

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
  value: any,
  type: string = 'value',
) : string | null => {
  console.log(`firing.${prop}:`, value);

  return `firing data is invalid! It does not have a valid `
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
