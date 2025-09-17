import type { ID, TEnumItem } from './data-simple.d.ts';
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

export type TStoreAction = 'update' | 'replace' | 'append'

/**
 * CDataStoreClass calls FReadyWatchers when the data store is ready
 * to use or when it knows it will never be ready because it was
 * unnable to populate the data store with any values.
 * (Probably due to a failed fetch request)
 *
 * @param isReady whether or not the store can be used at all
 */
export type FReadyWatcher = (isReady: boolean) => void;

export type CDataStoreClass = {
  ready: boolean,
  loading: boolean,

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
  read: (slice : string, selector : string = '', outputMode : string[] | boolean = false) => Promise<any>,

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
  write: (
    userID: ID,
    action : TStoreAction,
    slice : TStoreAction,
    payload: any,
  ) => Promise<string>,

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
    action : string,
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
  EfiringType: TEnumItem[],
  EprogramState: TEnumItem[],
  EkilnFiringState: TEnumItem[],
  EtemperatureState: TEnumItem[],
  EfuelSource: TEnumItem[],
  EequipmentLogType: TEnumItem[],
  EprogramStatus: TEnumItem[],
  EAdminLevels: TEnumItem[],
}
