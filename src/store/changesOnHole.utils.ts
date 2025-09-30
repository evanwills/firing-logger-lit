import type { IDBPDatabase } from "idb";
import type { ID, IIdObject } from "../types/data-simple";

export const saveChangeOnHold = (
  db: IDBPDatabase,
  store: string,
  userID : ID,
  changes : IIdObject,
  initial : IIdObject,
  mode: string = 'update',
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
