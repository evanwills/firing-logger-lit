import { type IDBPDatabase, type IDBPTransaction } from 'idb';
import type {
  CDataStoreClass,
  FReadyWatcher,
} from '../types/store.d.ts';
import PidbDataStore from './PidbDataStore.class.ts';
import {
  populateEmptyEnumSlice,
  populateEmptySlice,
  populateEnumSlice,
  // storeCatch,
} from './idb-data-store.utils.ts';
import { getAuthUser, updateAuthUser } from "./user-data.utils.ts";
import type { IDBPmigrate, IDBPupgrade } from "../types/pidb.d.ts";

let store : CDataStoreClass | null = null;

const upgradeSchema : IDBPupgrade = (
    db : IDBPDatabase<unknown>,
    oldV : number,
    newV : number | null,
    transaction: IDBPTransaction<unknown, string[], 'versionchange'>,
    event : Event,
  ) : void => {
    console.group('upgradeSchema()');
    console.log('db:', db);
    console.log('oldV:', oldV);
    console.log('newV:', newV);
    console.log('transaction:', transaction);
    console.log('event:', event);
    // ----------------------------------------------------------
    // START: _meta

    if (!db.objectStoreNames.contains('_meta')) {
      db.createObjectStore('_meta', { keyPath: 'key' });
    }

    //  END:  _meta
    // ----------------------------------------------------------
    // START: users

    if (!db.objectStoreNames.contains('users')) {
      const users = db.createObjectStore('users', { keyPath: 'id' });

      users.createIndex('username', 'username', { unique: true });
      users.createIndex('firstName', 'firstName', { unique: false });
      users.createIndex('lastName', 'lastName', { unique: false });
      users.createIndex('preferredName', 'preferredName', { unique: true });
      users.createIndex('phone', 'phone', { unique: false });
      users.createIndex('email', 'email', { unique: true });
      users.createIndex('canFire', 'canFire', { unique: false });
      users.createIndex('canProgram', 'canProgram', { unique: false });
      users.createIndex('canLog', 'canLog', { unique: false });
      users.createIndex('canPack', 'canPack', { unique: false });
      users.createIndex('canUnpack', 'canUnpack', { unique: false });
      users.createIndex('canPrice', 'canPrice', { unique: false });
      users.createIndex('adminLevel', 'adminLevel', { unique: false });
    }

    //  END:  users
    // ----------------------------------------------------------
    // START: kilns

    if (!db.objectStoreNames.contains('kilns')) {
      const kilns = db.createObjectStore('kilns', { keyPath: 'id' });

      kilns.createIndex('brand', 'brand', { unique: false });
      kilns.createIndex('model', 'model', { unique: false });
      kilns.createIndex('name', 'name', { unique: true });
      kilns.createIndex('urlPart', 'urlPart', { unique: true });
      kilns.createIndex('installDate', 'installDate', { unique: false });
      kilns.createIndex('fuel', 'fuel', { unique: false });
      kilns.createIndex('type', 'type', { unique: false });
      kilns.createIndex('maxTemp', 'maxTemp', { unique: false });
      kilns.createIndex('volume', 'volume', { unique: false });
      kilns.createIndex('width', 'width', { unique: false });
      kilns.createIndex('depth', 'depth', { unique: false });
      kilns.createIndex('height', 'height', { unique: false });
      kilns.createIndex('glaze', 'glaze', { unique: false });
      kilns.createIndex('bisque', 'bisque', { unique: false });
      kilns.createIndex('luster', 'luster', { unique: false });
      kilns.createIndex('onglaze', 'onglaze', { unique: false });
      kilns.createIndex('saggar', 'saggar', { unique: false });
      kilns.createIndex('raku', 'raku', { unique: false });
      kilns.createIndex('pit', 'pit', { unique: false });
      kilns.createIndex('black', 'black', { unique: false });
      kilns.createIndex('rawGlaze', 'rawGlaze', { unique: false });
      kilns.createIndex('saltGlaze', 'saltGlaze', { unique: false });
      kilns.createIndex('useCount', 'useCount', { unique: false });
      kilns.createIndex('isRetired', 'isRetired', { unique: false });
      kilns.createIndex('isWorking', 'isWorking', { unique: false });
      kilns.createIndex('isInUse', 'isInUse', { unique: false });
      kilns.createIndex('isHot', 'isHot', { unique: false });
    }

    //  END:  kilns
    // ----------------------------------------------------------
    // START: programs

    if (!db.objectStoreNames.contains('programs')) {
      const programs = db.createObjectStore('programs', { keyPath: 'id' });

      programs.createIndex('kilnID', 'kilnID', { unique: false });
      programs.createIndex('urlPart', 'urlPart', { unique: false });
      programs.createIndex('kilnProgramPath', ['kilnID', 'urlPart'], { unique: true });
      programs.createIndex('controllerProgramID', 'controllerProgramID', { unique: false });
      programs.createIndex('maxTemp', 'maxTemp', { unique: false });
      programs.createIndex('cone', 'cone', { unique: false });
      programs.createIndex('duration', 'duration', { unique: false });
      programs.createIndex('createdBy', 'createdBy', { unique: false });
      programs.createIndex('created', 'created', { unique: false });
      programs.createIndex('parentID', 'parentID', { unique: false });
      programs.createIndex('useCount', 'useCount', { unique: false });
      programs.createIndex('deleted', 'deleted', { unique: false });
    }

    //  END:  programs
    // ----------------------------------------------------------
    // START: firings

    if (!db.objectStoreNames.contains('firings')) {
      const firings = db.createObjectStore('firings', { keyPath: 'id' });

      firings.createIndex('kilnID', 'kilnID', { unique: false });
      firings.createIndex('programID', 'programID', { unique: false });
      firings.createIndex('diaryID', 'diaryID', { unique: false });
      firings.createIndex('firingType', 'firingType', { unique: false });
      firings.createIndex('firingState', 'firingState', { unique: false });
      firings.createIndex('maxTemp', 'maxTemp', { unique: false });
      firings.createIndex('cone', 'cone', { unique: false });
      firings.createIndex('responsibleID', 'responsibleID', { unique: false });
    }

    //  END:  firings
    // ----------------------------------------------------------
    // START: cones

    if (!db.objectStoreNames.contains('cones')) {
      const cones = db.createObjectStore('cones', { keyPath: 'id' });

      cones.createIndex('cone', 'cone', { unique: false });
      cones.createIndex('rate', 'rate', { unique: false });
      cones.createIndex('temp', 'temp', { unique: false });
    }

    //  END:  cones
    // ----------------------------------------------------------
    // START: EfiringType

    if (!db.objectStoreNames.contains('EfiringType')) {
      const ftype = db.createObjectStore('EfiringType', { keyPath: 'key' });

      ftype.createIndex('value', 'value', { unique: true });
    }

    //  END:  EfiringType
    // ----------------------------------------------------------
    // START: EprogramState

    if (!db.objectStoreNames.contains('EprogramState')) {
      const pState = db.createObjectStore('EprogramState', { keyPath: 'key' });

      pState.createIndex('value', 'value', { unique: true });
    }

    //  END:  EprogramState
    // ----------------------------------------------------------
    // START: EkilnFiringState

    if (!db.objectStoreNames.contains('EkilnFiringState')) {
      const kfState = db.createObjectStore('EkilnFiringState', { keyPath: 'key' });

      kfState.createIndex('value', 'value', { unique: true });
    }

    //  END:  EkilnFiringState
    // ----------------------------------------------------------
    // START: EtemperatureState

    if (!db.objectStoreNames.contains('EtemperatureState')) {
      const tState = db.createObjectStore('EtemperatureState', { keyPath: 'key' });

      tState.createIndex('value', 'value', { unique: true });
    }

    //  END:  EtemperatureState
    // ----------------------------------------------------------
    // START: EfuelSource

    if (!db.objectStoreNames.contains('EfuelSource')) {
      const fSource = db.createObjectStore('EfuelSource', { keyPath: 'key' });

      fSource.createIndex('value', 'value', { unique: true });
    }

    //  END:  EfuelSource
    // ----------------------------------------------------------
    // START: EkilnType

    if (!db.objectStoreNames.contains('EkilnType')) {
      const kType = db.createObjectStore('EkilnType', { keyPath: 'key' });

      kType.createIndex('value', 'value', { unique: true });
    }

    //  END:  EkilnType
    // ----------------------------------------------------------
    // START: EequipmentLogType

    if (!db.objectStoreNames.contains('EequipmentLogType')) {
      const elType = db.createObjectStore('EequipmentLogType', { keyPath: 'key' });

      elType.createIndex('value', 'value', { unique: true });
    }

    //  END:  EequipmentLogType
    // ----------------------------------------------------------
    // START: EprogramStatus

    if (!db.objectStoreNames.contains('EprogramStatus')) {
      const prState = db.createObjectStore('EprogramStatus', { keyPath: 'key' });

      prState.createIndex('value', 'value', { unique: true });
    }

    //  END:  EprogramStatus
    // ----------------------------------------------------------
    // START: EAdminLevels

    // if (!db.objectStoreNames.contains('programs')) {
    //   const aLevel = db.createObjectStore('EAdminLevels', { keyPath: 'key' });

    //   aLevel.createIndex('value', 'value', { unique: true });
    // }

    //  END:  EAdminLevels
    // ----------------------------------------------------------

    console.groupEnd();
};

const migrateData : IDBPmigrate = async (
  db : IDBPDatabase,
  version : number,
) : Promise<void> => {
  const dbVersion = await db.get('_meta', 'version');

  if (typeof dbVersion !== 'string' || parseInt(dbVersion, 10) < version) {
    const loggerData = await globalThis.fetch('/data/firing-logger.json');

    if (loggerData.ok === true)  {
      const data = await loggerData.json();
      // console.log('data:', data);

      populateEmptyEnumSlice(
        db,
        { version, date: new Date().toISOString() },
        '_meta',
        'replace',
      );

      populateEmptySlice(db, data.users, 'users');
      populateEmptySlice(db, data.kilns, 'kilns');
      populateEmptySlice(db, data.programs, 'programs');
      populateEmptyEnumSlice(db, data.EfiringType, 'EfiringType');
      populateEmptyEnumSlice(db, data.EprogramState, 'EprogramState');
      populateEmptyEnumSlice(db, data.EkilnFiringState, 'EkilnFiringState');
      populateEmptyEnumSlice(db, data.EtemperatureState, 'EtemperatureState');
      populateEmptyEnumSlice(db, data.EfuelSource, 'EfuelSource');
      populateEmptyEnumSlice(db, data.EkilnType, 'EkilnType');
      populateEmptyEnumSlice(db, data.EequipmentLogType, 'EequipmentLogType');
      populateEmptyEnumSlice(db, data.EprogramStatus, 'EprogramStatus');
    }

    const coneData = await globalThis.fetch('/data/orton-cones.json');

    if (coneData.ok === true)  {
      const data = await coneData.json();
      // console.log('data:', data);

      populateEmptySlice(db, data, 'cones');
    }
  }
}

const actions = {
  getLoggedInUser: getAuthUser,
  updateLoggedInUser: updateAuthUser,
};

export const getDataStoreClassSingleton = (
  readyWatcher : FReadyWatcher | null = null,
) : Promise<CDataStoreClass> => {
  if (store !== null) {
    return Promise.resolve(store);
  }

  store = new PidbDataStore(
    (typeof import.meta.env?.VITE_DB_NAME === 'string' && import.meta.env.VITE_DB_NAME.trim() !== '')
      ? import.meta.env.VITE_DB_NAME
      : 'firing-logger',
    (typeof import.meta.env?.VITE_DB_VERSION === 'string' && /^\d+$/.test(import.meta.env.VITE_DB_VERSION))
      ? parseInt(import.meta.env.VITE_DB_VERSION, 10)
      : 1,
    upgradeSchema,
    migrateData,
    actions,
  );

  if (readyWatcher !== null) {
    store.watchReady(readyWatcher);
  }

  return new Promise((resolve, _reject) => {
    (store as PidbDataStore).watchReady((_isReady : boolean) => {
      resolve(store as PidbDataStore);
    })
  });
};
