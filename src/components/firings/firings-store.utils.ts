import type { IDBPDatabase } from "idb";
import type { TFiringsListItem, TGetFirningDataPayload } from "../../types/firings.d.ts";
import type { CDataStoreClass, FActionHandler } from "../../types/store.d.ts";
import type { ID, TDateRange } from "../../types/data-simple.d.ts";
import { isCDataStoreClass } from "../../types/store.type-guards.ts";
import { isIFiring, isTFiringsListItem } from "../../types/firing.type-guards.ts";
import { isISO8601 } from "../../types/data.type-guards.ts";

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

  const lower = isISO8601(start);
  const upper = isISO8601(end);

  let range;

  if (lower === true && upper === true) {
    range = (start > end)
      ? IDBKeyRange.bound(end, start)
      : IDBKeyRange.bound(start, end);
  } else if (lower === true) {
    range = IDBKeyRange.lowerBound(start)
  } else if (upper === true) {
    range = IDBKeyRange.upperBound(end);
  }

  const tx = db.transaction('firings', 'readonly');
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
};

export const getFiringData : FActionHandler = async (
  db: IDBPDatabase | CDataStoreClass,
  uid: ID,
)  : Promise<TGetFirningDataPayload|null> => {
  if (isCDataStoreClass(db)) {
    throw new Error(
      'addNewKilnData() expects first param `db` to be a '
      + 'IDBPDatabase type object',
    );
  }

  const firing = await db.get('firings', uid);

  if (isIFiring(firing)) {
    const tx = db.transaction('firingLogs', 'readonly');
    const index = tx.store.index('firingID');
    const log = index.getAll(firing.id);
    return {
      firing: Promise.resolve(firing),
      kiln: db.get('kilns', firing.kilnID),
      log,
      program: db.get('programs', firing.programID),
    }
  }

  return null;
}
