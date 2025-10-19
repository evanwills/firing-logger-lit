import type { IKeyStr, IKeyValue, IOrderedEnum } from '../types/data-simple.d.ts';
import { isNonEmptyStr } from "./string.utils.ts";

/**
 * This file contains a collection of "pure" function that help with
 * testing and modifying data from the server.
 *
 * Each function is exported so it can be easily unit tested.
 *
 * @file data.utils.js
 * @author Evan Wills <https://github.com/evanwills>
 */

export const arrayRemoveValue = <t>(
  arr : Array<t>,
  value : unknown
) : Array<t> => arr.filter((el) => el !== value);

/**
 * Convert empty strings (or non-strings) to NULL otherwise return
 * the string with any leading or trailing white space removed
 *
 * @param {string|null} input Value to be checked
 *
 * @returns {string|null}
 */
export const empty2null = (input : string|null) : string|null => {
  const output = (typeof input === 'string')
    ? input.trim()
    : null;

  return output !== ''
    ? output
    : null;
};

/**
 * Get a string from any input.
 * If input is a string return it unchanged.
 * If input a number convert it to string.
 * For everything else return an empty string
 *
 * @param {unknown} input Value to be forced to string
 *
 * @returns {string}
 */
export const nullStr = (input : unknown) : string => { // eslint-disable-line arrow-body-style
  if (typeof input === 'number') {
    return input.toString();
  }
  return (typeof input === 'string')
    ? input
    : '';
};

/**
 * Check whether a value is empty or null
 *
 * @param {any} input value to be tested
 *
 * @returns {boolean} TRUE if input is undefined, NULL or empty string
 */
export const emptyOrNull = (input : unknown) : boolean => (typeof input === 'undefined'
  || input === null
  || input === 0
  || (typeof input === 'string' && input.trim() === ''));

/**
 * Check whether a value is boolean and TRUE
 *
 * @param {any} input A value to be tested
 *
 * @returns {boolean} TRUE if the value is boolean and TRUE.
 *                    FALSE otherwise.
 */
export const isBoolTrue = (input : unknown) : boolean => (typeof input === 'boolean'
  && input === true);

/**
 * Check whether a value is boolean and TRUE
 *
 * @param {unknown} input A value to be tested
 *
 * @returns {boolean} TRUE if the value is boolean and TRUE.
 *                    FALSE otherwise.
 */
export const isBoolAnd = (
  input : unknown,
  val : boolean = true
) : boolean => (typeof input === 'boolean' && input === val);

export const isNum = (input : unknown) : boolean => {
  const num = (typeof input === 'string')
    ? parseFloat(input)
    : input;

  return (typeof num === 'number'
    && Number.isNaN(num) === false && Number.isFinite(num) === true);
};

/**
 * Try to force a value to be a number
 *
 * @param {unknown} input      Value to be forced to a number
 * @param {number}  _default   Default value to return if input could
 *                             not be converted into a number
 * @param {boolean} forceFloat Whether or not output should be a
 *                             float
 *
 * @returns {number|null} Number if value could be forced to a number.
 *                        NULL otherwise
 */
export const forceNum = (
  input : unknown,
  _default: number = 0,
  forceFloat : boolean = false,
) : number => {
  let output = input;

  if (typeof input === 'string') {
    output = (forceFloat === true)
      ? parseFloat(input)
      : parseInt(input, 10);
  }

  if (isNum(output) === true) {
    return (forceFloat === true)
      ? (output as number)
      : Math.round((input as number));
  }

  return _default;
};

/**
 * Check whether the input is a plain JavaScript object.
 *
 * @param {unknown} input A value that may be an object
 *
 * @returns {boolean} TRUE if the input is an object (and not NULL
 *                    and not an array).
 *                    FALSE otherwise
 */
export const isObj = (input : unknown) : boolean => (Object.prototype.toString.call(input) === '[object Object]');

export const isStrNum = (input : unknown) : boolean => {
  const t = typeof input;
  return (t === 'string' || t === 'number');
};

/**
 * Check whether a value is NULL, string, number or boolean
 *
 * @param input
 *
 * @returns {boolean} TRUE if value is null or scalar.
 */
export const isScalarOrNull = (input : unknown) : boolean => (
  input === null || ['string', 'number', 'boolean'].indexOf(typeof input) > -1
);

/**
 * Check whether a value is NULL or a string
 *
 * @param {unknown} input
 *
 * @returns {boolean} TRUE if value is null or string.
 *                    FALSE otherwise
 */
export const isStrOrNull = (input : unknown) : boolean => (input === null
  || typeof input === 'string');

const _objectsAreSameArray = (obj1 : IKeyValue, obj2 : IKeyValue) : boolean => {
  if (!Array.isArray(obj2)) {
    return false;
  }

  const l = obj1.length;

  if (l !== obj2.length) {
    return false;
  }

  for (let a = 0; a < l; a += 1) {
    // eslint-disable-next-line no-use-before-define
    if (!objectsAreSame(obj1[a], obj2[a])) {
      return false;
    }
  }

  return true;
};

const _objectsAreSameObject = (obj1 : IKeyValue, obj2 : IKeyValue) : boolean => {
  if (!isObj(obj2)) {
    return false;
  }

  for (const key of Object.keys(obj1)) {
    // eslint-disable-next-line no-use-before-define
    if (!objectsAreSame(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
};

export const isNumMinMax = (
  input : unknown,
  min : number | null = null,
  max : number | null= null,
) : boolean => (isNum(input) === true
  && (min === null || (input as number) >= min)
  && (max === null || (input as number) <= max));

/**
 * Recursively compare two objects.
 *
 * If a difference is encountered, FALSE is immediately returned.
 *
 * > __Note:__ The second object __*MUST*__must include all the
 * >           properties of the first object but can also include
 * >           any number of other properties.
 * >           Properties that are not in the first object are
 * >           ignored.
 *
 * @param {object} obj1 First object to be compared
 *                      (usually user updated values)
 * @param {object} obj2 Second object to be compared.
 *                      (usually data received from the server)
 *
 * @returns {boolean} TRUE if all properties (and their children) of
 *                    the first object have the same value in obj2.
 *                    FALSE otherwise
 * @throws {Error} If either argument are not objects
 * @throws {Error} If a property from obj1 is missing in obj2
 */
export const objectsAreSame = (obj1 : Object, obj2 : Object) : boolean => {
  // --------------------------------------------
  // START: handle scalar values

  if (isScalarOrNull(obj1)) {
    if (typeof obj1 !== typeof obj2) {
      return false;
    }
    return (obj1 === obj2);
  }

  //  END:  handle scalar values
  // --------------------------------------------
  // START: handle arrays

  if (Array.isArray(obj1)) {
    return _objectsAreSameArray(obj1, obj2);
  }

  //  END:  handle arrays
  // --------------------------------------------
  // START: handle objects

  if (isObj(obj1)) {
    return _objectsAreSameObject(obj1, obj2);
  }

  //  END:  handle objects
  // --------------------------------------------
  // START: Sad times

  throw new Error('could not compare obj1 & obj2');

  //  END:  Sad times
  // --------------------------------------------
};

export const simpleStr = (input : string) : string => {
  if (typeof input !== 'string') {
    return '';
  }

  return input.toLocaleLowerCase().replace(/[^a-z0-9]+/g, '');
};

export const calculateExpectedTemp = (
  startTemp : number,
  timeNow : number,
  startTime : number,
  rampRate : number,
) : number => Math.round(
  startTemp + (((timeNow - startTime) / (3600 * 1000)) * rampRate),
);

export const deepClone = <T>(input : T) : T => JSON.parse(JSON.stringify(input));

export const getValFromKey = (obj : IKeyValue, key : string) => {
  console.group('getValFromKey()');
  console.log('obj:', obj);
  console.log('key:', key);
  console.log(`obj[${key}]`, obj[key]);
  console.groupEnd();
  return (typeof obj[key] === 'string')
    ? obj[key]
    : '';
}

export const isValidEnumValue = (
  input : unknown,
  key: string,
  options: string[],
) : boolean => (isNonEmptyStr(input, key) === true
  && options.includes((input as IKeyStr)[key]) === true);


export const orderedEnum2enum = (input : IOrderedEnum[]) : IKeyStr => {
  const output : IKeyStr = {};
  for (const { value, label } of input) {
    output[value] = label;
  }

  return output;
};
