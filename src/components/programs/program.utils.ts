import type { IFiringStep, IProgram } from '../../types/programs.d.ts';
import type { CDataStoreClass } from '../../types/store.d.ts';
import type { ID } from '../../types/data-simple.d.ts';
import { isID } from '../../types/data.type-guards.ts';
import { isNumMinMax, isObj } from '../../utils/data.utils.ts';
import { isNonEmptyStr } from '../../utils/string.utils.ts';
import { LitRouter } from '../lit-router/lit-router.ts';

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
  type: string = 'value',
  obj : string = 'program',
) : string | null => `${obj} data is invalid! It does not have a `
  + `valid \`${prop}\` ${type}.`;

/**
 * Validates that the provided data conforms to the IFiringStep
 * interface.
 *
 * @param step Data that should conform to IFiringStep interface
 *
 * @returns Error string if data is invalid, otherwise null.
 */
export const validateProgramStep = (step: unknown) : string | null => {
  if (isObj(step) === false) {
    return 'step is not an object';
  }

  if (isNumMinMax((step as IFiringStep).order, 1, 100) === false) {
    return getProgramError('order', 'number', 'step');
  }
  const obj = `step[${(step as IFiringStep).order}]`;

  if (isNumMinMax((step as IFiringStep).endTemp, 0, 1500) === false) {
    return getProgramError('endTemp', 'number', obj);
  }
  if (isNumMinMax((step as IFiringStep).rate, 0, 500) === false) {
    return getProgramError('rate', 'number', obj);
  }
  if (isNumMinMax((step as IFiringStep).hold, 0, 1440) === false) {
    return getProgramError('hold', 'number', obj);
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
  if (Object.prototype.toString.call(program) !== '[object Object]') {
    return 'program is not an object';
  }

  if (isID((program as IProgram).id) === false) {
    return getProgramError('id', 'string');
  }

  if (isID((program as IProgram).kilnID) === false) {
    return getProgramError('kilnID',' string');
  }

  if (isNumMinMax((program as IProgram).controllerProgramID, 1, 100) === false) {
    return getProgramError('controllerProgramID', 'number');
  }

  if (isNonEmptyStr(program, 'type') === false
    || getProgramTypeOptions().includes((program as IProgram).type) === false
  ) {
    return getProgramError('type','string');
  }

  if (isNonEmptyStr(program, 'name') === false) {
    return getProgramError('name',' string');
  }

  if (isNonEmptyStr(program, 'urlPart') === false) {
    return getProgramError('urlPart', 'string');
  }

  if (isNonEmptyStr(program, 'description') === false) {
    return getProgramError('description',' string');
  }

  if (isNumMinMax((program as IProgram).maxTemp, 0, 1500) === false) {
    return getProgramError('maxTemp', 'number');
  }

  if (isNonEmptyStr(program, 'cone') === false) {
    return getProgramError('cone', 'string');
  }

  if (isNumMinMax((program as IProgram).duration, 1, 864000) === false) {
    return getProgramError('duration', 'number');
  }

  if (isNumMinMax((program as IProgram).averageRate, 0, 500) === false) {
    return getProgramError('averageRate', 'number');
  }

  if (Array.isArray((program as IProgram).steps) === false
    || (program as IProgram).steps.length === 0
  ) {
    return getProgramError('steps', 'Array of objects');
  }

  for (const step of (program as IProgram).steps) {
    const tmp = validateProgramStep(step);

    if (tmp !== null) {
      return tmp;
    }
  }

  if (isNonEmptyStr(program, 'created') === false) {
    return getProgramError('created', 'string');
  }

  if (isID((program as IProgram).createdBy) === false) {
    return getProgramError('createdBy', 'string');
  }

  if (isNumMinMax((program as IProgram).version, 0, 1000) === false) {
    return getProgramError('version', 'number');
  }

  if (typeof (program as IProgram).superseded !== 'boolean') {
    return getProgramError('superseded', 'boolean');
  }

  if ((program as IProgram).supersedesID !== null && isID((program as IProgram).supersedesID) === false) {
    return getProgramError('supersedesID', 'string and is not NULL');
  }

  if ((program as IProgram).supersededByID !== null && isID((program as IProgram).supersededByID) === false) {
    return getProgramError('supersededByID', 'string and is not NULL');
  }

  if (isNumMinMax((program as IProgram).useCount, 0, 10000) === false) {
    return getProgramError('useCount', 'number');
  }

  if (typeof (program as IProgram).deleted !== 'boolean') {
    return getProgramError('deleted', 'boolean');
  }

  if (typeof (program as IProgram).locked !== 'boolean') {
    return getProgramError('locked', 'boolean');
  }

  return null;
};

export const stepsAreDifferent = (
  newStep : IFiringStep,
  oldStep : IFiringStep,
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
