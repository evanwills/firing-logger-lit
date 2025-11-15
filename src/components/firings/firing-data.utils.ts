import type { FConverter, FVoidFUnc, ID, IIdObject, ISO8601 } from "../../types/data-simple.d.ts";
import {
  isID,
  isIdObject,
  isISO8601,
  isTCone,
} from "../../types/data.type-guards.ts";
import { isTFiringState, isTTemperatureState } from "../../types/firing.type-guards.ts";
import { isTFiringType } from "../../types/program.type-guards.ts";
import type { TFiringType, TProgramListRenderItem } from "../../types/programs.d.ts";
import type { TOptionValueLabel } from "../../types/renderTypes.d.ts";
import { emptyOrNull, isNumMinMax } from "../../utils/data.utils.ts";
import { getISO8601date } from "../../utils/date-time.utils.ts";
import { orderOptionsByLabel } from "../../utils/render.utils.ts";
import { isNonEmptyStr, ucFirst } from "../../utils/string.utils.ts";
import { LitRouter } from "../lit-router/lit-router.ts";

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
export const getFiringError = (
  prop: string,
  value: unknown,
  type: string = 'value',
  objType: string = 'firing',
) : string | null => {
  console.group(`validate${ucFirst(objType)}Data() error`);
  console.error(`${objType}.${prop}:`, value);
  console.groupEnd();

  return `${objType} data is invalid! It does not have a valid `
  + `\`${prop}\` ${type}.`;
}

/**
 * Validates firing data object
 *
 * @param item firing data object to be validated
 *
 * @returns Error message string if there was an issue.
 *          NULL if data is valid.
 */
export const validateFiringData = (item: unknown) : string | null => {
  if (isIdObject(item) === false) {
    // console.log('item:', item);
    // console.log('isIdObject(item):', isIdObject(item));
    return 'firing data is not an ID object';
  }

  if (isID(item.kilnID) === false) {
    return getFiringError('kilnID', item.kilnID, 'ID');
  }

  if (isID(item.programID) === false) {
    return getFiringError('programID', item.programID, 'ID');
  }

  if (isID(item.ownerID) === false
    && (emptyOrNull(item.ownerID)
    || item.ownerID !== 'unknown')
  ) {
    return getFiringError('ownerID', item.ownerID, 'ID');
  }

  if (isID(item.diaryID) === false && item.diaryID !== null) {
    // console.log('isID(item.diaryID):', isID(item.diaryID));
    // console.log('item.diaryID !== null:', item.diaryID !== null);
    // console.log('typeof item.diaryID:', typeof item.diaryID);
    return getFiringError('diaryID', item.diaryID, 'ID or Null');
  }

  if (isTFiringType(item.firingType) === false) {
    return getFiringError('firingType', item.firingType, 'Firing type');
  }

  if (isISO8601(item.scheduledStart) === false && item.scheduledStart !== null) {
    return getFiringError('scheduledStart', item.scheduledStart, 'ISO8601 or null');
  }

  if (isISO8601(item.scheduledEnd) === false && item.scheduledEnd !== null) {
    return getFiringError('scheduledEnd', item.scheduledEnd, 'ISO8601 or null');
  }
  if (isISO8601(item.scheduledCold) === false && item.scheduledCold !== null) {
    return getFiringError('scheduledCold', item.scheduledCold, 'ISO8601 or null');
  }

  if (isISO8601(item.packed) === false && item.packed !== null) {
    return getFiringError('packed', item.packed, 'ISO8601 or null');
  }

  if (isISO8601(item.actualStart) === false && item.actualStart !== null) {
    return getFiringError('actualStart', item.actualStart, 'ISO8601 or null');
  }

  if (isISO8601(item.actualEnd) === false && item.actualEnd !== null) {
    return getFiringError('actualEnd', item.actualEnd, 'ISO8601 or null');
  }

  if (isISO8601(item.actualCold) === false && item.actualCold !== null) {
    return getFiringError('actualCold', item.actualCold, 'ISO8601 or null');
  }

  if (isISO8601(item.unpacked) === false && item.unpacked !== null) {
    return getFiringError('unpacked', item.unpacked, 'ISO8601 or null');
  }

  if (typeof item.maxTemp !== 'number') {
    return getFiringError('maxTemp', item.maxTemp, 'number');
  }

  if (isTCone(item.cone) === false) {
    return getFiringError('cone', item.cone, 'TCone');
  }

  if (typeof item.active === 'boolean') {
    return getFiringError('active', item.active, 'boolean');
  }

  if (typeof item.isRetro === 'boolean') {
    return getFiringError('isRetro', item.isRetro, 'boolean');
  }

  if (isTFiringState(item.firingState) === false) {
    return getFiringError('firingState', item.firingState, 'string');
  }

  if (isTTemperatureState(item.temperatureState) === false) {
    return getFiringError('temperatureState', item.temperatureState, 'string');
  }

  return null;
};

export const validateTFiringsListItem = (item: unknown) : string | null => {
  if (isIdObject(item) === false) {
    console.log('item:', item);
    console.log('isIdObject(item):', isIdObject(item));
    return 'firing list item is not an ID object';
  }

  if (!isID(item.programID)) {
    return getFiringError('programID', item.programID, 'string', 'TFiringsListItem');
  }
  if (!isNonEmptyStr(item.programName)) {
    return getFiringError('programName', item.programName, 'string', 'TFiringsListItem');
  }
  if (!isNonEmptyStr(item.programURL)) {
    return getFiringError('programURL', item.programURL, 'string', 'TFiringsListItem');
  }
  if (!isID(item.kilnID)) {
    return getFiringError('kilnID', item.kilnID, 'string', 'TFiringsListItem');
  }
  if (!isNonEmptyStr(item.kilnName)) {
    return getFiringError('kilnName', item.kilnName, 'string', 'TFiringsListItem');
  }
  if (!isNonEmptyStr(item.kilnURL)) {
    return getFiringError('programURL', item.kilnURL, 'string', 'TFiringsListItem');
  }
  if (!isTFiringType(item.firingType)) {
    return getFiringError('firingType', item.firingType, 'string', 'TFiringsListItem');
  }
  if (!isNumMinMax(item.maxTemp, 0, 1500)) {
    return getFiringError('maxTemp', item.maxTemp, 'number', 'TFiringsListItem');
  }
  if (!isTCone(item.cone)) {
    return getFiringError('cone', item.cone, 'string', 'TFiringsListItem');
  }
  if (typeof (item.active) !== 'boolean') {
    return getFiringError('active', item.active, 'boolean', 'TFiringsListItem');
  }
  if (!isTFiringState(item.firingState)) {
    return getFiringError('firingState', item.firingState, 'string', 'TFiringsListItem');
  }
  if (!isISO8601(item.start) && item.start !== null) {
    return getFiringError('start', item.start, 'string or null', 'TFiringsListItem');
  }
  if (!isISO8601(item.end) && item.end !== null) {
    return getFiringError('end', item.end, 'string or null', 'TFiringsListItem');
  }

  return null;
};

export const firingListItemPropIsSameType = (
  oldData : IIdObject,
  newData : IIdObject,
  key: string,
) : boolean => {
  if (typeof oldData[key] === typeof newData[key]) {
    return true;
  }

  if ((key === 'start' || key === 'end')
    && oldData[key] === null
    && typeof newData[key] === 'string'
  ) {
    return true;
  }

  return false;
};

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
    .map((item : TProgramListRenderItem) : TOptionValueLabel => ({ value: item.programID, label: `${item.programName} (Cone: ${item.cone} - ${tConverter(item.maxTemp)}°${tUnit})` })),
);

export const isBeforeToday = (when : ISO8601) => {
  // console.group('isBeforeToday()');
  // console.log('when:', when);
  const now = getISO8601date(new Date());
  const _when = when.substring(0, 10)

  // console.log('now:', now);
  // console.log('_when:', _when);
  // console.log('now > _when', now > _when);
  // console.groupEnd();

  return (now > _when);
};

export const redirectToNewFiring = (component : HTMLElement, firingID : ID) : FVoidFUnc => () : void => {
  LitRouter.dispatchRouterEvent(component, `/firing/${firingID}`);
};
