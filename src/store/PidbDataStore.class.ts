import { openDB, type IDBPDatabase, type IDBPTransaction, type IndexKey, type IndexNames, type StoreKey, type StoreNames, type StoreValue } from 'idb';
import type {
  CDataStoreClass,
  DBTypes,
  FActionHandler,
  // FDataStoreDispatch,
  FReadyWatcher,
  TActionList,
  // TStoreAction,
  TStoreSlice,
} from '../types/store.d.ts';
import type { ID } from '../types/data-simple.d.ts';
import {
  getByKeyValue,
  outputAs,
  parseKeyValSelector,
} from './PidbDataStore.utils.ts';
import type { IDBPmigrate, IDBPupgrade } from '../types/pidb.d.ts';

/**
 * Check whether a value is empty or null
 *
 * @param input value to be tested
 *
 * @returns TRUE if input is undefined, NULL or empty string
 */
const emptyOrNull = (input : unknown) : boolean => (typeof input === 'undefined'
  || input === null
  || input === 0
  || (typeof input === 'string' && input.trim() === ''));

const noDB = () => Promise.reject('IndexedDB Data store is undefined');

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

  _bindForLater(
    action : FActionHandler,
    // deno-lint-ignore no-explicit-any
    payload: any = null,
    PIDB: boolean = true,
    // deno-lint-ignore no-explicit-any
  ) : () => Promise<any> {
    return () => {
      const db = (PIDB === true && this._db !== null)
        ? this._db
        : this;
      return action(db, payload);
    }
  }

  //  END:  private methods
  // ------------------------------------------------------
  // START: class getters

  get ready() : boolean { return this._ready && this._db !== null; }

  get loading() : boolean { return this._loading; }

  get db() : IDBPDatabase | null { return this._db; }

  //  END:  class getters
  // ------------------------------------------------------
  // START: proxy methods

  /**
   * Start a new transaction.
   *
   * @param storeNames The object store(s) this transaction needs.
   * @param mode
   * @param options
   */
  transaction<
    Name extends StoreNames<DBTypes>,
    Names extends ArrayLike<StoreNames<DBTypes>>,
    Mode extends IDBTransactionMode = 'readonly',
  >(
    storeNames: Name | Names,
    mode?: Mode,
    options?: IDBTransactionOptions,
  ): IDBPTransaction<DBTypes, Name[] | Names, Mode> {
    if (this._db !== null) {
      return this._db.transaction(storeNames, mode, options)
    }

    throw new TypeError('IndexedDB Data store is undefined');
  }

  /**
   * Add a value to a store.
   *
   * Rejects if an item of a given key already exists in the store.
   *
   * This is a shortcut that creates a transaction for this single action. If you need to do more
   * than one action, create a transaction instead.
   *
   * @param storeName Name of the store.
   * @param value
   * @param key
   */
  add<Name extends StoreNames<DBTypes>>(
    storeName: Name,
    value: StoreValue<DBTypes, Name>,
    key?: StoreKey<DBTypes, Name> | IDBKeyRange,
  ): Promise<StoreKey<DBTypes, Name>> {
    return (this._db !== null)
      ? this._db.add(storeName, value, key)
      : noDB();
  }

  /**
   * Deletes all records in a store.
   *
   * This is a shortcut that creates a transaction for this single action. If you need to do more
   * than one action, create a transaction instead.
   *
   * @param storeName Name of the store.
   */
  clear(storeName: StoreNames<DBTypes>): Promise<void> {
    return (this._db !== null)
      ? this._db.clear(storeName)
      : noDB();
  }

  /**
   * Retrieves the number of records matching the given query in a store.
   *
   * This is a shortcut that creates a transaction for this single action. If you need to do more
   * than one action, create a transaction instead.
   *
   * @param storeName Name of the store.
   * @param key
   */
  count<Name extends StoreNames<DBTypes>>(
    storeName: Name,
    key?: StoreKey<DBTypes, Name> | IDBKeyRange | null,
  ): Promise<number> {
    return (this._db !== null)
      ? this._db.count(storeName, key)
      : noDB();
  }

  /**
   * Retrieves the number of records matching the given query in an index.
   *
   * This is a shortcut that creates a transaction for this single action. If you need to do more
   * than one action, create a transaction instead.
   *
   * @param storeName Name of the store.
   * @param indexName Name of the index within the store.
   * @param key
   */
  countFromIndex<
    Name extends StoreNames<DBTypes>,
    IndexName extends IndexNames<DBTypes, Name>,
  >(
    storeName: Name,
    indexName: IndexName,
    key?: IndexKey<DBTypes, Name, IndexName> | IDBKeyRange | null,
  ): Promise<number> {
    return (this._db !== null)
      ? this._db.countFromIndex(storeName, indexName, key)
      : noDB();
  }

  /**
   * Deletes records in a store matching the given query.
   *
   * This is a shortcut that creates a transaction for this single action. If you need to do more
   * than one action, create a transaction instead.
   *
   * @param storeName Name of the store.
   * @param key
   */
  delete<Name extends StoreNames<DBTypes>>(
    storeName: Name,
    key: StoreKey<DBTypes, Name> | IDBKeyRange,
  ): Promise<void> {
    return (this._db !== null)
      ? this._db.delete(storeName, key)
      : noDB();
  }

  /**
   * Retrieves the value of the first record in a store matching the query.
   *
   * Resolves with undefined if no match is found.
   *
   * This is a shortcut that creates a transaction for this single action. If you need to do more
   * than one action, create a transaction instead.
   *
   * @param storeName Name of the store.
   * @param query
   */
  get<Name extends StoreNames<DBTypes>>(
    storeName: Name,
    query: StoreKey<DBTypes, Name> | IDBKeyRange,
  ): Promise<StoreValue<DBTypes, Name> | undefined> {
    return (this._db !== null)
      ? this._db.get(storeName, query)
      : noDB();
  }

  /**
   * Retrieves the value of the first record in an index matching the query.
   *
   * Resolves with undefined if no match is found.
   *
   * This is a shortcut that creates a transaction for this single action. If you need to do more
   * than one action, create a transaction instead.
   *
   * @param storeName Name of the store.
   * @param indexName Name of the index within the store.
   * @param query
   */
  getFromIndex<
    Name extends StoreNames<DBTypes>,
    IndexName extends IndexNames<DBTypes, Name>,
  >(
    storeName: Name,
    indexName: IndexName,
    query: IndexKey<DBTypes, Name, IndexName> | IDBKeyRange,
  ): Promise<StoreValue<DBTypes, Name> | undefined> {
    return (this._db !== null)
      ? this._db.getFromIndex(storeName, indexName, query)
      : noDB();
  }

  /**
   * Retrieves all values in a store that match the query.
   *
   * This is a shortcut that creates a transaction for this single action. If you need to do more
   * than one action, create a transaction instead.
   *
   * @param storeName Name of the store.
   * @param query
   * @param count Maximum number of values to return.
   */
  getAll<Name extends StoreNames<DBTypes>>(
    storeName: Name,
    query?: StoreKey<DBTypes, Name> | IDBKeyRange | null,
    count?: number,
  ): Promise<StoreValue<DBTypes, Name>[]> {
    return (this._db !== null)
      ? this._db.getAll(storeName, query, count)
      : noDB();
  }

  /**
   * Retrieves all values in an index that match the query.
   *
   * This is a shortcut that creates a transaction for this single action. If you need to do more
   * than one action, create a transaction instead.
   *
   * @param storeName Name of the store.
   * @param indexName Name of the index within the store.
   * @param query
   * @param count Maximum number of values to return.
   */
  getAllFromIndex<
    Name extends StoreNames<DBTypes>,
    IndexName extends IndexNames<DBTypes, Name>,
  >(
    storeName: Name,
    indexName: IndexName,
    query?: IndexKey<DBTypes, Name, IndexName> | IDBKeyRange | null,
    count?: number,
  ): Promise<StoreValue<DBTypes, Name>[]> {
    return (this._db !== null)
      ? this._db.getAllFromIndex(storeName, indexName, query, count)
      : noDB();
  }

  /**
   * Retrieves the keys of records in a store matching the query.
   *
   * This is a shortcut that creates a transaction for this single action. If you need to do more
   * than one action, create a transaction instead.
   *
   * @param storeName Name of the store.
   * @param query
   * @param count Maximum number of keys to return.
   */
  getAllKeys<Name extends StoreNames<DBTypes>>(
    storeName: Name,
    query?: StoreKey<DBTypes, Name> | IDBKeyRange | null,
    count?: number,
  ): Promise<StoreKey<DBTypes, Name>[]> {
    return (this._db !== null)
      ? this._db.getAllKeys(storeName, query, count)
      : noDB();
  }

  /**
   * Retrieves the keys of records in an index matching the query.
   *
   * This is a shortcut that creates a transaction for this single action. If you need to do more
   * than one action, create a transaction instead.
   *
   * @param storeName Name of the store.
   * @param indexName Name of the index within the store.
   * @param query
   * @param count Maximum number of keys to return.
   */
  getAllKeysFromIndex<
    Name extends StoreNames<DBTypes>,
    IndexName extends IndexNames<DBTypes, Name>,
  >(
    storeName: Name,
    indexName: IndexName,
    query?: IndexKey<DBTypes, Name, IndexName> | IDBKeyRange | null,
    count?: number,
  ): Promise<StoreKey<DBTypes, Name>[]> {
    return (this._db !== null)
      ? this._db.getAllKeysFromIndex(storeName, indexName, query, count)
      : noDB();
  }

  /**
   * Retrieves the key of the first record in a store that matches the query.
   *
   * Resolves with undefined if no match is found.
   *
   * This is a shortcut that creates a transaction for this single action. If you need to do more
   * than one action, create a transaction instead.
   *
   * @param storeName Name of the store.
   * @param query
   */
  getKey<Name extends StoreNames<DBTypes>>(
    storeName: Name,
    query: StoreKey<DBTypes, Name> | IDBKeyRange,
  ): Promise<StoreKey<DBTypes, Name> | undefined> {
    return (this._db !== null)
      ? this._db.getKey(storeName, query)
      : noDB();
  }

  /**
   * Retrieves the key of the first record in an index that matches the query.
   *
   * Resolves with undefined if no match is found.
   *
   * This is a shortcut that creates a transaction for this single action. If you need to do more
   * than one action, create a transaction instead.
   *
   * @param storeName Name of the store.
   * @param indexName Name of the index within the store.
   * @param query
   */
  getKeyFromIndex<
    Name extends StoreNames<DBTypes>,
    IndexName extends IndexNames<DBTypes, Name>,
  >(
    storeName: Name,
    indexName: IndexName,
    query: IndexKey<DBTypes, Name, IndexName> | IDBKeyRange,
  ): Promise<StoreKey<DBTypes, Name> | undefined> {
    return (this._db !== null)
      ? this._db.getKeyFromIndex(storeName, indexName, query)
      : noDB();
  }

  /**
   * Put an item in the database.
   *
   * Replaces any item with the same key.
   *
   * This is a shortcut that creates a transaction for this single action. If you need to do more
   * than one action, create a transaction instead.
   *
   * @param storeName Name of the store.
   * @param value
   * @param key
   */
  put<Name extends StoreNames<DBTypes>>(
    storeName: Name,
    value: StoreValue<DBTypes, Name>,
    key?: StoreKey<DBTypes, Name> | IDBKeyRange,
  ): Promise<StoreKey<DBTypes, Name>> {
    return (this._db !== null)
      ? this._db.put(storeName, value, key)
      : noDB();
  }

  //  END:  proxy methods
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
  ) : Promise<unknown> {
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
        // console.log('storeName:', storeName);
        // console.log('outputMode:', outputMode);

        // const output = await this._db.getAllFromIndex(storeName, primary.indexName, primary.value).catch(storeCatch);
        const output = await getByKeyValue(this._db, storeName, selector);

        // if (typeof output !== 'undefined')
        // console.log('output:', output);
        // console.groupEnd();

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
   * dispatch() runs a predefined action against the store. Normally,
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
  dispatch(
    action : string,
    payload: unknown = null
  ) : Promise<unknown> {
    // console.group('PidbDataStore.action');
    // console.log('this._db:', this._db);
    // console.log('action:', action);
    // console.log('payload:', payload);
    // console.log('PIDB:', PIDB);
    // console.log('this._actions:', this._actions);
    // console.log(`this._actions.${action}:`, this._actions[action]);
    // console.log(`typeof this._actions.${action}:`, typeof this._actions[action]);

    if (typeof this._actions[action] === 'function') {
      // console.info('Yay!!! We found an action');
      // console.groupEnd();
      if (this._db !== null) {
        return this._actions[action](this, payload);
      } else {
        // deno-lint-ignore no-explicit-any
        const laterAction = () : Promise<any> => {
          return this._actions[action](this, payload);
        };

        this.watchReady(laterAction.bind(this))
        return Promise.resolve(
          'The database is not yet ready. So, we\'ve added a ready '
          + 'watcher for this action.',
        );
      }
    }

    // console.error(`No action found for "${action}"`)
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
    // deno-lint-ignore no-explicit-any
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

  async resetDataStore() : Promise<void> {
    if (this._db !== null) {
      return new Promise<void>((resolve, reject) => {
        const req = indexedDB.deleteDatabase(this._dbName);

        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
        req.onblocked = () => {
          // Occurs if other open connections prevent deletion
          console.warn('IndexedDB delete blocked: close other connections/tabs.');
        };
      });
    }
  }

  //  END:  public methods
  // ------------------------------------------------------
}
