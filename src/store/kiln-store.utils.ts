import type { IDBPDatabase } from 'idb';
import type { ID, IIdObject } from '../types/data-simple.d.ts';
import type { IKiln } from '../types/kilns.d.ts';
import type { TUser } from '../types/users.d.ts';
import { getAuthUser, getLastAuthUser, userHasAuth } from './user-data.utils.ts';
import type { CDataStoreClass } from '../types/store.d.ts';
import type { PKilnDetails, TKilnDetails } from '../types/kilns.d.ts';
import { isNonEmptyStr } from '../utils/string.utils.ts';
import { getUniqueNameList } from '../utils/store.utils.ts';
import { isKiln } from '../types/kiln.type-guards.ts';
import { getInitialData, saveChangeOnHold } from './save-data.utils.ts';
import { validateKilnData } from '../utils/kiln-data.utils.ts';

const saveKilnChanges = async (
  db: IDBPDatabase,
  _userID : string,
  changes : IIdObject | null,
  kiln : IKiln,
) : Promise<IDBValidKey> => {
  const _kiln : IKiln = { ...kiln };

  if (changes !== null) {
    for (const key of Object.keys(changes)) {
      if (key !== 'id') {
        _kiln[key] = changes[key];
      }
    }
  }

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

export const addNewKilnData = async (
  db: IDBPDatabase,
  newKiln : IKiln,
) : Promise<IDBValidKey> => {
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

  return  (hold === true)
    ? saveChangeOnHold(db, 'kilns', user.id, newKiln, null)
    : saveKilnChanges(db, user.id, null, newKiln);
};

export const updateKilnData = async (
  db: IDBPDatabase,
  changes : IIdObject,
) : Promise<IDBValidKey> => {
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

export const getKilnViewData = async (
  db: CDataStoreClass,
  id: ID | null = null,
  urlPart: string | null = null,
) : Promise<TKilnDetails> => {
  // console.group('getKiln()');
  // console.log('id:', id);
  // console.log('urlPart:', urlPart);

  const tmp = getBasicKilnData(db, id, urlPart);
  // console.log('tmp:', tmp);

  const kiln = await getKiln(tmp.kiln);
  // console.log('kiln:', kiln);
  // console.groupEnd();

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
