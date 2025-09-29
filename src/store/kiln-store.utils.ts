import type { IDBPDatabase } from "idb";
import type { ID, IKeyValue } from '../types/data-simple.d.ts';
import type { IKiln } from '../types/kilns.d.ts';
import type { TUser } from '../types/users.d.ts';
import { getAuthUser, userHasAuth } from "./user-data.utils.ts";
import type { CDataStoreClass } from "../types/store.d.ts";
import { isNonEmptyStr, isObj } from "../utils/data.utils.ts";
import type { PKilnDetails, TKilnDetails } from "../types/kilns.d.ts";
import { getUniqueNameList } from "../utils/store.utils.ts";
import { isKiln, isKilnReport } from "../types/kiln.type-guards.ts";


export const updateKilnData = async (db: IDBPDatabase, data : IKeyValue) : Promise<boolean> => {
  const user : TUser | null = await getAuthUser(db);

  if (user === null || !userHasAuth(user, 2)) {
    return Promise.resolve(false);
  }

  console.log('data:', data);
  // return new Promise((resolve, _reject) => {
  //   db.put('users', newData, user.id).then(() => { resolve(true); }).catch((reason) => {
  //     console.error('updateAuthUser() failed:', reason);

  //     resolve(false);
  //   });
  // });
  return Promise.resolve(false)
}

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
