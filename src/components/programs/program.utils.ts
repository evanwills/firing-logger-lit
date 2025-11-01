import { html, type TemplateResult } from 'lit';
import type { IProgramStep } from '../../types/programs.d.ts';
import type { CDataStoreClass } from '../../types/store.d.ts';
import type { FConverter, ID } from '../../types/data-simple.d.ts';
import { isID, isIkeyValue, isISO8601, isTCone } from '../../types/data.type-guards.ts';
import { isNumMinMax, isObj } from '../../utils/data.utils.ts';
import { isNonEmptyStr } from '../../utils/string.utils.ts';
import { LitRouter } from '../lit-router/lit-router.ts';
import { isTFiringType } from '../../types/program.type-guards.ts';
import { durationFromStep } from '../../utils/conversions.utils.ts';

export const getProgramTypeOptions = () : string[] => {
  return [
    'bisque',
    'glaze',
    'single',
    'luster',
    'onglaze',
    'raku',
    'salt',
    'black',
  ];
};

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
const getProgramError = (
  prop: string,
  value: unknown,
  type: string = 'value',
  obj : string = 'program',
) : string | null => {
  console.log(`${obj}.${prop}:`, value);

  return `${obj} data is invalid! It does not have a valid `
  + `\`${prop}\` ${type}.`;
}

/**
 * Validates that the provided data conforms to the IProgramStep
 * interface.
 *
 * @param step Data that should conform to IProgramStep interface
 *
 * @returns Error string if data is invalid, otherwise null.
 */
export const validateProgramStep = (step: unknown) : string | null => {
  if (isObj(step) === false) {
    return 'step is not an object';
  }

  if (isNumMinMax((step as IProgramStep).order, 1, 100) === false) {
    return getProgramError('order', (step as IProgramStep).order, 'number', 'step');
  }
  const obj = `step[${(step as IProgramStep).order}]`;

  if (isNumMinMax((step as IProgramStep).endTemp, 0, 1500) === false) {
    return getProgramError('endTemp', (step as IProgramStep).endTemp, 'number', obj);
  }
  if (isNumMinMax((step as IProgramStep).rate, 0, 500) === false) {
    return getProgramError('rate', (step as IProgramStep).rate, 'number', obj);
  }
  if (isNumMinMax((step as IProgramStep).hold, 0, 1440) === false) {
    return getProgramError('hold', (step as IProgramStep).hold, 'number', obj);
  }

  return null;
};

/**
 * Validates that the provided data conforms to the IProgram interface.
 *
 * @param program Data that should conform to IProgram interface
 *
 * @returns Error string if data is invalid, otherwise null.
 */
export const validateProgramData = (program: unknown) : string | null => {
  if (!isIkeyValue(program)) {
    return 'program is not an object';
  }

  if (isID(program.id) === false) {
    return getProgramError('id', program.id, 'string');
  }

  if (isID(program.kilnID) === false) {
    return getProgramError('kilnID', program.kilnID, 'string');
  }

  if (isNumMinMax(program.controllerProgramID, 1, 100) === false) {
    return getProgramError('controllerProgramID', program.controllerProgramID, 'number');
  }

  if (isTFiringType(program.type) === false) {
    return getProgramError('type', program.type, 'string');
  }

  if (isNonEmptyStr(program, 'name') === false) {
    return getProgramError('name', program.name, 'string');
  }

  if (isNonEmptyStr(program, 'urlPart') === false) {
    return getProgramError('urlPart', program.urlPart, 'string');
  }

  if (typeof program.description !== 'string') {
    return getProgramError('description', program.description, 'string');
  }

  if (isNumMinMax(program.maxTemp, 0, 1500) === false) {
    return getProgramError('maxTemp', program.maxTemp, 'number');
  }

  if (isTCone(program.cone) === false) {
    return getProgramError('cone', program.cone, 'string');
  }

  if (isNumMinMax(program.duration, 1, 864000) === false) {
    return getProgramError('duration', program.duration, 'number');
  }

  if (isNumMinMax(program.averageRate, 0, 500) === false) {
    return getProgramError('averageRate', program.averageRate, 'number');
  }

  if (Array.isArray(program.steps) === false
    || program.steps.length === 0
  ) {
    return getProgramError('steps', program.steps, 'Array of objects');
  }

  for (const step of program.steps) {
    const tmp = validateProgramStep(step);

    if (tmp !== null) {
      console.log('step:', step);
      return tmp;
    }
  }

  if (isISO8601(program.created) === false) {
    return getProgramError('created', program.created, 'string');
  }

  if (isID(program.createdBy) === false) {
    return getProgramError('createdBy', program.createdBy, 'string');
  }

  if (isNumMinMax(program.version, 0, 1000) === false) {
    return getProgramError('version', program.version, 'number');
  }

  if (typeof program.superseded !== 'boolean') {
    return getProgramError('superseded', program.superseded, 'boolean');
  }

  if (program.supersedesID !== null && isID(program.supersedesID) === false) {
    return getProgramError('supersedesID', program.supersedesID, 'string and is not NULL');
  }

  if (program.supersededByID !== null && isID(program.supersededByID) === false) {
    return getProgramError('supersededByID', program.supersededByID, 'string and is not NULL');
  }

  if (isNumMinMax(program.useCount, 0, 10000) === false) {
    return getProgramError('useCount', program.useCount,'number');
  }

  if (typeof program.deleted !== 'boolean') {
    return getProgramError('deleted', program.deleted, 'boolean');
  }

  if (typeof program.locked !== 'boolean') {
    return getProgramError('locked', program.locked, 'boolean');
  }

  return null;
};

export const validateTProgramListRenderItem = (obj : unknown) : string | null => {
  if (!isIkeyValue(obj)) {
    return 'Input is not an object'
  }
  if (!isID(obj.programID)) {
    return getProgramError('programID', obj.programID, 'string', 'ProgramListRenderItem');
  }
  if (!isNonEmptyStr(obj.programName)) {
    return getProgramError('programName', obj.programName, 'string', 'ProgramListRenderItem');
  }
  if (!isNonEmptyStr(obj.programURL)) {
    return getProgramError('programURL', obj.programURL, 'string', 'ProgramListRenderItem');
  }
  if (!isID(obj.kilnID)) {
    return getProgramError('kilnID', obj.kilnID, 'string', 'ProgramListRenderItem');
  }
  if (!isNonEmptyStr(obj.kilnName)) {
    return getProgramError('kilnName', obj.kilnName, 'string', 'ProgramListRenderItem');
  }
  if (!isNonEmptyStr(obj.kilnURL)) {
    return getProgramError('kilnURL', obj.kilnURL, 'string', 'ProgramListRenderItem');
  }
  if (!isNonEmptyStr(obj.type)) {
    return getProgramError('kilnURL', obj.type, 'string', 'ProgramListRenderItem');
  }
  if (isNumMinMax(obj.maxTemp, 0, 1500) === false) {
    return getProgramError('maxTemp', obj.maxTemp, 'number', 'ProgramListRenderItem');
  }
  if (!isNonEmptyStr(obj.cone) && /^0?[1-3]?\d$/.test(obj.cone)) {
    return getProgramError('cone', obj.cone, 'string', 'ProgramListRenderItem');
  }
  if (isNumMinMax(obj.duration, 0, 8640000) === false) {
    return getProgramError('duration', obj.duration, 'number', 'ProgramListRenderItem');
  }
  if (typeof obj.superseded !== 'boolean') {
    return getProgramError('superseded', obj.superseded, 'boolean', 'ProgramListRenderItem');
  }
  if (typeof obj.redirect !== 'boolean') {
    return getProgramError('redirect', obj.redirect, 'boolean', 'ProgramListRenderItem');
  }

  return null;
};

export const stepsAreDifferent = (
  newStep : IProgramStep,
  oldStep : IProgramStep,
) : boolean => {
  const keys = ['order', 'endTemp', 'rate', 'hold'];

  for (const key of keys) {
    if (oldStep[key] !== newStep[key]) {
      return true;
    }
  }

  return false;
};

/**
 * Force the browser to update the URL for the current program
 *
 * @param node HTML element to use as source of event
 * @param db   Firing logger store
 * @param uid  ID of the program being redirected
 * @param mode edit mode for program
 */
export const redirectProgram = (
  node: LitRouter,
  db: CDataStoreClass,
  uid : ID,
  mode: string = '',
) : void => {
  db.dispatch('getProgramURL', uid, false).then((url: string) => {
    if (url !== '') {
      const _ext = (mode !== '' && mode.startsWith('/') === false)
        ? `/${mode}`
        : mode;

      LitRouter.dispatchRouterEvent(
        node,
        url + _ext,
        { uid },
        'rewrite',
      );
    }
  });
};

export const renderFiringSteps = (
  steps : IProgramStep[],
  converter : FConverter,
  unit : string,
) : TemplateResult => {
    return html`<table>
      <thead>
        <tr>
          <th>Step</th>
          <th>
            End Temp<br />
            <span class="unit">(°${unit})
            </span>
          </th>
          <th>
            Rate<br />
            <span class="unit">(°${unit}/hr)</span>
          </th>
          <th>
            Hold<br />
            <span class="unit">(min)</span>
          </th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>
        ${steps.map((step, i) => html`
          <tr>
            <th>${step.order}</th>
            <td>${converter(step.endTemp)}</td>
            <td>${step.rate}</td>
            <td>${step.hold}</td>
            <td>${durationFromStep(steps, i)}</td>
          </tr>
        `)}
      </tbody>
    </table>`;
};
