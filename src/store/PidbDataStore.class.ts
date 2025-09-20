import { openDB, type IDBPDatabase, type IDBPTransaction } from 'idb';
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

const defaultDbName = (typeof import.meta.env?.VITE_DB_NAME === 'string' && import.meta.env.VITE_DB_NAME.trim() !== '')
  ? import.meta.env.VITE_DB_NAME
  : 'unknown-db';

const defaultDbVersion = (typeof import.meta.env?.VITE_DB_VERSION === 'string' && /^\d+$/.test(import.meta.env.VITE_DB_VERSION))
  ? parseInt(import.meta.env.VITE_DB_VERSION, 10)
  : 1;

export class PidbDataStore implements CDataStoreClass {
  _db : IDBPDatabase | null = null;
  _loading : boolean = false;
  _populate: boolean = false;
  _ready : boolean = false;
  _dbName : string = '';
  _dbVersion : number = 0;

  _readyWatchers : FReadyWatcher[] = [];
  _actions : TActionList = {};

  constructor(dbName : string = '', dbVerion : number = 0) {
    this._readyWatchers = [];
    this._populate = false;
    this._dbName = (dbName.trim() !== '')
      ? dbName
      : defaultDbName;

    this._dbVersion = (dbVerion > 0)
      ? dbVerion
      : defaultDbVersion;

    this._initDB();
    this._initActions();
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
    console.log('this._populate:', this._populate);
    console.groupEnd();
  }

  async _populateDB(_db : IDBPDatabase) : Promise<void> {
  }

  _initActions() {
    console.group('PidbDataStore._initAction()');
    console.log('this._actions:', this._actions);
    console.groupEnd();
  }

  async _initDB() : Promise<void> {
    if (this._db === null && this._loading !== true) {
      this._loading = true;

      this._db = await openDB(
        this._dbName,
        this._dbVersion,
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
   * Write data to the store
   *
   * @param action  Name of write action to be performed on the store
   * @param payload Data to be written to the store
   *
   * @returns Empty string if write action worked without issue.
   *          Error message string if there was a problem with the
   *          write action
   */
  write(
    action : TStoreAction,
    payload: any
  ) : Promise<string> {
    console.group('PidbDataStore.write');
    console.log('action:', action);
    console.log('payload:', payload);
    console.log('this._actions:', this._actions);
    console.log(`this._actions.${action}:`, this._actions[action]);
    console.log(`typeof this._actions.${action}:`, typeof this._actions[action]);

    if (typeof this._actions[action] === 'function') {
      console.info('Yay!!! We found an action');
      console.groupEnd();
      return this._actions[action](this._db, payload);
    }

    console.error(`Boo!!! No action found for "${action}"`)
    console.groupEnd();
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
}
