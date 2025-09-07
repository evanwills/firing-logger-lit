import { nanoid } from 'nanoid';
import type { TDataStore } from '../types/store.d.ts';
import { splitSlice } from '../utils/store.utils.ts';
import { getDataFromSlice } from './fs-data-store.utils.ts';
import FiringLoggerData from './firing-logger.json' with { type: 'json' };

let store : TDataStore | null = null;

class FsDataStore implements TDataStore {
  _data = {};

  constructor(
  ) {
    this._data = FiringLoggerData;
  }

  /**
   *
   * @param slice Dot separated string for hierrarchical store segment
   * @returns What ever data is held within the store segment
   * @throws {Error} If slice is a non-empty string and
   */
  read(slice: string = '') : Promise<any> {
    try {
      return Promise.resolve(getDataFromSlice(this._data, splitSlice(slice)));
    } catch (e) {
      console.error(e);
      throw new Error(`Error reading data from store at slice: '${slice}'`, e);
    }
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
  write(action : string, userID : string, payload: any) : Promise<string> {
    console.group('FsDataStore.write()');
    console.log('Action :', action);
    console.log('UserID :', userID);
    console.log('Payload:', payload);
    console.groupEnd();

    return Promise.resolve('');
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
    console.group('FsDataStore.watch()');
    console.log('Action :', action);
    console.log('UserID :', handler);
    console.log('slice:', slice);
    const id = nanoid(10);
    const _slice = splitSlice(slice);

    console.log('id:', id);
    console.log('_slice:', _slice);
    console.groupEnd();
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
    console.group('FsDataStore.ignore()');
    console.log('watchID :', watchID);
    console.groupEnd();
    return false;
  }
}

export const getDataStoreSingleton = () : TDataStore => {
  if (store === null) {
    store = new FsDataStore();
  }

  return store;
};
