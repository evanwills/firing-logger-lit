import type { ID, IIdObject } from '../types/data-simple.d.ts';
import { isNonEmptyStr } from '../utils/string.utils.ts';
import type { CDataStoreClass } from "../types/store.d.ts";

export const saveChangeOnHold = (
  db: CDataStoreClass,
  store: string,
  userID : ID,
  changes : IIdObject,
  initial : IIdObject | null,
  mode: 'new' | 'update' | 'clone' | 'copy' | 'delete' = 'update',
) : Promise<IDBValidKey> => {
  return db.add(
    'noAuthChanges',
    {
      timestamp: Date.now(),
      store,
      userID,
      changeID: changes.id,
      mode,
      changes,
      initial,
    },
  )
};

/**
 * Get initial values for changed properties
 *
 * @param changes  User supplied changes
 * @param original Full data for object that is to be changed
 *
 * @returns Initial data object if there were no basic issue or error
 *          string if there were issues.
 */
export const getInitialData = (changes : IIdObject, original : IIdObject) : IIdObject | string => {
  const initial : IIdObject = { id: original.id };
  const nullableProps = new Set(['actualStart', 'actualEnd', 'actualCold', 'installDate', 'packed', 'unpaced']);

  for (const key of Object.keys(changes)) {
    const iType = typeof original[key];
    if (iType === 'undefined') {
      console.warn(`Update contains unknown property: "${key}"`);
      continue
    }

    if (typeof changes[key] !== iType
      && (nullableProps.has(key) === false
      || (changes[key] !== null
      && isNonEmptyStr(changes[key]) === false))
    ) {
      console.group(`Type mismatch for property: "${key}"`);
      console.error(`Update contains property: "${key}" with invalid type`);
      console.log('expected type:', iType);
      console.log('received type:', typeof changes[key]);
      console.log('original value:', original[key]);
      console.log('changed value:', changes[key]);
      console.groupEnd();
      return `Update contains property: "${key}" with invalid type`;
    }

    initial[key] = original[key];
  }

  return initial;
};
