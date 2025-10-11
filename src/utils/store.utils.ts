import type { ID, IIdObject, IKeyValue, ILinkObject } from '../types/data-simple.d.ts';
import type { TUniqueNameItem } from '../types/data.d.ts';

const parseKeyValue = (input : string) : string => {
  if (input.includes('=') === false)  {
    return input.replace(/[^a-z\d]+/ig, '');
  }

  const tmp = input.split('=');
  tmp[0] = tmp[0].replace(/[^a-z\d]+/ig, '');
  tmp[1] = tmp[1].replace(/[^a-z\d_-]+/ig, '');

  return `.${tmp[0]}=${tmp[1]}`;
}

export const splitSlice = (input : string) : string[] => input
  .split('.')
  .map((item : string) : string => {
    const output = item.trim();

    switch(output.substring(0,1)) {
      case '#':
        return '#' + output.replace(/[^a-z\d_-]+/ig, '').substring(0, 11);

      case '@':
        // "@" is used for pagination sets
        return '@' + output.replace(/[^\d:]+/ig, '').replace(/^.*?(\d+:\d+).*?$/, '$1');;

      default:
        return parseKeyValue(output);
    }
  })
  .filter((item : string) : boolean => item !== '' );

export const getPaginationSet = <T>(input : T[], pageSet: string) : T[] => {
  if (/^@\d+:\d*$/.test(pageSet) === false) {
    throw new Error(
      'getPaginationSet() expects second param `pageSet` to be a '
      + 'page set string matching the pattern `^@\d+:\d+$`',
    );
  }

  let bits = pageSet.substring(1).split(':').map((input) => parseInt(input, 10));
  let reverse = false

  if (typeof bits[1] === 'number' && bits[1] < bits[0]) {
    reverse = true
    bits = [bits[1], bits[0]];
  }

  if (input.length >= bits[0]) {
    const output = input.slice(bits[0], bits[1]);

    if (reverse === true) {
      output.reverse();
    }

    return output;
  }

  return [];
};

export const getById = <T extends IIdObject>(input : T[], id : string) : T | null => {
  if (/^#[a-z\d_-]{10}$/i.test(id) === false) {
    throw new Error(
      'getById() expects second param `id` to be an ID string '
      + 'matching the pattern `^#[a-z\\d_-]{10}$`',
    );
  }

  const output = input.find((item) => item.id === id.substring(1));

  return (typeof output !== 'undefined')
    ? output
    : null;
};

/**
 * Get all the elements in an array that have property matching the
 * given ID
 *
 * @param input    Array of objects to be filtered
 * @param keyValue Key/Value string (prop=ID)
 *                 The string before the "=" is the property name.
 *                 The string after the "=" is the ID to be matched.
 *                 keyValue is assumed to match RegExp
 *                 `/^\^[a-z\d]+=[a-z\d_-]+$/i`
 *
 * @returns All items in the array that match key/value pair.
 */
export const getAllById = <T extends IKeyValue>(input : T[], keyValue : string) : T[] => {
  const [key, value] = keyValue.substring(1).split('=', 2);

  if (key !== '' && value !== '') {
    return input.filter(
      (item : IKeyValue) : boolean => (typeof item[key] === 'string'
        && item[key] === value),
    );
  }

  return [];
}

export const getLimitedObjList = (input : any, filter: string[]) : any => {
  if (Array.isArray(input) === false || filter.length === 0) {
    return input;
  }

  return input.map((item: IKeyValue) => {
    const output : IKeyValue = {};

    for (const key of filter) {
      if (typeof item[key] !== 'undefined') {
        output[key] = item[key];
      }
    }
    return output;
  })
}

// export const getUserPrefs = (db : CDataStoreClass) => () : IKeyValue => {
//   const prefs = db.read('UserPreferences');
//   const output : IKeyValue = {
//     colourScheme: 'auto',
//     notMetric: false,
//   }

//   return output;
// };

const getUniqueName = (input : ILinkObject) : TUniqueNameItem => ({
  name: input.name,
  urlPart: input.urlPart,
});

export const getUniqueNameList = (
  list: ILinkObject[],
  id: ID | null,
) : TUniqueNameItem[] => {
  if (list.length === 0) {
    return list;
  }

  if (id !== null) {
    list = list.filter((item : ILinkObject) => item.id !== id);
  }

  return list.map(getUniqueName);
};

export const mergeChanges = <T>(changes: IIdObject | null, oldData: T) : T => {
  const _oldData : T = { ...oldData };

  if (changes !== null) {
    for (const key of Object.keys(changes)) {
      if (typeof (_oldData as IIdObject)[key] !== 'undefined' && key !== 'id') {
        (_oldData as IIdObject)[key] = (changes as IIdObject)[key];
      }
    }
  }

  return _oldData;
}
