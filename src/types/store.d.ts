import type { IDBPDatabase } from 'idb';
import type { ID, IKeyValPair, IKeyValue } from './data-simple.d.ts';
import type { IKiln, IUser } from './data.d.ts';

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

export type TStoreAction = 'setLoggedInUser' | 'updateKiln' | 'addKiln' | 'replace' | 'append'

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
export type FDataStoreAction = (
  action : TStoreAction,
  payload: any = null,
) => Promise<any>;

export type FActionHandler = (payload: any) => Promise<any>

export interface TActionList extends IKeyValue {
  [key:TStoreAction] : FActionHandler
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
  read: (
    slice : TStoreSlice,
    selector : string = '',
    outputMode : string[] | boolean = false
  ) => Promise<any>,

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
  action : FDataStoreAction,

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
  watch: (
    action : TStoreAction,
    handler: (slice: any) => void,
    slice: TStoreSlice,
  ) => ID,

  /**
   * Stop watching for a particular action
   *
   * @param watchID ID of watcher that is no longer needed
   *
   * @returns TRUE if watcher was removed.
   *          FALSE otherwise
   */
  ignore: (watchID: ID) => boolean,

  watchReady : (callback : FReadyWatcher) => void,
};

export type FDataStoreSingleton = () => Promise<CDataStoreClass>;

export type TDataStore = {
  users: IUser[],
  kilns: IKiln[],
  programs: IStoredFiringProgram[],
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
