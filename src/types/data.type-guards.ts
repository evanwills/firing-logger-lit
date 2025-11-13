
import type {
  IIdNameObject,
  IIdObject,
  IKeyBool,
  IKeyNum,
  IKeyStr,
  IKeyValue,
  ILinkObject,
  ISO8601,
  ISO8601Time,
  TCone,
  IOrderedEnum,
} from "./data-simple.d.ts";

/**
 * Checks if the input is a valid ID string (12 character string).
 *
 * @param id some value that may be an ID
 *
 * @returns TRUE if valid. FALSE otherwise
 */
export const isID = (id : unknown) : id is string => (typeof id === 'string' && id.length === 12);

/**
 * Checks if the input is a valid ISO8601 date-time string.
 *
 * @param input
 *
 * @returns TRUE if valid. FALSE otherwise
 */
export const isISO8601 = (input : unknown) : input is ISO8601 => (typeof input === 'string'
  && /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d{3})?)?(?:Z|[-+]\d{2}:\d{2})?)?$/i.test(input));

/**
 * Checks if the input is a valid ISO8601 time string.
 *
 * @param input
 *
 * @returns TRUE if valid. FALSE otherwise
 */
export const isTime = (input : unknown) : input is ISO8601Time => (typeof input === 'string'
  && /^\d{2}:\d{2}(?::\d{2}(?:\.\d{3})?)?$/.test(input));

/**
 * Checks if the input is a valid pyrometric cone name.
 *
 * @param input
 *
 * @returns TRUE if valid. FALSE otherwise
 */
export const isTCone = (input: unknown) : input is TCone => (typeof input === 'string'
  && /^0?[12]?\d$/.test(input));

/**
 * Checks if the input is a valid IKeyValue object.
 * (An object where every key is a string).
 *
 * @param item
 *
 * @returns TRUE if valid. FALSE otherwise
 */
export const isIkeyValue = (item : unknown) : item is IKeyValue => {
  if ((Object.prototype.toString.call(item) !== '[object Object]')) {
    return false;
  }

  return Object.keys(item as IKeyValue).every((key: unknown) => (typeof key === 'string'));
};

export const isStrNum = (input : unknown) : input is string | number => (
  typeof input === 'string' || typeof input === 'number');

export const isIKeyStr = (item : unknown) : item is IKeyStr => {
  if (isIkeyValue(item) === false) {
    return false;
  }
  for (const key of Object.keys((item as IKeyStr))) {
    if (typeof key !== 'string' || typeof (item as IKeyStr)[key] !== 'string') {
      return false;
    }
  }

  return true;
};

export const isIKeyBool = (item : unknown) : item is IKeyBool => {
  if ((Object.prototype.toString.call(item) !== '[object Object]')) {
    return false;
  }
  for (const key of Object.keys((item as IKeyBool))) {
    if (typeof key !== 'string' || typeof (item as IKeyBool)[key] !== 'boolean') {
      return false;
    }
  }

  return true;
};

export const isIKeyNum = (item : unknown) : item is IKeyNum => {
  if ((Object.prototype.toString.call(item) !== '[object Object]')) {
    return false;
  }

  for (const key of Object.keys((item as IKeyNum))) {
    if (typeof key !== 'string' || typeof (item as IKeyNum)[key] !== 'number') {
      return false;
    }
  }

  return true;
};

// export const isIdObject = (item : unknown) : item is IIdObject => {
//   console.group('isIdObject()');
//   console.log('isObj(item):', Object.prototype.toString.call(item) === '[object Object]');
//   console.log('typeof (item as IIdObject).id:', typeof (item as IIdObject).id);
//   console.log('typeof (item as IIdObject).id === "string":', typeof (item as IIdObject).id === 'string');
//   console.groupEnd();
//   return (
//     (Object.prototype.toString.call(item) !== '[object Object]')
//     && typeof (item as IIdObject).id === 'string'
//   );
// };

export const isIdObject = (item : unknown) : item is IIdObject => (
  (Object.prototype.toString.call(item) === '[object Object]')
  && typeof (item as IIdObject).id === 'string'
);

export const isIdNameObject = (item : unknown) : item is IIdNameObject => (
  isIdObject(item) && typeof (item as IIdNameObject).name === 'string'
);

export const isILinkObject = (item : unknown) : item is ILinkObject => (
  isIdNameObject(item)
  && typeof (item as ILinkObject).urlPart === 'string'
);

export const isIOrderedEnum = (item : unknown) : item is IOrderedEnum => (
  (Object.prototype.toString.call(item) === '[object Object]')
  && typeof (item as IOrderedEnum).order === 'number'
  && typeof (item as IOrderedEnum).label === 'string'
  && typeof (item as IOrderedEnum).value === 'string'
);

export const isIOrderedEnumList = (item : unknown) : item is IOrderedEnum[] => (
  Array.isArray(item)
  && item.every(isIOrderedEnum)
);
