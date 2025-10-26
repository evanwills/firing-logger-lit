import type { CDataStoreClass, IRedirectData, IRedirectDataNew } from "../types/store.d.ts";
import { isObj } from "../utils/data.utils.ts";
import { isID } from "../types/data.type-guards.ts";
import { isNonEmptyStr } from "../utils/string.utils.ts";
import type { ID } from "../types/data-simple.d.ts";

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
const getRedirectError = (
  prop: string,
  type: string = 'value',
  obj : string = 'IRedirectData',
) : string | null => `${obj} is invalid! It does not have a `
  + `valid \`${prop}\` ${type}.`;

export const validateIRedirectData = (obj : unknown) : string | null => {
  if (isObj(obj) === false) {
    return 'program is not an object';
  }

  if (isID((obj as IRedirectData).id) === false) {
    return getRedirectError('id', 'string');
  }

  if (isNonEmptyStr((obj as IRedirectData).url) === false) {
    return getRedirectError('url', 'string');
  }

  if (typeof (obj as IRedirectData).firing !== 'boolean') {
    return getRedirectError('firing', 'boolean');
  }

  if (typeof (obj as IRedirectData).kiln !== 'boolean') {
    return getRedirectError('kiln', 'boolean');
  }

  if (typeof (obj as IRedirectData).program !== 'boolean') {
    return getRedirectError('program', 'boolean');
  }

  if (typeof (obj as IRedirectData).user !== 'boolean') {
    return getRedirectError('user', 'boolean');
  }

  return null;
}

export const isIRedirectData = (obj : unknown) : obj is IRedirectData => (validateIRedirectData(obj) === null);

export const addRedirect = (
  db: CDataStoreClass,
  data : IRedirectDataNew,
) : Promise<IDBValidKey> => {
  const newData : IRedirectData = {
    firing: (data.firing === true),
    id: data.id,
    kiln: (data.kiln === true),
    program: (data.program === true),
    url: data.url,
    user: (data.user === true),
  };

  return db.add('redirects', newData);
}

export const updateRedirect = async (
  db: CDataStoreClass,
  data : IRedirectDataNew,
) : Promise<IDBValidKey> => {
  const old = await db.get('redirects', data.id);

  if (isIRedirectData(old)) {
    const newData : IRedirectData = { ...old, url: data.url };

    return db.put('redirects', newData);
  }

  return Promise.reject(`Could not replace redirect for "${data.id}"`);
}

export const supersedeProgramRedirect = async (
  db: CDataStoreClass,
  data : IRedirectDataNew,
  oldID : ID,
) : Promise<IDBValidKey> => {
  const old = await db.get('redirects', data.id);

  if (isIRedirectData(old)) {
    updateRedirect(db, { id: oldID, url: `/old-program/${oldID}`});
    return addRedirect(db, data);
  }

  return Promise.reject(`Could not replace redirect for "${data.id}"`);
}
