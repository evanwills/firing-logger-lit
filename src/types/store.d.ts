import type { ID } from "./data";

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

export type TDataStore = {
  /**
   * Read data from the store
   *
   * @param slice Dot separated string for hierrarchical store segment
   *
   * @returns What ever data is held within the store segment
   *
   * @throws {Error} If slice is a non-empty string and
   */
  read: (slice : TStoreSlice) => any,

  /**
   * Write data to the store
   *
   * @param action  Name of write action to be performed on the store
   * @param userID  ID of the user performing the write action
   * @param payload Data to be written to the store
   *
   * @returns Empty string if write action worked without issue.
   *          Error message string if there was a problem with the
   *          write action
   */
  write: (
    action : string,
    userID: ID,
    payload: any
  ) => string,

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
};
