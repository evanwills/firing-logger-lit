import type { IDBPDatabase } from "idb";
import type { IKeyValue } from '../types/data-simple.d.ts';
import type { TUser } from '../types/data.d.ts';
import { getCookie } from '../utils/cookie.utils.ts';

export const getAuthUser = (db : IDBPDatabase) : Promise<TUser|null> => {
  const userID = getCookie(import.meta.env.VITE_AUTH_COOKIE);

  if (userID === null) {
    return Promise.resolve(null);
  }

  return db.get('users', userID);
};

export const updateAuthUser = async (db: IDBPDatabase, data : IKeyValue) : Promise<boolean> => {
  const user : TUser | null = await getAuthUser(db);

  if (user === null) {
    return Promise.resolve(false);
  }

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
    if (typeof data[key] === 'string' && data[key].trim() !== '') {
      newData[key] = data[key];
    }
  }

  for (const key of allowedBoolKeys) {
    if (typeof data[key] === 'boolean') {
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
