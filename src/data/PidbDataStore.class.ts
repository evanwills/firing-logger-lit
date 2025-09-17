import { openDB, type IDBPDatabase } from 'idb';
import type {
  CDataStoreClass,
  FReadyWatcher,
  TStoreAction,
  TStoreSlice,
} from './PidbDataStore.class.ts';
import type { ID } from "./PidbDataStore.class.ts";
import {
  getByKeyValue,
  outputAs,
  parseKeyValSelector,
  populateEnumSlice,
  populateSlice,
  storeCatch,
} from "./idb-data-store.utils.ts";
import { emptyOrNull, isNonEmptyStr } from "../utils/data.utils.ts";

let store : CDataStoreClass | null = null;

const dbName = isNonEmptyStr(import.meta.env, 'VITE_DB_NAME')
  ? import.meta.env.VITE_DB_NAME
  : 'firing-logger';

class PidbDataStore implements CDataStoreClass {
  _db : IDBPDatabase | null = null;
  _loading : boolean = false;
  _populate: boolean = false;
  _ready: boolean = false;

  _readyWatchers : FReadyWatcher[] = [];

  constructor(
  ) {
    this._readyWatchers = [];
    this._populate = false;

    this._initDB();
  }

  _callReadyWatchers(isReady: boolean) : void {
    for (const readyWatcher of this._readyWatchers) {
      readyWatcher(isReady);
    }
    this._readyWatchers = [];
  }

  _upgradeDB(
    db : IDBPDatabase,
    oldV : number,
    newV : number,
    transaction: IDBPTransaction,
    event : Event,
  ) : void {
    console.group('PidbDataStore._upgradeDB()');
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

  async _initDB() : Promise<void> {
    if (this._db === null && this._loading !== true) {
      this._loading = true;

      const _dbs = await globalThis.indexedDB.databases();

      this._db = await openDB(
        dbName,
        1,
        { upgrade: this._upgradeDB.bind(this) }
      );

      if (this._populate === true) {
        await this._populateDB(this._db);
      }

      this._loading = false;
      this._ready = true;

      this._callReadyWatchers(true);
    } else {
      this._ready = !this._loading;

      if (this._ready === true) {
        this._callReadyWatchers(true);
      }
    }
  }

  get ready() { return this._ready; }
  get loading() { return this._loading; }

  /**
   * Read data from the store
   *
   * @param storeName  Name of top level store slice
   * @param selector   Dot separated string for hierrarchical store
   *                   segment
   * @param outputMode (for returned arrays),
   *                   If `outputMode` is a string array, then output
   *                   mode limits the properties included in the
   *                   objects to only the ones listed in `outputMode`
   *                   in the returned array.
   *                   (Usefull when listing a collection items that
   *                   link to detailed view of each item)
   *                   If `outputMode` is `TRUE` then the value
   *                   returned will be a key/value object.
   *
   * @returns What ever data is held within the store segment
   *
   * @throws {Error} If slice is a non-empty string and
   */
  async read(
    storeName : string,
    selector : string = '',
    outputMode : string[] | boolean = false,
  ) : Promise<any> {
    await this._initDB();

    if (this._db !== null) {
      if (emptyOrNull(selector)) {
        return outputAs(this._db.getAll(storeName), outputMode);
      }

      if (selector.startsWith('#')) {
        const output = await this._db.get(storeName, selector.substring(1));

        return outputAs(output, outputMode);
      }

      if (selector.includes('=')) {
        const selectors = parseKeyValSelector(selector);
        const primary = selectors.shift();
        console.group('PidbDataStore.read() (kv)');
        console.log('selectors:', selectors);
        console.log('primary:', primary);
        console.log('storeName:', storeName);

        // const output = await this._db.getAllFromIndex(storeName, primary.indexName, primary.value).catch(storeCatch);
        const output = await getByKeyValue(this._db, storeName, selector);

        // if (typeof output !== 'undefined')
        // console.log('output:', output);

        return outputAs(output, outputMode);
      }

      console.group('IdbDataStore.read()');
      console.warn('Not sure how we got here');
      console.log('outputMode:', outputMode);
      console.groupEnd()
    } else {
      console.group('IdbDataStore.read()');
      console.warn('Database is still NULL (this should never happen)');
      console.groupEnd()
    }

    return null;
  }

  /**
   * Write data to the store
   *
   * @param userID  ID of the user performing the write action
   * @param action  Name of write action to be performed on the store
   * @param slice   Dot separated string for hierrarchical store
   *                segment
   * @param payload Data to be written to the store
   *
   * @returns Empty string if write action worked without issue.
   *          Error message string if there was a problem with the
   *          write action
   */
  write(
    _userID: ID,
    _action : TStoreAction,
    _slice : TStoreAction,
    _payload: any
  ) : Promise<string> {
    return Promise.resolve('');
  }

  /**
   * Add watcher to do something after a successful write action
   *
   * @param action  Name of action to watch for
   * @param handler Handler function to do something with a
   *                particular slice of store after a write action
   *                __NOTE:__ handler is called every time a "write"
   *                          action with the same name is
   *                          successfully executed.
   * @param slice   Dot separated string for hierrarchical store
   *                segment
   *
   * @returns The ID of the newly added watcher, so it can be passed
   *          `ignore()` when the client no longer needs to watch for
   *          that action
   */
  watch(
    _action : string,
    _handler: (slice: any) => void,
    _slice: TStoreSlice,
  ) :ID {
    return '';
  }

  /**
   * Stop watching for a particular action
   *
   * @param watchID ID of watcher that is no longer needed
   *
   * @returns TRUE if watcher was removed.
   *          FALSE otherwise
   */
  ignore(_watchID: ID) : boolean {
    return false;
  }

  watchReady(readyWatcher : FReadyWatcher) : void {
    this._readyWatchers.push(readyWatcher);
  }
}

export const getDataStoreClassSingleton = (
  readyWatcher : FReadyWatcher | null = null,
) : Promise<CDataStoreClass> => {
  if (store !== null) {
    return Promise.resolve(store);
  }

  store = new PidbDataStore();

  if (readyWatcher !== null) {
    store.watchReady(readyWatcher);
  }

  return new Promise((resolve, _reject) => {
    (store as PidbDataStore).watchReady((_isReady : boolean) => {
      resolve(store as PidbDataStore);
    })
  });
};
