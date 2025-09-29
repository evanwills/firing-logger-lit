import { openDB, type IDBPDatabase } from 'idb';
import type {
  CDataStoreClass,
  FReadyWatcher,
  TActionList,
  TStoreAction,
  TStoreSlice,
} from '../types/store.d.ts';
import type { ID } from '../types/data-simple.d.ts';
import {
  getByKeyValue,
  outputAs,
  parseKeyValSelector,
} from './idb-data-store.utils.ts';
import type { IDBPmigrate, IDBPupgrade } from '../types/pidb.d.ts';

/**
 * Check whether a value is empty or null
 *
 * @param {any} input value to be tested
 *
 * @returns {boolean} TRUE if input is undefined, NULL or empty string
 */
const emptyOrNull = (input : unknown) : boolean => (typeof input === 'undefined'
  || input === null
  || input === 0
  || (typeof input === 'string' && input.trim() === ''));

export default class PidbDataStore implements CDataStoreClass {
  // ------------------------------------------------------
  // START: class private properties

  _db : IDBPDatabase | null = null;
  _loading : boolean = false;
  _populate: boolean = false;
  _ready : boolean = false;
  _dbName : string = '';
  _dbVersion : number = 0;

  _readyWatchers : FReadyWatcher[] = [];
  _actions : TActionList = {};

  //  END:  class private properties
  // ------------------------------------------------------
  // START: class constructor

  constructor(
    dbName : string,
    dbVerion : number,
    upgradeSchema : IDBPupgrade,
    migrateData : IDBPmigrate,
    actions : TActionList,
  ) {
    this._readyWatchers = [];
    this._populate = false;
    this._dbName = dbName;

    this._dbVersion = dbVerion;

    this._initDB(upgradeSchema, migrateData);

    this._actions = { ...actions };
  }

  //  END:  class constructor
  // ------------------------------------------------------
  // START: private methods

  _callReadyWatchers(isReady: boolean) : void {
    for (const readyWatcher of this._readyWatchers) {
      readyWatcher(isReady);
    }
    this._readyWatchers = [];
  }

  async _initDB(upgradeSchema : IDBPupgrade, migrateData : IDBPmigrate) : Promise<void> {
    if (this._db === null && this._loading !== true) {
      this._loading = true;

      this._db = await openDB(
        this._dbName,
        this._dbVersion,
        { upgrade: upgradeSchema },
      );

      await migrateData(this._db, this._dbVersion);

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

  //  END:  private methods
  // ------------------------------------------------------
  // START: class getters

  get ready() : boolean { return this._ready; }

  get loading() : boolean { return this._loading; }

  get db() : IDBPDatabase | null { return this._db; }

  //  END:  class getters
  // ------------------------------------------------------
  // START: public methods

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
        selectors.shift();
        // const primary = selectors.shift();
        // console.group('PidbDataStore.read() (kv)');
        // console.log('selectors:', selectors);
        // console.log('primary:', primary);
        // console.log('storeName:', storeName);

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
   * action() runs a predefined action against the store. Normally,
   * this is used for write actions but it can also be used for
   * complex read requests.
   *
   * @param action  Name of predefined action to be performed on the
   *                store
   * @param payload Data to be written to the store
   *
   * @returns Empty string if write action worked without issue.
   *          Error message string if there was a problem with the
   *          write action
   */
  action(
    action : TStoreAction,
    payload: any = null,
  ) : Promise<any> {
    // console.group('PidbDataStore.action');
    // console.log('action:', action);
    // console.log('payload:', payload);
    // console.log('this._actions:', this._actions);
    // console.log(`this._actions.${action}:`, this._actions[action]);
    // console.log(`typeof this._actions.${action}:`, typeof this._actions[action]);

    if (typeof this._actions[action] === 'function') {
      // console.info('Yay!!! We found an action');
      // console.groupEnd();
      return this._actions[action](this._db, payload);
    }

    // console.error(`Boo!!! No action found for "${action}"`)
    // console.groupEnd();
    return Promise.reject(`No action found for "${action}"`);
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
    if (this._ready === false) {
      this._readyWatchers.push(readyWatcher);
    }
  }

  //  END:  public methods
  // ------------------------------------------------------
}
