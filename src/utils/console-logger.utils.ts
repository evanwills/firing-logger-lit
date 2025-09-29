/**
 * This file contains a collection of ("pure") utility functions for
 * performing common actions that are shared across components
 */

import type { TCmethod, TKeys } from '../types/console-logger.d.ts';
import type { IKeyValue } from '../types/data-simple.d.ts';
import type FauxEvent from './FauxEvent.class.ts';
import { isBoolTrue, isNonEmptyStr, isObj } from './data.utils.ts';


/**
 * Get a 2D array of strings that where each top level item
 * represents a branch in a deep object and the leaves on that
 * branch represent a path down to the deepest level to be logged.
 *
 * @param {string[]} keys List of object keys (and possibly sub-keys)
 *
 * @returns {Array<{string[]}>} 2D array of object keys where the
 *                              first level represents a branch of
 *                              an object properties.
 */
const splitKeys = (keys : string[]) : TKeys[] => (keys as Array<string>).map(
  (key : string) : TKeys => key.split('.').map(
    (_key : string) : string => _key.trim()
  ),
);

/**
 *
 * @param {string} key
 *
 * @returns {Array<{string[]}>}
 */
const splitMultiKeys = (key : string) : TKeys[] => splitKeys(
  key.replace(/(?:^\[|\]$)/g, '')
    .split(',')
    .map((_key) => _key.trim()),
);

/**
 * Get keys in the right order based on reverse state (`rev`)
 *
 * @param {string[]} keys
 * @param {boolean} rev
 *
 * @returns {string[]}
 */
export const orderKeys = (keys : string[], rev : boolean) : string[] => { // eslint-disable-line arrow-body-style
  return (Array.isArray(keys) && rev === true)
    ? keys.reverse()
    : keys;
};

const getKeysInner = (objKeys : string[], keys : string[], includes : boolean = true) : TKeys[] => {
  const deepKeys = splitKeys(keys);
  const topKeys = deepKeys.map((key) => key[0]);

  const tmp = objKeys.filter((key) => topKeys.includes(key) === includes);

  return deepKeys.filter((key) => tmp.includes(key[0]));
};

/**
 * Get list of object property names to render in console
 *
 * > __Note:__ This function is *SUPER* for giving.
 * >           If you give it something it doesn't recognise it will
 * >           just ignore it and move on. If it can't recognise
 * >           anything, it will just return an empty array
 * >
 * > I will always return an array containging only known object
 * > property keys (or an empty array) if no keys could be matched).
 *
 * @param {object} obj  Object whose key/value pairs are to be logged
 *                      to console
 * @param {TKeys}  keys List of object property keys to be rendered
 *
 * @returns {string[]}
 */
const getKeys = (obj : IKeyValue, keys : TKeys ) : TKeys[] => {
  const objKeys = Object.keys(obj);

  if (isObj(obj)) {
    if (Array.isArray(keys) === true) {
      if (isNonEmptyStr(keys[0]) && keys[0].startsWith('!')) {
        // `keys` is an exclusion list so we're only going to return
        // property names that are not in the list of keys supplied

        // remove the NOT ("!") identifier from each key
        const _keys = keys.map((key) => key.replace(/^!/, ''));

        return getKeysInner(objKeys, _keys, false);
      }

      return getKeysInner(objKeys, keys, true);
    }

    if (isNonEmptyStr(keys) === true) {
      const _key = keys.trim();

      if (_key === '*') {
        return objKeys.map((key) => [key]);
      }

      return getKeysInner(objKeys, [keys], true);
    }
  }

  return [];
};

export const getOrderedKeys = (obj : IKeyValue, keys : TKeys, rev : boolean) => orderKeys(getKeys(obj, keys), rev);

/**
 * Log object's deep key/value pair to console
 *
 * Recursively go through an object's properties until we find the
 * deepest one we need to log, then output its full property branch
 * name and its value.
 *
 * @param {IKeyValue|function|string|number} input    Object to find deep value in
 * @param {string}     baseKey  Console log label for value
 * @param {string[]}   deepKeys List of deep keys
 *
 * @returns {void}
 */
export const logObjDeepKeyVal = (
  input : unknown,
  baseKey : string,
  deepKeys : string[],
) : void => {
  if (isObj(input) === false || deepKeys.length === 0) {
    // There's nothing more we can do,
    // so we'll just log what we've got
    if (typeof input === 'function') {
      console.log(`${baseKey}:`, input());
    } else {
      console.log(`${baseKey}:`, input);
    }
  } else {
    const _deep = [...deepKeys];
    const key0 : string = _deep.shift();

    if (key0.startsWith('[')) {
      // Looks like there are multiple sub keys at this level we need
      // to log, so we'll split them up and log each one
      const _key0 = splitMultiKeys(key0);

      for (const subKeys of _key0) {
        const subKey0 = subKeys.shift();

        logObjDeepKeyVal(input[subKey0], `${baseKey}.${subKey0}`, subKeys);
      }
    } else if (typeof input[key0] !== 'undefined') {
      // Lets see if we can go any deeper
      logObjDeepKeyVal(input[key0], `${baseKey}.${key0}`, _deep);
    }
  }
};

/**
 * Log all the key/value pairs in an object
 * (as listed in the `keys` argument)
 *
 * @param {object}          obj
 * @param {Array<string[]>} keys
 * @param {string}          extra
 * @param {boolean}         isPre
 *
 * @returns {void}
 */
export const logDeepObjProps = (
  obj : IKeyValue,
  keys : string[],
  extra : string = '',
  isPre : boolean = true,
) : void => {
  let pre = '';
  let post = '';

  if (extra !== '') {
    if (isPre === true) {
      pre = extra;
    } else {
      post = extra;
    }
  }

  if (Array.isArray(keys)) {
    for (const deepKeys of keys) {
      const key0 = deepKeys.shift();
      const propVal = obj[key0];

      if (typeof propVal !== 'undefined') {
        logObjDeepKeyVal(propVal, pre + key0 + post, deepKeys);
      } else {
        console.warn(`${key0}:`, '[undefined]');
      }
    }
  }
};

/**
 * Log input event specific event properties to console.
 *
 * @param {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement|FauxEvent} propVal
 *                         Keyboard event (or event like) object
 * @param {string} grpName Name of the parent console group event
 *                         values will be logged into
 *
 * @returns {void}
 */
const logFormEvent = (
  target : HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | FauxEvent,
  grpName : string,
) : void => {
  if (typeof target !== 'undefined'
    && (isBoolTrue((target as FauxEvent).faux) === true
      || target instanceof HTMLInputElement
      || target instanceof HTMLTextAreaElement
      || target instanceof HTMLSelectElement)
  ) {
    console.groupCollapsed(`${grpName} - form event`);
    console.log('event.target.value:', (target as HTMLInputElement).value);
    console.log('event.target.validity:', (target as HTMLInputElement).validity);

    if (typeof (target as HTMLInputElement).reportValidity === 'function') {
      console.log('event.target.checkValidity():', (target as HTMLInputElement).checkValidity());
      console.log('event.target.reportValidity():', (target as HTMLInputElement).reportValidity());
    }
    console.groupEnd();
  }
};

/**
 * Log keyboard specific event properties to console.
 *
 * @param {KeyboardEvent|FauxEvent} propVal Keyboard event (or event
 *                                  like) object
 * @param {string} grpName Name of the parent console group event
 *                                  values will be logged into
 *
 * @returns {void}
 */
const logKeyEvent = (event : KeyboardEvent|FauxEvent, grpName : string) : void => {
  if (event instanceof KeyboardEvent) {
    console.groupCollapsed(`${grpName} - keyboard event`);
    console.log('event.altKey:', event.altKey);
    console.log('event.code:', event.code);
    console.log('event.ctrlKey:', event.ctrlKey);
    console.log('event.key:', event.key);
    console.log('event.location:', event.location);
    console.log('event.metaKey:', event.metaKey);
    console.log('event.shiftKey:', event.shiftKey);
    console.log('event.getModifierState("AltGraph"):', event.getModifierState('AltGraph'));
    console.log('event.getModifierState("CapsLock"):', event.getModifierState('CapsLock'));
    console.log('event.getModifierState("NumLock"):', event.getModifierState('NumLock'));
    console.log('event.getModifierState("ScrollLock"):', event.getModifierState('ScrollLock'));
    console.groupEnd();
  }
};

/**
 * Handle outer wrapping for logging event details.
 *
 * @param {Event|FauxEvent} propVal Event (or event like) object
 * @param {string}          grpName Name of the parent console group
 *                                  event values will be logged into
 *
 * @returns {void}
 */
const logEventObjProps = (propVal : Event | FauxEvent, grpName : string) : void => {
  let extra = 'event';

  if (typeof propVal.target !== 'undefined') {
    extra = `${propVal.type} event`;
  }

  console.groupCollapsed(`${grpName} - ${extra}`);
  console.log('event.type:', propVal.type);

  if (extra !== 'event') {
    console.log('event.target:', propVal.target);

    logFormEvent(propVal.target, grpName);
  }

  logKeyEvent(propVal, grpName);
  console.groupEnd();
};

/**
 * Console log all the properties of an object (and their names)
 *
 * @param {Object}  local Object containing values to be logged
 * @param {boolean} rev   Whether or not to log the values in
 *                        reverse order
 *
 * @returns {void}
 */
export const logLocalObjProps = (
  local : IKeyValue,
  grpName : string,
  rev : boolean = false,
) : void => {
  if (isObj(local)) {
    for (const key of orderKeys(Object.keys(local), rev)) {
      const propVal = local[key];

      console.log(`${key}:`, propVal);

      if (typeof propVal !== 'undefined'
        && (propVal instanceof Event || isBoolTrue(propVal?.faux) === true)
      ) {
        logEventObjProps(propVal, grpName);
      }
    }
  }
};

/**
 * Call a console method with a given message (or list of messages)
 *
 * @param {string}          method Name of the console method to call
 * @param {string|string[]} msg    Value to pass to the console method
 */
export const consoleMsg = (method : TCmethod, msg : string | string[]) : void => {
  if (isNonEmptyStr(msg)) {
    console[method](msg);
  } else if (Array.isArray(msg)) {
    for (const str of msg) {
      console[method](str);
    }
  }
};
