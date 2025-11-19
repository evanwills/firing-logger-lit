import type { IFiring, TFiringsListItem, TGetFirningDataPayload } from '../../types/firings.d.ts';
import type { IFiringLogEntry } from '../../types/firing-logs.d.ts';
import type { CDataStoreClass, FActionHandler, IUpdateHelperData } from '../../types/store.d.ts';
import type { ID, IIdObject, IKeyScalar, IKeyStr, TDateRange } from '../../types/data-simple.d.ts';
import { isFiringLogEntry, isIFiring, isTFiringsListItem } from '../../types/firing.type-guards.ts';
import { isProgram } from '../../types/program.type-guards.ts';
import { addUpdateHelper, getKeyRange } from '../../store/PidbDataStore.utils.ts';
import { isNonEmptyStr } from '../../utils/string.utils.ts';
import { isUser } from '../../types/user.type-guards.ts';
import { getInitialData, saveChangeOnHold } from '../../store/save-data.utils.ts';
import { mergeChanges } from '../../utils/store.utils.ts';
import { firingListItemPropIsSameType, validateFiringData } from './firing-data.utils.ts';
import { addRedirect, updateRedirect } from '../../store/redirect.utils.ts';
import { getUID } from "../../utils/data.utils.ts";
import { isID } from "../../types/data.type-guards.ts";
// import { validateFiringData } from './firing-data.utils.ts';

export const getFiringsList : FActionHandler = async (
  db: CDataStoreClass,
  payload : unknown,
)  : Promise<unknown> => {
  const { start, end } = payload as TDateRange;
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
        active: false,
        isRetro: false,
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
  props : unknown,
)  : Promise<TGetFirningDataPayload|null> => {
  // console.groupCollapsed('FiringStoreUtils.getFiringData()');
  // console.log('props:', props);

  const uid : ID | null = (isID((props as IKeyStr)?.uid) === true)
    ? (props as IKeyScalar).uid as ID
    : null;
  const programID : ID | null = (isID((props as IKeyStr)?.programID) === true)
    ? (props as IKeyScalar).programID as ID
    : '';

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
  // console.group('saveFiringChanges()');
  const _firing : IIdObject = mergeChanges(changes, firing);
  // console.log('_firing:', _firing);
  // console.log('isIFiring(_firing):', isIFiring(_firing));
  // console.log('validateFiringData(_firing):', validateFiringData(_firing));

  if (isIFiring(_firing) === false) {
    const firingError = validateFiringData(_firing);

    console.error('Firing data is invalid:', firingError);
    // console.groupEnd();
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

    // console.groupEnd();
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

export const addNewFiringData : FActionHandler = async(
  db: CDataStoreClass,
  data : unknown,
) : Promise<IDBValidKey> => {
  // console.group('addNewFiringData()');
  // console.log('data:', data);
  try {
    const { hold, user } : IUpdateHelperData = await addUpdateHelper(
      db,
      'updateFiringData',
      'firings',
      'firing',
      isIFiring,
      {
        permissionLevel: 1,
        allowed: 'fire',
        newData: data,
        validateThing: validateFiringData
      }
    );
    // console.log('hold:', hold);
    // console.log('user:', user);

    return  (hold === true)
      ? saveChangeOnHold(
          db,
          'firings',
          user.id,
          data as IIdObject,
          null,
        )
      : db.put('firings', data);
  } catch(error) {
    console.error('Caught error:', error);
    throw error;
  }
}

export const updateFiringData : FActionHandler = async(
  db: CDataStoreClass,
  data : unknown,
) : Promise<IDBValidKey> => {
  // console.group('updateFiringData()');
  // console.log('data:', data);
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
        id: (data as IIdObject).id,
      }
    );

    // console.log('thing:', thing);
    const initial : IIdObject | string = getInitialData(data as IIdObject, thing as IFiring);

    // console.log('initial:', initial);

    if (typeof initial === 'string') {
      console.error(initial);
      // console.groupEnd();
      return Promise.reject(initial);
    }

    // console.groupEnd();
    return  (hold === true)
      ? saveChangeOnHold(
          db,
          'firings',
          user.id,
          data as IIdObject,
          initial,
        )
      : saveFiringChanges(
          db,
          user.id,
          data as IIdObject,
          thing as IFiring
        );
  } catch(error) {
    console.error('Caught error:', error);
    throw error;
  }
}

export const addFiringLogEntry : FActionHandler = async (
  db: CDataStoreClass,
  data : unknown,
) : Promise<IDBValidKey> => {
  try {
    const { hold, user } : IUpdateHelperData = await addUpdateHelper(
      db,
      'addFiringLogEntry',
      'firingLogs',
      'firing log enty',
      isFiringLogEntry,
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
        data as IFiringLogEntry,
        null,
      );
    }

    return db.add('firingLogs', data);
  } catch(error : unknown) {
    throw error;
  }
}

export const addToFiringList : FActionHandler = async (
  db: CDataStoreClass,
  data : unknown,
) : Promise<IDBValidKey> => {
  try {
    const { hold, user } : IUpdateHelperData = await addUpdateHelper(
      db,
      'addFiringLogEntry',
      'firingLogs',
      'firing log enty',
      isTFiringsListItem,
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
        data as TFiringsListItem,
        null,
      );
    }

    return db.add('firingsList', data);
  } catch(error : unknown) {
    throw error;
  }
}

export const updateFiringList : FActionHandler = async (
  db: CDataStoreClass,
  data : unknown,
) : Promise<IDBValidKey> => {
  // console.group('updateFiringList()');
  // console.log('data:', data)
  try {
    const { hold, user, thing } : IUpdateHelperData = await addUpdateHelper(
      db,
      'updateFiringList',
      'firingsList',
      'firing list item',
      isTFiringsListItem,
      {
        permissionLevel: 1,
        allowed: 'log',
        id: (data as IIdObject).id,
      }
    );
    // console.log('hold:', hold)
    // console.log('user:', user)
    // console.log('thing:', thing)

    if (hold === true) {
      // console.info('storing data for later');
      // console.groupEnd();
      return saveChangeOnHold(
        db,
        'firings',
        user.id,
        data as IIdObject,
        thing as TFiringsListItem,
      );
    }

    let newData : TFiringsListItem | null = (isTFiringsListItem(data))
      ? { ...data }
      : null;

    // console.log('newData (before):', newData);
    if (newData === null) {
      newData = { ...(thing as TFiringsListItem) };

      for (const key of Object.keys(data as IIdObject)) {
        if (firingListItemPropIsSameType(newData, data as IIdObject, key)) {
          (newData as IIdObject)[key] = (data as IIdObject)[key]
        }
      }
    }
    // console.log('newData (after):', newData);

    // console.info('saving data now');
    // console.groupEnd();
    return db.put('firingsList', newData);
  } catch(error : unknown) {
    console.error('Caught error:', error);
    // console.groupEnd();
    throw error;
  }
};
