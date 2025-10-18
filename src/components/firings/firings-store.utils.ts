import type { IDBPDatabase } from "idb";
import type { TFiringsListItem, TGetFirningDataPayload } from "../../types/firings.d.ts";
import type { CDataStoreClass, FActionHandler } from "../../types/store.d.ts";
import type { ID, TDateRange } from "../../types/data-simple.d.ts";
import { isCDataStoreClass } from "../../types/store.type-guards.ts";
import { isIFiring, isTFiringsListItem } from "../../types/firing.type-guards.ts";
import { getKeyRange } from '../../store/idb-data-store.utils.ts';
import { validateFiringData } from "./firing-data.utils.ts";

export const getFiringsList : FActionHandler = async (
  db: IDBPDatabase | CDataStoreClass,
  { start, end } : TDateRange,
)  : Promise<TFiringsListItem[]> => {
  if (isCDataStoreClass(db)) {
    throw new Error(
      'addNewKilnData() expects first param `db` to be a '
      + 'IDBPDatabase type object',
    );
  }

  const range = getKeyRange(start, end);

  if (range !== null) {
    const tx = db.transaction('firingsList', 'readonly');
    const index = tx.store.index('actualStart');
    let cursor = await index.openCursor(range);
    const firingList : TFiringsListItem[] = [];

    while (cursor) {
      if (isTFiringsListItem(cursor)) {
        firingList.push(cursor as TFiringsListItem);
      }

      cursor = await cursor.continue();
    }

    return firingList;
  }

  return db.getAll('firingsList');
};

export const getFiringData : FActionHandler = async (
  db: IDBPDatabase | CDataStoreClass,
  { uid },
)  : Promise<TGetFirningDataPayload|null> => {
  console.group('FiringStoreUtils.getFiringData()');
  console.log('uid:', uid);
  console.log('db:', db);
  if (isCDataStoreClass(db)) {
    throw new Error(
      'addNewKilnData() expects first param `db` to be a '
      + 'IDBPDatabase type object',
    );
  }

  console.info(`About to get data for firing "#${uid}"`);
  const firing = await db.get('firings', uid);
  console.log('firing:', firing);
  console.log('isIFiring(firing):', isIFiring(firing));
  console.log('validateFiringData(firing):', validateFiringData(firing));

  if (isIFiring(firing)) {
    const tx = db.transaction('firingLogs', 'readonly');
    const index = tx.store.index('firingID');
    const log = index.getAll(uid);
    return {
      firing: Promise.resolve(firing),
      kiln: db.get('kilns', firing.kilnID),
      log,
      program: db.get('programs', firing.programID),
    }
  }

  return null;
}
