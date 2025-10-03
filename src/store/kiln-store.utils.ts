import type { IDBPDatabase } from "idb";
import type { ID, IIdObject } from '../types/data-simple.d.ts';
import type { IKiln } from '../types/kilns.d.ts';
import type { TUser } from '../types/users.d.ts';
import { getAuthUser, getLastAuthUser, userHasAuth } from "./user-data.utils.ts";
import type { CDataStoreClass } from "../types/store.d.ts";
import { isNonEmptyStr } from "../utils/data.utils.ts";
import type { PKilnDetails, TKilnDetails } from "../types/kilns.d.ts";
import { getUniqueNameList } from "../utils/store.utils.ts";
import { isKiln } from "../types/kiln.type-guards.ts";
import { getInitialData, saveChangeOnHold } from "./save-data.utils.ts";

const saveKilnChanges = async (
  db: IDBPDatabase,
  _userID : string,
  changes : IIdObject,
  kiln : IKiln,
) : Promise<IDBValidKey> => {
  const _kiln : IKiln = { ...kiln };

  for (const key of Object.keys(changes)) {
    if (key !== 'id') {
      _kiln[key] = changes[key];
    }
  }

  try {
    return await db.put('kilns', _kiln);
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

export const updateKilnData = async (db: IDBPDatabase, changes : IIdObject) : Promise<IDBValidKey> => {
  let user : TUser | null = await getAuthUser(db);
  let hold : boolean = false;

  if (user === null) {
    user = await getLastAuthUser(db);
    hold = true;
  }

  if (user === null) {
    return Promise.reject('You must be logged in to update kiln details');
  }

  if (!userHasAuth(user, 2)) {
    return Promise.reject(
      `${user.preferredName} does not have permission to update kiln details.`
    );
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
  name: string | null = null,
) : PKilnDetails => {
  console.group('getBasicKilnData()');
  console.log('id:', id);
  console.log('name:', name);
  let selector = '';

  if (isNonEmptyStr(id)) {
    selector = `#${id}`;
  } else if (isNonEmptyStr(name)) {
    selector = `urlPart=${name}`;
  }

  console.log('selector:', selector);
  console.groupEnd();

  return {
    EkilnTypes: db.read('EkilnType', '', true),
    EfuelSources: db.read('EfuelSource', '', true),
    EfiringTypes: db.read('EfiringType', '', true),
    EkilnOpeningType: db.read('EkilnOpeningType', '', true),
    kiln: (selector !== '')
      ? db.read('kilns', selector)
      : Promise.resolve(null),
  };
};

const getKiln = async (input : Promise<IKiln|IKiln[]|null|undefined>) : Promise<IKiln|null> => {
  let kiln = await input;

  if (Array.isArray(kiln) && kiln.length > 0) {
    kiln = kiln[0];
  }

  return (isKiln(kiln))
    ? kiln
    : null;
}

export const getKilnViewData = async (
  db: CDataStoreClass,
  id: ID | null = null,
  name: string | null = null,
) : Promise<TKilnDetails> => {
  const tmp = getBasicKilnData(db, id, name);

  const kiln = await getKiln(tmp.kiln);

  return {
    ...tmp,
    kiln,
    programs: (typeof kiln !== 'undefined' && kiln !== null)
      ? db.read('programs', `kilnID=${kiln.id}`)
      : Promise.resolve([]),
    uniqueNames: [],
  };
};

export const getKilnEditData = async (
  db: CDataStoreClass,
  id: ID | null = null,
  name: string | null = null,
) : Promise<TKilnDetails> => {
  const tmp = getBasicKilnData(db, id, name);

  const kiln = await getKiln(tmp.kiln);

  const _id = (kiln !== null)
    ? kiln.id
    : null;

  return {
    ...tmp,
    kiln,
    programs: Promise.resolve([]),
    uniqueNames: getUniqueNameList(await db.read('kilns'), _id),
  };
}
