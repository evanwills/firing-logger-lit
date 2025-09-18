import { nanoid } from "nanoid";
import type { CDataStoreClass, FReadyWatcher, TStoreAction, TStoreSlice } from "../types/store.d.ts";
// import { splitSlice } from "../utils/store.utils.ts";
import type { ID } from "../types/data-simple.d.ts";
import { getOnError, getOnSuccess, populateEnumSlice, populateSlice } from "./idb-data-store.utils.ts";
import { emptyOrNull } from "../utils/data.utils.ts";

let store : CDataStoreClass | null = null;

type getDbOutput = {
  db : IDBDatabase, populate: boolean;
};

export class IdbDataStore implements CDataStoreClass {
  _db : IDBDatabase | null = null;
  _loading : boolean = false;
  _ready : boolean = false;

  _readyWatchers : FReadyWatcher[] = [];

  constructor(
  ) {
    this._readyWatchers = [];
    if (this._loading === false) {
      this._loading = true;
      const context = this;
      this._getDB().then(({ db, populate }) : void => {
        // console.group('IdbDataStore.constructor._getDB.then()');
        // console.log('db:', db);
        // console.log('populate:', populate);
        context._db = db;
        let c = 0;

        if (populate === true) {
          globalThis.fetch('/data/firing-logger.json').then(async (response) => {
            if (response.ok === true)  {
              const data = await response.json();
              // console.log('data:', data);

              populateSlice(db, data.users, 'users');
              populateSlice(db, data.kilns, 'kilns');
              populateSlice(db, data.programs, 'programs');
              populateEnumSlice(db, data.EfiringType, 'EfiringType');
              populateEnumSlice(db, data.EprogramState, 'EprogramState');
              populateEnumSlice(db, data.EkilnFiringState, 'EkilnFiringState');
              populateEnumSlice(db, data.EtemperatureState, 'EtemperatureState');
              populateEnumSlice(db, data.Eview, 'Eview');
              populateEnumSlice(db, data.EfuelSource, 'EfuelSource');
              populateEnumSlice(db, data.EkilnType, 'EkilnType');
              populateEnumSlice(db, data.EequipmentLogType, 'EequipmentLogType');
              populateEnumSlice(db, data.EprogramStatus, 'EprogramStatus');
              // populateEnumSlice(db, data.EAdminLevels, 'EAdminLevels');
              c += 1;

              context._callReadyWatchers(c);
            }
          });
          globalThis.fetch('/data/orton-cones.json').then(async (response) => {
            if (response.ok === true)  {
              const data = await response.json();
              // console.log('data:', data);

              populateSlice((db as IDBDatabase), data, 'cones');

              c += 1;

              context._callReadyWatchers(c);
            }
          });
        } else {
          context._callReadyWatchers(2);
        }
        // console.groupEnd();
      });
    }
  }

  _callReadyWatchers(c : number) : void {
    console
    if (c === 2 && this._readyWatchers !== null) {
      for (const cb of this._readyWatchers) {
        cb(true);
      }
      this._ready = true;
      this._readyWatchers = [];
    }
  }

  _getDB() : Promise<getDbOutput> {
    if (this._db === null) {
      this._loading = true;

      return new Promise((resolve, reject) => {
        const request : IDBOpenDBRequest = globalThis.indexedDB.open('firingLogger', 1);

        request.onsuccess = (event : Event) : void => {
          if (typeof event.target !== 'undefined' && event.target !== null
            && typeof (event.target as IDBOpenDBRequest).result !== 'undefined'
          ) {
            resolve({
              db: (event.target as IDBOpenDBRequest).result,
              populate: false,
            });
          }
        };

        request.onerror = (e : Event) : void => {
          console.error('Error:', e);
          reject(
            'IdbDataStore failed to initiate connnection to '
            + 'IndexedDB store: "firingLogger"',
          );
        };

        request.onupgradeneeded = (event : Event) : void => {
          const db = (event.target as IDBOpenDBRequest).result;

          // ----------------------------------------------------------
          // START: users

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

          //  END:  firings
          // ----------------------------------------------------------
          // START: kilns

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

          //  END:  kilns
          // ----------------------------------------------------------
          // START: programs

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

          //  END:  programs
          // ----------------------------------------------------------
          // START: firings

          const firings = db.createObjectStore('firings', { keyPath: 'id' });
          firings.createIndex('kilnID', 'kilnID', { unique: false });
          firings.createIndex('programID', 'programID', { unique: false });
          firings.createIndex('diaryID', 'diaryID', { unique: false });
          firings.createIndex('firingType', 'firingType', { unique: false });
          firings.createIndex('firingState', 'firingState', { unique: false });
          firings.createIndex('maxTemp', 'maxTemp', { unique: false });
          firings.createIndex('cone', 'cone', { unique: false });
          firings.createIndex('responsibleID', 'responsibleID', { unique: false });

          //  END:  firings
          // ----------------------------------------------------------
          // START: cones

          const cones = db.createObjectStore('cones', { keyPath: 'id' });
          cones.createIndex('cone', 'cone', { unique: false });
          cones.createIndex('rate', 'rate', { unique: false });
          cones.createIndex('temp', 'temp', { unique: false });

          //  END:  cones
          // ----------------------------------------------------------
          // START: EfiringType

          const ftype = db.createObjectStore('EfiringType', { keyPath: 'key' });
          ftype.createIndex('value', 'value', { unique: true });

          //  END:  EfiringType
          // ----------------------------------------------------------
          // START: EprogramState

          const pState = db.createObjectStore('EprogramState', { keyPath: 'key' });
          pState.createIndex('value', 'value', { unique: true });

          //  END:  EprogramState
          // ----------------------------------------------------------
          // START: EkilnFiringState

          const kfState = db.createObjectStore('EkilnFiringState', { keyPath: 'key' });
          kfState.createIndex('value', 'value', { unique: true });

          //  END:  EkilnFiringState
          // ----------------------------------------------------------
          // START: EtemperatureState

          const tState = db.createObjectStore('EtemperatureState', { keyPath: 'key' });
          tState.createIndex('value', 'value', { unique: true });

          //  END:  EtemperatureState
          // ----------------------------------------------------------
          // START: EfuelSource

          const fSource = db.createObjectStore('EfuelSource', { keyPath: 'key' });
          fSource.createIndex('value', 'value', { unique: true });

          //  END:  EfuelSource
          // ----------------------------------------------------------
          // START: EkilnType

          const kType = db.createObjectStore('EkilnType', { keyPath: 'key' });
          kType.createIndex('value', 'value', { unique: true });

          //  END:  EkilnType
          // ----------------------------------------------------------
          // START: EequipmentLogType

          const elType = db.createObjectStore('EequipmentLogType', { keyPath: 'key' });
          elType.createIndex('value', 'value', { unique: true });

          //  END:  EequipmentLogType
          // ----------------------------------------------------------
          // START: EprogramStatus

          const prState = db.createObjectStore('EprogramStatus', { keyPath: 'key' });
          prState.createIndex('value', 'value', { unique: true });

          //  END:  EprogramStatus
          // ----------------------------------------------------------
          // START: EAdminLevels

          // const aLevel = db.createObjectStore('EAdminLevels', { keyPath: 'key' });
          // aLevel.createIndex('value', 'value', { unique: true });

          //  END:  EAdminLevels
          // ----------------------------------------------------------
          // START: Eview

          const view = db.createObjectStore('Eview', { keyPath: 'key' });
          view.createIndex('value', 'value', { unique: true });

          //  END:  Eview
          // ----------------------------------------------------------

          // console.groupEnd();

          resolve({ db, populate: true });
        };
        // console.groupEnd();
      });
    }


    return Promise.resolve({ db: this._db, populate: false });
  }
  get ready() { return this._ready; }
  get loading() { return this._loading; }

  /**
   *
   * @param slice Dot separated string for hierrarchical store segment
   * @returns What ever data is held within the store segment
   * @throws {Error} If slice is a non-empty string and
   */
  async read(
    slice: string = '',
    selector : string = '',
    outputMode : string[] | boolean = false,
  ) : Promise<any> {
    await this._getDB();

    return new Promise((resolve, reject) => {
      this._getDB().then(({ db }) => {
        // console.group('IdbDataStore.read()');
        // console.log('slice:', slice);
        // console.log('selector:', selector);
        // console.log('outputMode:', outputMode);

        const store = db.transaction(slice, 'readonly').objectStore(slice);

        if (emptyOrNull(selector)) {
          const request = store.getAll();

          request.onsuccess = getOnSuccess(resolve, outputMode);

          request.onerror = getOnError(reject)
        } else if (selector.startsWith('#')) {
          const request = store.get(selector.substring(1));

          request.onsuccess = getOnSuccess(resolve, outputMode);

          request.onerror = getOnError(reject)
        } else if (selector.includes('=')) {
          const [key, value] = selector.split('=');
          // console.log('slice:', slice);
          // console.log('selector:', selector);
          // console.log('key:', key);
          // console.log('value:', value);
          const index = store.index(key);
          // console.log('index:', index);

          const request = index.getAll(value);
          // console.log('request:', request);

          request.onsuccess = getOnSuccess(resolve, outputMode);

          request.onerror = getOnError(reject)
        } else {
          console.group('IdbDataStore.read()');
          console.warn('Not sure how we got here');
          console.log('outputMode:', outputMode);
          console.groupEnd()
        }
        // console.groupEnd();
      });
    });
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
    _payload: any,
  ) : Promise<any> {
    return Promise.resolve();
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
  ) : string {
    const id = nanoid(10);
    // const _slice = splitSlice(slice);

    return id;
  }

  /**
   * Stop watching for a particular action
   *
   * @param watchID ID of watcher that is no longer needed
   *
   * @returns TRUE if watcher was removed.
   *          FALSE otherwise
   */
  ignore(_watchID : string) : boolean {
    return false;
  }


  watchReady(callback : FReadyWatcher) : void {
    this._readyWatchers?.push(callback);
  }
}

export const getDataStoreClassSingleton = (
  readyWatcher : FReadyWatcher | null = null,
) : Promise<CDataStoreClass> => {
  if (store !== null) {
    return Promise.resolve(store);
  }

  store = new IdbDataStore();

  if (readyWatcher !== null) {
    store.watchReady(readyWatcher);
  }

  return new Promise((resolve, _reject) => {
    (store as IdbDataStore).watchReady((_isReady : boolean) => {
      console.group('getDataStoreClassSingleton().readyWatcher()');
      console.log('_isReady:', _isReady);
      console.groupEnd();
      resolve(store as IdbDataStore);
    })
  });
};
