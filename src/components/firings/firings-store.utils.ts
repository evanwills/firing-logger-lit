import type { IDBPDatabase } from 'idb';
import type { TFiringsListItem, TGetFirningDataPayload } from '../../types/firings.d.ts';
import type { CDataStoreClass, FActionHandler } from '../../types/store.d.ts';
import type { ID, TDateRange } from '../../types/data-simple.d.ts';
import { isCDataStoreClass } from '../../types/store.type-guards.ts';
import { isIFiring, isTFiringsListItem } from '../../types/firing.type-guards.ts';
import { isProgram } from '../../types/program.type-guards.ts';
import { getKeyRange } from '../../store/idb-data-store.utils.ts';
import { isNonEmptyStr } from "../../utils/string.utils.ts";
import { isUser } from "../../types/user.type-guards.ts";
// import { validateProgramData } from "../programs/program.utils.ts";
// import { validateFiringData } from './firing-data.utils.ts';

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

const _getFiringDataByFiringID = async (
  db: IDBPDatabase,
  uid : ID
) : Promise<TGetFirningDataPayload|null> => {
  // console.groupCollapsed('FiringStoreUtils._getFiringDataByFiringID()');
  // console.info(`About to get data for firing "#${uid}"`);

  const firing = await db.get('firings', uid);
  // console.log('firing:', firing);
  // console.log('isIFiring(firing):', isIFiring(firing));
  // console.log('validateFiringData(firing):', validateFiringData(firing));

  if (isIFiring(firing)) {
    const tx = db.transaction('firingLogs', 'readonly');
    const index = tx.store.index('firingID');
    const log = index.getAll(uid);

    const user = await db.get('users', firing.ownerID);

    // console.groupEnd();

    return {
      firing: Promise.resolve(firing),
      kiln: db.get('kilns', firing.kilnID),
      log,
      program: db.get('programs', firing.programID),
      firingStates: db.getAll('EfiringState'),
      firingTypes: db.getAll('EfiringType'),
      temperatureStates: db.getAll('EtemperatureState'),
      ownerName: (isUser(user))
        ? user.preferredName
        : 'unknown',
    }
  }

  // console.groupEnd();

  return null;
};

const _getFiringDataByProgamID = async (
  db: IDBPDatabase,
  uid : ID
) : Promise<TGetFirningDataPayload|null> => {
  // console.groupCollapsed('FiringStoreUtils._getFiringDataByProgamID()');
  // console.log('uid:', uid);

  const program = await db.get('programs', uid);

  // console.log('program:', program);
  // console.log('isProgram(program):', isIFiring(program));
  // console.log('validateProgramData(program):', validateProgramData(program));
  // console.groupEnd();

  if (isProgram(program)) {

    return {
      firing: Promise.resolve(null),
      kiln: db.get('kilns', program.kilnID),
      log: Promise.resolve([]),
      program: Promise.resolve(program),
      firingStates: db.getAll('EfiringState'),
      firingTypes: db.getAll('EfiringType'),
      temperatureStates: db.getAll('EtemperatureState'),
      ownerName: 'unknown',
    }
  }

  return null;
};

export const getFiringData : FActionHandler = (
  db: IDBPDatabase | CDataStoreClass,
  { uid, programID },
)  : Promise<TGetFirningDataPayload|null> => {
  // console.groupCollapsed('FiringStoreUtils.getFiringData()');
  // console.log('uid:', uid);
  // console.log('programID:', programID);
  // console.log('db:', db);
  if (isCDataStoreClass(db)) {
    throw new Error(
      'addNewKilnData() expects first param `db` to be a '
      + 'IDBPDatabase type object',
    );
  }

  // console.groupEnd();
  return (isNonEmptyStr(uid) && uid !== 'new')
    ? _getFiringDataByFiringID(db, uid)
    : _getFiringDataByProgamID(db, programID);
};
