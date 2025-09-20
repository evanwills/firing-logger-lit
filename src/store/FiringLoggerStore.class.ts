import { type IDBPDatabase, type IDBPTransaction } from 'idb';
import type {
  CDataStoreClass,
  FReadyWatcher,
  TActionList,
  TStoreAction,
  TStoreSlice,
} from '../types/store.d.ts';
import type { TUser } from '../types/data.d.ts';
import { PidbDataStore } from './PidbDataStore.class.ts';
import {
  populateEnumSlice,
  populateSlice,
  // storeCatch,
} from './idb-data-store.utils.ts';

let store : CDataStoreClass | null = null;

class FileLoggerStore extends PidbDataStore {
  _db : IDBPDatabase | null = null;
  _loading : boolean = false;
  _populate: boolean = false;
  _ready: boolean = false;

  _readyWatchers : FReadyWatcher[] = [];
  _actions : TActionList = {};

  constructor(_dbName : string = '') {
    super(_dbName);

    this._initActions();
  }

  _upgradeDB(
    db : IDBPDatabase,
    oldV : number,
    newV : number,
    transaction: IDBPTransaction,
    event : Event,
  ) : void {
    console.group('FileLoggerStore._upgradeDB()');
    console.log('db:', db);
    console.log('oldV:', oldV);
    console.log('newV:', newV);
    console.log('transaction:', transaction);
    console.log('event:', event);
    // ----------------------------------------------------------
    // START: users

    if (!db.objectStoreNames.contains('users')) {
      this._populate = true;
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

    //  END:  firings
    // ----------------------------------------------------------
    // START: kilns

    if (!db.objectStoreNames.contains('kilns')) {
      this._populate = true;
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
      this._populate = true;
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
      this._populate = true;
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
      this._populate = true;
      const cones = db.createObjectStore('cones', { keyPath: 'id' });

      cones.createIndex('cone', 'cone', { unique: false });
      cones.createIndex('rate', 'rate', { unique: false });
      cones.createIndex('temp', 'temp', { unique: false });
    }

    //  END:  cones
    // ----------------------------------------------------------
    // START: EfiringType

    if (!db.objectStoreNames.contains('EfiringType')) {
      this._populate = true;
      const ftype = db.createObjectStore('EfiringType', { keyPath: 'key' });

      ftype.createIndex('value', 'value', { unique: true });
    }

    //  END:  EfiringType
    // ----------------------------------------------------------
    // START: EprogramState

    if (!db.objectStoreNames.contains('EprogramState')) {
      this._populate = true;
      const pState = db.createObjectStore('EprogramState', { keyPath: 'key' });

      pState.createIndex('value', 'value', { unique: true });
    }

    //  END:  EprogramState
    // ----------------------------------------------------------
    // START: EkilnFiringState

    if (!db.objectStoreNames.contains('EkilnFiringState')) {
      this._populate = true;
      const kfState = db.createObjectStore('EkilnFiringState', { keyPath: 'key' });

      kfState.createIndex('value', 'value', { unique: true });
    }

    //  END:  EkilnFiringState
    // ----------------------------------------------------------
    // START: EtemperatureState

    if (!db.objectStoreNames.contains('EtemperatureState')) {
      this._populate = true;
      const tState = db.createObjectStore('EtemperatureState', { keyPath: 'key' });

      tState.createIndex('value', 'value', { unique: true });
    }

    //  END:  EtemperatureState
    // ----------------------------------------------------------
    // START: EfuelSource

    if (!db.objectStoreNames.contains('EfuelSource')) {
      this._populate = true;
      const fSource = db.createObjectStore('EfuelSource', { keyPath: 'key' });

      fSource.createIndex('value', 'value', { unique: true });
    }

    //  END:  EfuelSource
    // ----------------------------------------------------------
    // START: EkilnType

    if (!db.objectStoreNames.contains('EkilnType')) {
      this._populate = true;
      const kType = db.createObjectStore('EkilnType', { keyPath: 'key' });

      kType.createIndex('value', 'value', { unique: true });
    }

    //  END:  EkilnType
    // ----------------------------------------------------------
    // START: EequipmentLogType

    if (!db.objectStoreNames.contains('EequipmentLogType')) {
      this._populate = true;
      const elType = db.createObjectStore('EequipmentLogType', { keyPath: 'key' });

      elType.createIndex('value', 'value', { unique: true });
    }

    //  END:  EequipmentLogType
    // ----------------------------------------------------------
    // START: EprogramStatus

    if (!db.objectStoreNames.contains('EprogramStatus')) {
      this._populate = true;
      const prState = db.createObjectStore('EprogramStatus', { keyPath: 'key' });

      prState.createIndex('value', 'value', { unique: true });
    }

    //  END:  EprogramStatus
    // ----------------------------------------------------------
    // START: UserPreferences

    if (!db.objectStoreNames.contains('UserPreferences')) {
      this._populate = true;
      db.createObjectStore('UserPreferences', { keyPath: 'key' });
    }

    //  END:  UserPreferences
    // ----------------------------------------------------------
    // START: EAdminLevels

    // if (!db.objectStoreNames.contains('programs')) {
    //   const aLevel = db.createObjectStore('EAdminLevels', { keyPath: 'key' });

    //   aLevel.createIndex('value', 'value', { unique: true });
    // }

    //  END:  EAdminLevels
    // ----------------------------------------------------------

    this._ready = !this._populate;
    console.log('this._populate:', this._populate);
    console.groupEnd();
  }

  async _populateDB(db : IDBPDatabase) : Promise<void> {
    const loggerData = await globalThis.fetch('/data/firing-logger.json');

    if (loggerData.ok === true)  {
      const data = await loggerData.json();
      // console.log('data:', data);

      populateSlice(db, data.users, 'users');
      populateSlice(db, data.kilns, 'kilns');
      populateSlice(db, data.programs, 'programs');
      populateEnumSlice(db, data.EfiringType, 'EfiringType');
      populateEnumSlice(db, data.EprogramState, 'EprogramState');
      populateEnumSlice(db, data.EkilnFiringState, 'EkilnFiringState');
      populateEnumSlice(db, data.EtemperatureState, 'EtemperatureState');
      // populateEnumSlice(db, data.Eview, 'Eview');
      populateEnumSlice(db, data.EfuelSource, 'EfuelSource');
      populateEnumSlice(db, data.EkilnType, 'EkilnType');
      populateEnumSlice(db, data.EequipmentLogType, 'EequipmentLogType');
      populateEnumSlice(db, data.EprogramStatus, 'EprogramStatus');

      populateEnumSlice(db, data.UserPreferences, 'UserPreferences');
      // populateEnumSlice(db, data.EAdminLevels, 'EAdminLevels');
    }

    const coneData = await globalThis.fetch('/data/orton-cones.json');

    if (coneData.ok === true)  {
      const data = await coneData.json();
      // console.log('data:', data);

      populateSlice(db, data, 'cones');
    }

    this._ready = true;
  }

  _initActions(): void {
    // super._initActions();
    this._actions = {
      ...this._actions,
      setLoggedInUser: async (db :IDBPDatabase, user : TUser) : Promise<string> => {
        await populateEnumSlice(db, user, 'UserPreferences', true);
        return user.id;
      }
    }
    console.group('FileLoggerStore._initActions');
    console.log('this._actions:', this._actions);
    console.groupEnd();
  }

//   write(action: TStoreAction, payload: any): Promise<string> {
//     console.group('FileLoggerStore.write');
//     console.log('action:', action);
//     console.log('payload:', payload);
//     console.log('this._actions:', this._actions);
//     console.log(`this._actions.${action}:`, this._actions[action]);
//     console.log(`typeof this._actions.${action}:`, typeof this._actions[action]);

//     if (typeof this._actions[action] === 'function') {
//       console.info('Yay!!! We found an action');
//       console.groupEnd();
//       return this._actions[action](payload);
//     }

//     console.error(`Boo!!! No action found for "${action}"`)
//     console.groupEnd();
//     return Promise.reject(`No action found for "${action}"`);
//   }
}

export const getDataStoreClassSingleton = (
  readyWatcher : FReadyWatcher | null = null,
) : Promise<CDataStoreClass> => {
  if (store !== null) {
    return Promise.resolve(store);
  }

  store = new FileLoggerStore();

  if (readyWatcher !== null) {
    store.watchReady(readyWatcher);
  }

  return new Promise((resolve, _reject) => {
    (store as PidbDataStore).watchReady((_isReady : boolean) => {
      resolve(store as PidbDataStore);
    })
  });
};
