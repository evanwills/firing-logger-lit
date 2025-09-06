import { nanoid } from 'nanoid';
import type { FDataStoreSingleton, TDataStore } from '../types/store.d.ts';
import { splitSlice } from '../utils/store.utils.ts';

let store : TDataStore | null = null;

class IdbDataStore implements TDataStore {
  constructor(
    schema : any,
    reducers : any,
  ) {

  }

  /**
   *
   * @param slice Dot separated string for hierrarchical store segment
   * @returns What ever data is held within the store segment
   * @throws {Error} If slice is a non-empty string and
   */
  read(slice: string = '') : any {

  }

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
  write(action : string, userID : string, payload: any) : string {
    return '';
  }

  /**
   * Add watcher to do something after a successful write action
   *
   * @param action  Name of action to watch for
   * @param handler Handler function to do something with a
   *                particular slice of store after a write action
   *                __NOTE:__ handler is called every time a 'write'
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
    action: string,
    handler : (payload: any) => void,
    slice: string = '',
  ) : string {
    const id = nanoid(10);
    const _slice = splitSlice(slice);

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
  ignore(watchID : string) : boolean {
    return false;
  }
}

export const getSingletonStore : FDataStoreSingleton = () : TDataStore => {
  if (store === null) {
    store = new IdbDataStore({}, {});
  }

  return store;
};
