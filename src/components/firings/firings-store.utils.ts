import type { IFiring, TFiringsListItem, TGetFirningDataPayload } from '../../types/firings.d.ts';
import type { CDataStoreClass, FActionHandler, IUpdateHelperData } from '../../types/store.d.ts';
import type { ID, IIdObject, TDateRange } from '../../types/data-simple.d.ts';
import { isIFiring, isTFiringsListItem } from '../../types/firing.type-guards.ts';
import { isProgram } from '../../types/program.type-guards.ts';
import { addUpdateHelper, getKeyRange } from '../../store/PidbDataStore.utils.ts';
import { isNonEmptyStr } from '../../utils/string.utils.ts';
import { isUser } from '../../types/user.type-guards.ts';
import { getInitialData, saveChangeOnHold } from '../../store/save-data.utils.ts';
import { mergeChanges } from '../../utils/store.utils.ts';
import { validateFiringData } from './firing-data.utils.ts';
import { addRedirect, updateRedirect } from '../../store/redirect.utils.ts';
import { getUID } from "../../utils/data.utils.ts";
import { validateProgramData } from "../programs/program.utils.ts";
// import { validateFiringData } from './firing-data.utils.ts';

export const getFiringsList : FActionHandler = async (
  db: CDataStoreClass,
  { start, end } : TDateRange,
)  : Promise<TFiringsListItem[]> => {
  const range = getKeyRange(start, end);

  if (range === null) {
    return db.getAll('firingsList');
  }

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

  return Promise.resolve(firingList);
};

const _getFiringDataByFiringID = async (
  db: CDataStoreClass,
  uid : ID
) : Promise<TGetFirningDataPayload|null> => {
  // console.groupCollapsed('FiringStoreUtils._getFiringDataByFiringID()');
  // console.info(`About to get data for firing "#${uid}"`);

  const firing = await db.get('firings', uid);
  // console.log('firing:', firing);
  // console.log('isIFiring(firing):', isIFiring(firing));
  // console.log('validateFiringData(firing):', validateFiringData(firing));

  if (isIFiring(firing)) {
    const user = await db.get('users', firing.ownerID);

    // console.groupEnd();

    return {
      firing: Promise.resolve(firing),
      kiln: db.get('kilns', firing.kilnID),
      log: db.getAllFromIndex('firingLogs', 'firingID', uid),
      program: db.get('programs', firing.programID),
      firingStates: db.getAll('EfiringState'),
      firingTypes: db.getAll('EfiringType'),
      temperatureStates: db.getAll('EtemperatureState'),
      ownerName: (isUser(user))
        ? user.preferredName
        : 'unknown',
    }
  }
  // console.warn('validateFiringData(firing):', validateFiringData(firing));
  // console.groupEnd();

  return null;
};

const _getFiringDataByProgamID = async (
  db: CDataStoreClass,
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
      firing: Promise.resolve({
        id: getUID(),
        kilnID: program.kilnID,
        programID: program.id,
        ownerID: 'unknown',
        diaryID: null,
        firingType: program.type,
        scheduledStart: null,
        scheduledEnd: null,
        scheduledCold: null,
        packed: null,
        actualStart: null,
        actualEnd: null,
        actualCold: null,
        unpacked: null,
        maxTemp: program.maxTemp,
        cone: program.cone,
        firingState: 'created',
        firingActiveState: 'normal',
        temperatureState: 'n/a',
        log: [],
      }),
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
  db: CDataStoreClass,
  { uid, programID },
)  : Promise<TGetFirningDataPayload|null> => {
  // console.groupCollapsed('FiringStoreUtils.getFiringData()');
  // console.log('uid:', uid);
  // console.log('programID:', programID);
  // console.log('db:', db);
  // console.groupEnd();
  return (isNonEmptyStr(uid) && uid !== 'new')
    ? _getFiringDataByFiringID(db, uid)
    : _getFiringDataByProgamID(db, programID);
};

const saveFiringChanges = (
  db: CDataStoreClass,
  _userID : string,
  changes : IIdObject | null,
  firing : IFiring,
) : Promise<IDBValidKey> => {
  const _firing : IIdObject = mergeChanges(changes, firing);
  const firingError = validateFiringData(_firing);

  if (firingError !== null) {
    return Promise.reject(firingError);
  }

  const method = changes === null ? 'add' : 'put';
  const url = `/firing/${_firing.id}`;

  try {
    if (method === 'add') {
      addRedirect(db, { id: _firing.id, kiln: true, url });
    } else if (typeof changes?.urlPath === 'string') {
      updateRedirect(db, { id: _firing.id, url });
    }

    return db[method]('firings', _firing);
  } catch (error) {
    console.group('saveFiringChanges()');
    console.log('_userID:', _userID);
    console.log('changes:', changes);
    console.log('firing:', firing);
    console.log('_firing:', _firing);
    console.error('Failed to save firing data:', error);
    console.groupEnd();

    return Promise.reject(error);
  }
}

export const updateFiringData : FActionHandler = async(
  db: CDataStoreClass,
  changes : IIdObject,
) : Promise<IDBValidKey> => {
  try {
    const { hold, user, thing } : IUpdateHelperData = await addUpdateHelper(
      db,
      'updateFiringData',
      'firings',
      'firing',
      isIFiring,
      {
        permissionLevel: 1,
        allowed: 'fire',
        id: changes.id,
      }
    );

    const initial : IIdObject | string = getInitialData(changes, thing as IFiring);

    if (typeof initial === 'string') {
      return Promise.reject(initial);
    }

    return  (hold === true)
      ? saveChangeOnHold(
          db,
          'firings',
          user.id,
          changes,
          initial,
        )
      : saveFiringChanges(
          db,
          user.id,
          changes,
          thing as IFiring
        );
  } catch(error) {
    throw error;
  }
}

export const addFiringLogEntry : FActionHandler = async (
  db: CDataStoreClass,
  data : IIdObject,
) : Promise<IDBValidKey> => {
  try {
    const { hold, user } : IUpdateHelperData = await addUpdateHelper(
      db,
      'addFiringLogEntry',
      'firingLogs',
      'firing log enty',
      isIFiring,
      {
        permissionLevel: 1,
        allowed: 'log'
      }
    );

    if (hold === true) {
      return saveChangeOnHold(
        db,
        'firings',
        user.id,
        data,
        null,
      );
    }

    return idbp.add('firingLogs', data);
  } catch(error : unknown) {
    throw error;
  }
};
