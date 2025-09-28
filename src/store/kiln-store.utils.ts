import type { IDBPDatabase } from "idb";
import type { IKeyValue } from '../types/data-simple.d.ts';
import type { TUser } from '../types/data.d.ts';
import { getAuthUser, userHasAuth } from "./user-data.utils.ts";


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
