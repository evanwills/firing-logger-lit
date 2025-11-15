import type { IDBPDatabase } from 'idb';
import type { ID, IIdObject, IKeyValPair, IKeyValue } from './data-simple.d.ts';
import type { FValidateThing, IKiln, IUser } from './data.d.ts';
import type PidbDataStore from "../store/PidbDataStore.class.ts";
import type { TUserNowLaterAuth } from './users';


export type DBTypes = DBSchema | unknown;

/**
 * TStoreSlice is a dot-separated string matching the following regular expression pattern
 *
 * /^[a-z\d]+(?:[A-Z]+[a-z\d]*)*(?:\.(?:#[A-Za-z\d_-]{16}|@\d+\d+|[a-z\d]+(?:[A-Z]+[a-z\d]*)*))*$/
 *
 * If the preceeding slice segment is an array, an ID can be used to
 * select a specific item from the array.
 *
 * object property (camel case /^[a-z\d]+(?:[A-Z]+[a-z\d]*)*$/)
 * Array item ID (/^#[a-z\d_-]{16}$/i)
 * Array pagination set (/^@\d+\d+$/)
 */
export type TStoreSlice = string;

export type TStoreAction = 'setLoggedInUser' | 'fetchLatest' | 'replace' | 'append'
  | 'fetchLatestKilns' | 'getKilnEditData' | 'getKilnViewData' | 'updateKiln' | 'addKiln'
  | 'fetchLatestPrograms' | 'getProgramData' | 'addProgram' | 'superseedProgram' | 'updateProgram'
  | 'addToProgramList' | 'getProgramList' | 'updateProgramList'
  | 'fetchLatestFirings' | 'addNewFiringData' | 'updateFiringData' | 'deleteFiringDelete' | 'addToFiringList' | 'updateFiringList' | 'addFiringLogEntry'
  | 'fetchLatestusers' | 'addUser' | 'updateUser' | 'setUserPreferences' | 'clearNoAuthChanges' | 'saveChangeOnHold' | 'reapplyChangesOnHold';

/**
 * CDataStoreClass calls `FReadyWatcher()`s when the data store is
 * ready to use or when it knows it will never be ready because it
 * was unnable to populate the data store with any values.
 * (Probably due to a failed fetch request)
 *
 * @param isReady whether or not the store can be used at all
 */
export type FReadyWatcher = (isReady: boolean) => void;

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
export type FDataStoreDispatch = (action : string, payload: unknown = null) => Promise<unknown>;

export type FActionHandler = (db : CDataStoreClass, payload: unknown = null) => Promise<unknown>

export interface TActionList extends IKeyValue {
  [key:string] : FActionHandler
};

export interface IRedirectDataNew {
  id: ID,
  firing?: boolean,
  kiln?: boolean,
  program?: boolean,
  url: string,
  user?: boolean
};

export interface IRedirectData {
  id: ID,
  firing: boolean,
  kiln: boolean,
  program: boolean,
  url: string,
  user: boolean
};

// --------------------------------------------------------
// START: IndexedDB only types

/**
 * FIdbUpgrade() is a function that is called when IndexedDB fires
 * an `onupgradeneeded` event
 *
 * @param db IndexedDB database connection
 *
 * @returns `TRUE` if the database needs to be populated and
 *          `FALSE` if the DB is already populated.
 */
export type FIdbUpgrade = (db : IDBDatabase | IDBPDatabase) => boolean

/**
 * FIdbPopulate() populates an IndexedDB data store
 *
 * It is only called after `FIdbUpgrade()` has executed and only if
 * `FIdbUpgrade()` returned `TRUE` (indicating that the store needs
 * to be populated)
 *
 * It does whatever is needed (includinng fetching data from the
 * server) to populate the store created by `FIdbUpgrade()`.
 *
 * @param db IndexedDB database connection
 *
 * @returns `TRUE` if the database has been successfully populated.
 *          `FALSE` if not.
 */
export type FIdbPopulate = (db : IDBDatabase | IDBPDatabase) => Promise<boolean>

//  END:  IndexedDB only types
// --------------------------------------------------------

/**
 * CDataStoreClass provides access to a local database with wa
 *
 * It is intended to be used as a singleton, with no public access
 * to the CDataStoreClass constructor.
 *
 * @class CDataStoreClass
 */
export type CDataStoreClass = {
  ready: boolean,
  loading: boolean,
  db: IDBPDatabase | null,

  // ------------------------------------------------------
  // START: proxy methods
  // (see https://github.com/jakearchibald/idb/blob/main/src/entry.ts)

  /**
   * Start a new transaction.
   *
   * @param storeNames The object store(s) this transaction needs.
   * @param mode
   * @param options
   */
  transaction<
    Name extends StoreNames<DBTypes>,
    Mode extends IDBTransactionMode = 'readonly',
  >(
    storeNames: Name,
    mode?: Mode,
    options?: IDBTransactionOptions,
  ): IDBPTransaction<DBTypes, [Name], Mode>;

  transaction<
    Names extends ArrayLike<StoreNames<DBTypes>>,
    Mode extends IDBTransactionMode = 'readonly',
  >(
    storeNames: Names,
    mode?: Mode,
    options?: IDBTransactionOptions,
  ): IDBPTransaction<DBTypes, Names, Mode>;

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
  ): Promise<StoreKey<DBTypes, Name>>;

  /**
   * Deletes all records in a store.
   *
   * This is a shortcut that creates a transaction for this single action. If you need to do more
   * than one action, create a transaction instead.
   *
   * @param storeName Name of the store.
   */
  clear(name: StoreNames<DBTypes>): Promise<void>;

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
  ): Promise<number>;

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
  ): Promise<number>;

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
  ): Promise<void>;

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
  ): Promise<StoreValue<DBTypes, Name> | undefined>;

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
  ): Promise<StoreValue<DBTypes, Name> | undefined>;

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
  ): Promise<StoreValue<DBTypes, Name>[]>;

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
  ): Promise<StoreValue<DBTypes, Name>[]>;

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
  ): Promise<StoreKey<DBTypes, Name>[]>;

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
  ): Promise<StoreKey<DBTypes, Name>[]>;

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
  ): Promise<StoreKey<DBTypes, Name> | undefined>;

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
  ): Promise<StoreKey<DBTypes, Name> | undefined>;

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
  ): Promise<StoreKey<DBTypes, Name>>;

  //  END:  proxy getters
  // ------------------------------------------------------
  // START: public methods

  /**
   * Read data from the store
   *
   * @param slice      Name of top level store slice
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
  read(
    slice : TStoreSlice,
    selector : string = '',
    outputMode : string[] | boolean = false
  ) : Promise<unknown>,

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
  dispatch : FDataStoreDispatch,

  /**
   * Reset the entire data store
   *
   * @returns Promise that resolves when the store has been reset
   */
  resetDataStore() : Promise<void>,

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
    action : string,
    handler: (slice: unknown) => void,
    slice: TStoreSlice,
  ) : ID,

  /**
   * Stop watching for a particular action
   *
   * @param watchID ID of watcher that is no longer needed
   *
   * @returns TRUE if watcher was removed.
   *          FALSE otherwise
   */
  ignore(watchID: ID) : boolean,

  watchReady(callback : FReadyWatcher) : void,

  //  END:  public methods
  // ------------------------------------------------------
};

export type FDataStoreSingleton = () => Promise<CDataStoreClass>;

export type TDataStore = {
  users: IUser[],
  kilns: IKiln[],
  programs: IProgram[],
  firings: FiringLog[]
  cones: TConeData[],
  EfiringType: IKeyValPair[],
  EprogramState: IKeyValPair[],
  EkilnReadyStatus: IKeyValPair[],
  EtemperatureState: IKeyValPair[],
  EfuelSource: IKeyValPair[],
  EequipmentLogType: IKeyValPair[],
  EprogramStatus: IKeyValPair[],
  EAdminLevels: IKeyValPair[],
};

/**
 * When a user's session has expired, their updates cannot be applied
 * but we don't want to loose their changes so we store the values to
 * be later reinstated
 *
 * @property `timestamp`  The time when the changes were submitted
 * @property `store`      The name of the store the changes apply to
 * @property `userID`     The ID of the user that submitted the
 *                        changes
 * @property `changes`    The new values to be applied to the store
 * @property `iniitalVal` The original values that will be over
 *                        written (used for conflict resolution).
 */
export type TNoAuthChanges = {
  timestamp: number,
  store: string,
  userID: ID,
  mode: 'edit' | 'new' | 'copy' | 'delete'
  changes: IIdObject,
  initalVal: IIdObject,
}

// --------------------------------------------------------
// START: IndexedDB only types

/**
 * FIdbUpgrade() is a function that is called when IndexedDB fires
 * an `onupgradeneeded` event
 *
 * @param db IndexedDB database connection
 *
 * @returns `TRUE` if the database needs to be populated and
 *          `FALSE` if the DB is already populated.
 */
export type FIdbUpgrade = (db : IDBDatabase | IDBPDatabase) => boolean

/**
 * FIdbPopulate() populates an IndexedDB data store
 *
 * It is only called after `FIdbUpgrade()` has executed and only if
 * `FIdbUpgrade()` returned `TRUE` (indicating that the store needs
 * to be populated)
 *
 * It does whatever is needed (includinng fetching data from the
 * server) to populate the store created by `FIdbUpgrade()`.
 *
 * @param db IndexedDB database connection
 *
 * @returns `TRUE` if the database has been successfully populated.
 *          `FALSE` if not.
 */
export type FIdbPopulate = (db : IDBDatabase | IDBPDatabase) => Promise<boolean>

//  END:  IndexedDB only types
// --------------------------------------------------------

export interface IUpdateHelperData extends TUserNowLaterAuth {
  hold: boolean,
  thing: unknown,
  user: TUser,
}

export type TUpdateHelperOptions = {
  action? : string,
  allowed? : string,
  newData? : unknown,
  id? : ID
  permissionLevel? : number,
  type? : string,
  validateThing? : FValidateThing,
}
