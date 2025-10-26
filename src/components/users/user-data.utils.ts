import type { IKeyValue } from '../../types/data-simple.d.ts';
import type { TUser, TUserNowLaterAuth } from '../../types/users.d.ts';
import type { CDataStoreClass, FActionHandler } from '../../types/store.d.ts';
import { isUser } from '../../types/user.type-guards.ts';
import { getCookie } from '../../utils/cookie.utils.ts';
import { populateEmptyKVslice } from '../../store/PidbDataStore.utils.ts';
import { isNonEmptyStr } from '../../utils/string.utils.ts';

const setUserPrefs = (
  db : CDataStoreClass,
  { id, preferredName, notMetric, colourScheme } : TUser,
) => {
  populateEmptyKVslice(
    db,
    { id, preferredName, notMetric, colourScheme },
    'userPreferences',
    'replace',
  );
};

export const getLastAuthUser = async (db : CDataStoreClass) : Promise<unknown> => {
  const userID = await db.get('userPreferences', 'id');

  return (isNonEmptyStr(userID))
    ? db.get('users', userID)
    : Promise.resolve(null);
};

export const getAuthUser : FActionHandler = async (
  db : CDataStoreClass,
  _payload : unknown | null = null,
) : Promise<unknown> => {
  const userID = getCookie(import.meta.env.VITE_AUTH_COOKIE);

  if (userID === null) {
    return Promise.resolve(null);
  }

  const localUser = await db.get('userPreferences', 'id');
  const tmp = db.get('users', userID);
  // console.log('localUser:', localUser);
  // console.log('userID:', userID);
  // console.log('tmp:', tmp);
  if (localUser === userID) {
    return tmp
  }

  const userData : TUser = await tmp;
  // console.log('tmp:', tmp);

  if (isUser(userData)) {
    setUserPrefs(db, userData);
  }

  return Promise.resolve(userData);
};

export const userHasAuth = (user : TUser | null, level : number) : boolean => {
  if (user === null || isUser(user) === false) {
    return false;
  }

  const userID = getCookie(import.meta.env.VITE_AUTH_COOKIE);

  if (userID === null || user.id !== userID || user.adminLevel < level)  {
    return false;
  }

  return true;
};

export const userCan = (
  user : TUser | null,
  key: string,
  level : number = 1,
) : boolean => {
  if (user !== null && userHasAuth(user, level)) {
    switch(key.toLowerCase()) {
      case 'fire':
        return user.canFire;

      case 'log':
        return user.canLog;

      case 'pack':
        return user.canPack;

      case 'price':
        return user.canPrice;

      case 'program':
        return user.canProgram;

      case 'unpack':
        return user.canUnpack;
    }
  }

  return false;
};

export const userCanNowLater = async (
  db : CDataStoreClass,
  key : string = 'any',
  level : number = 2,
) : Promise<TUserNowLaterAuth> => {
  let tmp : unknown = await getAuthUser(db, null);
  let user : TUser | null = null;
  let hold : boolean = false;
  let msg : string = '';

  if (isUser(tmp as TUser) === false) {
    tmp = await getLastAuthUser(db);
    hold = true;
  }

  if (isUser(tmp) === true) {
    user = tmp;
  }

  if (user === null) {
    msg = ('You must be logged in to');
  } else if (!userHasAuth(user as TUser, level)) {
    msg = `You (${(user as TUser).preferredName}) do not have a high enough admin level to`;
  } else if (key !== 'any' && !userCan((user as TUser), key, level)) {
    msg = `You (${(user as TUser).preferredName}) do not have permission to`;
  }

  return { user: (user as TUser), hold, msg };
};

export const updateAuthUser : FActionHandler = async (
  db: CDataStoreClass,
  data : IKeyValue,
) : Promise<unknown> => {
  const tmp : unknown = await getAuthUser(db, null);

  if (isUser(tmp) === false) {
    return Promise.resolve(false);
  }
  const user : TUser = tmp;

  const allowedStrKeys = [
    'firstName',
    'lastName',
    'preferredName',
    'phone',
    'email',
    'notMetric',
    'colourScheme',
  ];

  const allowedBoolKeys = ['notMetric'];

  const newData : TUser = { ...user };

  for (const key of allowedStrKeys) {
    if (isNonEmptyStr(data, key) === true) {
      // deno-lint-ignore no-explicit-any
      newData[key] = data[key];
    }
  }

  for (const key of allowedBoolKeys) {
    if (typeof data[key] === 'boolean') {
      // deno-lint-ignore no-explicit-any
      newData[key] = data[key];
    }
  }

  return new Promise((resolve, _reject) => {
    db.put('users', newData, user.id).then(() => { resolve(true); }).catch((reason) => {
      console.error('updateAuthUser() failed:', reason);

      resolve(false);
    });
  });
}
