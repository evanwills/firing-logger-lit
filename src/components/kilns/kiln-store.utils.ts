import type { IDBPDatabase } from 'idb';
import type { ID, IIdObject } from '../../types/data-simple.d.ts';
import type { IKiln, TGetKilnDataPayload } from '../../types/kilns.d.ts';
import type { TUserNowLaterAuth } from '../../types/users.d.ts';
import type { CDataStoreClass, FActionHandler } from '../../types/store.d.ts';
import type { PKilnDetails, TKilnDetails } from '../../types/kilns.d.ts';
import { isKiln } from '../../types/kiln.type-guards.ts';
import { isCDataStoreClass } from "../../types/store.type-guards.ts";
import { userCanNowLater } from '../users/user-data.utils.ts';
import { isNonEmptyStr } from '../../utils/string.utils.ts';
import { getUniqueNameList, mergeChanges } from '../../utils/store.utils.ts';
import { getInitialData, saveChangeOnHold } from '../../store/save-data.utils.ts';
import { validateKilnData } from './kiln-data.utils.ts';
import type { TUniqueNameItem } from "../../types/data.d.ts";

const saveKilnChanges = async (
  db: IDBPDatabase,
  _userID : string,
  changes : IIdObject | null,
  kiln : IKiln,
) : Promise<IDBValidKey> => {
  const _kiln : IIdObject = mergeChanges(changes, kiln);

  const kilnError = validateKilnData(_kiln);

  if (kilnError !== null) {
    return Promise.reject(kilnError);
  }

  const method = changes === null ? 'add' : 'put';

  try {
    return await db[method]('kilns', _kiln);
  } catch (error) {
    console.group('saveKilnChanges()');
    console.log('_userID:', _userID);
    console.log('changes:', changes);
    console.log('kiln:', kiln);
    console.log('_kiln:', _kiln);
    console.error('Failed to save kiln data:', error);
    console.groupEnd();
    return Promise.reject(error);
  }
};

/**
 * Add a new kiln object to the database
 *
 * @param db
 * @param newKiln
 * @returns
 */
export const addNewKilnData : FActionHandler = async (
  db: IDBPDatabase | CDataStoreClass,
  newKiln : IKiln,
) : Promise<IDBValidKey> => {
  if (isCDataStoreClass(db)) {
    throw new Error(
      'addNewKilnData() expects first param `db` to be a '
      + 'IDBPDatabase type object',
    );
  }

  const { user, hold, msg } : TUserNowLaterAuth = await userCanNowLater(db);

  if (msg !== '') {
    return Promise.reject(`${msg} add new kiln details`);
  }

  if (user === null) {
    // This should never happen because `msg` will contain an error
    // message if user is null
    throw new Error('Cannot proceed because user is null');
  }

  return (hold === true)
    ? saveChangeOnHold(db, 'kilns', user.id, newKiln, null)
    : saveKilnChanges(db, user.id, null, newKiln);
};

/**
 *
 * @param db
 * @param changes
 * @returns
 */
export const updateKilnData : FActionHandler = async (
  db: IDBPDatabase | CDataStoreClass,
  changes : IIdObject,
) : Promise<IDBValidKey> => {
  if (isCDataStoreClass(db)) {
    throw new Error(
      'updateKilnData() expects first param `db` to be a '
      + 'IDBPDatabase type object',
    );
  }

  const { user, hold, msg } : TUserNowLaterAuth = await userCanNowLater(db);

  if (msg !== '') {
    return Promise.reject(`${msg} update kiln details`);
  }

  if (user === null) {
    // This should never happen because `msg` will contain an error
    // message if user is null
    throw new Error('Cannot proceed because user is null');
  }

  const kiln = await db.get('kilns', changes.id);

  if (!isKiln(kiln)) {
    return Promise.reject(`Could not find kiln matching "${changes.id}"`);
  }

  const initial : IIdObject | string = getInitialData(changes, kiln);

  if (typeof initial === 'string') {
    return Promise.reject(initial);
  }

  return  (hold === true)
    ? saveChangeOnHold(db, 'kilns', user.id, changes, initial)
    : saveKilnChanges(db, user.id, changes, kiln);
};

/**
 * Get a subset of kiln data for kiln matched by ID
 *
 * @param db
 * @param id ID of kiln to return
 *
 * @returns
 */
export const getProgramsByKilnID = (
  db: CDataStoreClass,
  id: ID
) : Promise<IKiln|null> => db.read(
  'programs',
  `kilnID=${id}`,
  ['id', 'type', 'name', 'urlPart', 'controllerProgramID', 'maxTemp', 'cone', 'duration'],
);


const getBasicKilnData = (
  db: CDataStoreClass,
  id: ID | null = null,
  urlPart: string | null = null,
) : PKilnDetails => {
  // console.group('getBasicKilnData()');
  // console.log('id:', id);
  // console.log('urlPart:', urlPart);
  let selector = '';

  if (isNonEmptyStr(id)) {
    selector = `#${id}`;
  } else if (isNonEmptyStr(urlPart)) {
    selector = `urlPart=${urlPart}`;
  }

  // console.log('selector:', selector);
  // console.groupEnd();

  return {
    EfiringTypes: db.read('EfiringType', '', true),
    EfuelSources: db.read('EfuelSource', '', true),
    EkilnOpeningTypes: db.read('EkilnOpeningType', '', true),
    EkilnTypes: db.read('EkilnType', '', true),
    kiln: (selector !== '')
      ? db.read('kilns', selector)
      : Promise.resolve(null),
  };
};

export const getKiln = async (input : Promise<IKiln|IKiln[]|null|undefined>) : Promise<IKiln|null> => {
  // console.group('getKiln()');
  let kiln = await input;
  // console.log('kiln (before):', kiln);

  if (Array.isArray(kiln) && kiln.length > 0) {
    kiln = kiln[0];
  }
  // console.log('kiln (after):', kiln);
  // console.log('isKiln(kiln):', isKiln(kiln));
  const _tmp = validateKilnData(kiln);
  // console.log('_tmp:', _tmp);
  if (_tmp !== null) {
    console.warn('Kiln data is invalid:', _tmp);
  }
  // console.groupEnd();

  return (isKiln(kiln))
    ? kiln
    : null;
}

export const getKilnViewData : FActionHandler  = async (
  db: IDBPDatabase | CDataStoreClass,
  { uid, urlPart } : TGetKilnDataPayload,
) : Promise<TKilnDetails> => {
  // console.group('getKilnViewData()');
  // console.log('uid:', uid);
  // console.log('urlPart:', urlPart);

  if (isCDataStoreClass(db) === true) {
    const tmp = getBasicKilnData(db, uid, urlPart);
    // console.log('tmp:', tmp);

    const kiln = await getKiln(tmp.kiln);
    // console.log('kiln:', kiln);
    // console.groupEnd();
    const uniqueNames : TUniqueNameItem[] = [];

    return {
      ...tmp,
      kiln,
      programs: (typeof kiln !== 'undefined' && kiln !== null)
        ? db.read('programs', `kilnID=${kiln.id}`)
        : Promise.resolve([]),
      uniqueNames,
    };
  } else {
    throw new Error(
      'getKilnViewData() expects first param to be a '
      + 'CDataStoreClass object',
    );
  }
};

export const getKilnEditData : FActionHandler = async (
  db: IDBPDatabase | CDataStoreClass,
  { uid, urlPart } : TGetKilnDataPayload,
) : Promise<TKilnDetails> => {
  // console.group('getKilnEditData()');
  // console.log('uid:', uid);
  // console.log('urlPart:', urlPart);

  if (isCDataStoreClass(db) === true) {
    const tmp = getBasicKilnData(db, uid, urlPart);
    // console.log('tmp:', tmp);

    const kiln = await getKiln(tmp.kiln);
    // console.log('kiln:', kiln);

    const id = (kiln !== null)
      ? kiln.id
      : null;
    // console.log('id:', id);
    // console.groupEnd();

    return {
      ...tmp,
      kiln,
      programs: Promise.resolve([]),
      uniqueNames: getUniqueNameList(await db.read('kilns'), id),
    };
  } else {
    throw new Error(
      'getKilnViewData() expects first param to be a '
      + 'CDataStoreClass object',
    );
  }
}
