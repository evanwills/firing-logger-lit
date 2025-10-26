import { type IDBPDatabase } from 'idb';
import type {
  ID,
  IIdObject,
  IKeyStr,
  IKeyValPair,
  IKeyValue,
  IOrderedEnum,
} from '../types/data-simple.d.ts';
import type { FActionHandler, IUpdateHelperData, TUpdateHelperOptions } from '../types/store.d.ts';
import type { CDataStoreClass } from '../types/store.d.ts';
import type { TUserNowLaterAuth } from '../types/users.d.ts';
import { isID, isStrNum } from "../types/data.type-guards.ts";
import { userCanNowLater } from '../components/users/user-data.utils.ts';
import { isNonEmptyStr } from '../utils/string.utils.ts';

type Fresolver = (value: unknown) => void;

export const populateSlice = (
  db : CDataStoreClass,
  items : IIdObject[],
  slice : string,
) : Promise<(void | IDBValidKey)[]> => {
  if (Array.isArray(items) === false) {
    throw new Error(`No data for ${slice}`);
  }

  const tx = db.transaction(slice, 'readwrite');

  const rows = [];

  for (const item of items) {
    rows.push(tx.store.add(item));
  }
  rows.push(tx.done);

  return Promise.all(rows);
};

/**
 * Populate an empty (or differently sized) IndexedDB DataStore
 *
 * @param db    IndexedDB database connection
 * @param items Items to be added to the DB
 * @param slice IndexedDB DataStore name
 * @param force If there are already the same number of items in the
 *              DB, check to see if there new items not already in
 *              the DB
 * @returns
 */
export const populateEmptySlice = async (
  db : CDataStoreClass,
  items : IIdObject[],
  slice : string,
  action : '' | 'update' | 'replace' = '',
) : Promise<(void | IDBValidKey)[]> => {
  const inDB : IIdObject[] = await db.getAll(slice);

  let newItems : IIdObject[] = [];

  if (inDB.length === 0 || action === 'replace') {
    newItems = items;
    db.clear(slice)
  } else if (action === 'update' || items.length !== inDB.length) {
    const existing : ID[] = inDB.map((item : IIdObject) : ID => item.id);
    newItems = items.filter((item : IIdObject) : boolean => !existing.includes(item.id));
  }

  if (Array.isArray(newItems) === false) {
    throw new Error(`No data for ${slice}`);
  }

  return (newItems.length > 0)
    ? populateSlice(db, items, slice)
    : Promise.resolve([]);
};

/**
 * Insert Enum type data into data store
 *
 * @param db    Database connection object
 * @param obj   Data to be stored
 * @param slice Name of ObjectStore of the data is to be inserted
 *              into.
 * @returns
 */
export const populateKVslice = (
  db : CDataStoreClass,
  obj : IKeyValue,
  slice : string,
  put : boolean = false,
) : Promise<(void | IDBValidKey)[]> => {
  if (typeof obj === 'undefined') {
    throw new Error(`No data for ${slice}`);
  }

  const tx = db.transaction(slice, 'readwrite');
  const method = (put === true)
    ? 'put'
    : 'add';

  const rows = [];

  for (const key of Object.keys(obj)) {
    rows.push(tx.store[method]({ key, value: obj[key] }));
  }

  rows.push(tx.done);

  return Promise.all(rows);
};


/**
 * Insert Enum type data into an empty data store
 *
 * @param db     Database connection object
 * @param obj    Data to be stored
 * @param slice  Name of ObjectStore of the data is to be inserted
 *               into.
 * @param force
 * @returns
 */
export const populateEmptyKVslice = async(
  db : CDataStoreClass,
  obj : IKeyValue,
  slice : string,
  action : '' | 'update' | 'replace' = '',
) => {
  const inDB : IKeyValPair[] = await db.getAll(slice);
  let newObj : IKeyValue = {};

  if (inDB.length === 0 || action === 'replace') {
    newObj = obj;
    db.clear(slice)
  } else if (action === 'update' || Object.keys(obj).length !== inDB.length) {
    const existing : string[] = inDB.map((item : IKeyValPair) : string => item.key);
    for (const key of Object.keys(obj)) {
      if (existing.includes(key) === false) {
        newObj[key] = obj[key]
      }
    }
  }

  if (typeof newObj === 'undefined') {
    throw new Error(`No data for ${slice}`);
  }

  return (Object.keys(newObj).length > 0)
    ? populateKVslice(db, newObj, slice)
    : Promise.resolve([]);
};

/**
 * Insert Enum type data into data store
 *
 * @param db    Database connection object
 * @param obj   Data to be stored
 * @param slice Name of ObjectStore of the data is to be inserted
 *              into.
 * @returns
 */
export const populateEnumSlice = (
  db : CDataStoreClass,
  oEnum : IOrderedEnum[],
  slice : string,
  put : boolean = false,
) : Promise<(void | IDBValidKey)[]> => {
  const tx = db.transaction(slice, 'readwrite');
  const method = (put === true)
    ? 'put'
    : 'add';

  const rows = [];

  for (const item of oEnum) {
    rows.push(tx.store[method](item));
  }

  rows.push(tx.done);

  return Promise.all(rows);
};


/**
 * Insert Enum type data into an empty data store
 *
 * @param db     Database connection object
 * @param obj    Data to be stored
 * @param slice  Name of ObjectStore of the data is to be inserted
 *               into.
 * @param force
 * @returns
 */
export const populateEmptyEnumSlice = async(
  db : CDataStoreClass,
  oEnum : IOrderedEnum[],
  slice : string,
  action : '' | 'update' | 'replace' = '',
) => {
  const inDB : IOrderedEnum[] = await db.getAll(slice);
  let newEnum : IOrderedEnum[] = [];

  if (inDB.length === 0 || action === 'replace') {
    newEnum = oEnum;
    db.clear(slice)
  } else if (action === 'update' || oEnum.length !== inDB.length) {
    const existing : string[] = inDB.map((item : IOrderedEnum) : string => item.value);
    for (const entry of oEnum) {
      if (existing.includes(entry.value) === false) {
        newEnum.push(entry)
      }
    }
  }
  if (typeof newEnum === 'undefined') {
    throw new Error(`No enum data for ${slice}`);
  }

  return (newEnum.length > 0)
    ? populateEnumSlice(db, newEnum, slice)
    : Promise.resolve([]);
};

const asObjKV = (data : IOrderedEnum[]) : IKeyValue => {
  const output : IKeyValue = {};

  data.sort((a : IOrderedEnum, b : IOrderedEnum) : -1 | 0 |1 => {
    if (a.order < b.order) {
      return -1;
    } else if (a.order > b.order) {
      return 1;
    } else {
      return 0;
    }
  });

  for (const item of data) {
    output[item.value] = item.label;
  }

  return output;
}

const filterObj = (filter : string[]) => (item : IKeyValue) : IKeyValue => {
  const output : IKeyValue = {};

  for (const prop of filter) {
    if (typeof item[prop] !== 'undefined') {
      output[prop] = item[prop];
    }
  }

  return output;
}

export const getOnSuccess = (
  resolve : Fresolver,
  outputMode : string[] | boolean = false,
) => (event : Event) : void => {
  // console.group('onSuccess() (read)');
  // console.log('event:', event);
  // console.log('event.target:', event.target);
  const output = (event.target as IDBRequest).result;
  // console.log('output:', output);
  // console.groupEnd();

  if (outputMode === true) {
    resolve(asObjKV(output));
  } else if (Array.isArray(outputMode)) {
    resolve(output.map(filterObj(outputMode as string[])));
  } else {
    resolve(output);
  }
};

export const getOnError = (reject: Fresolver) => (e : Event) : void => {
  console.error('Error:', e);
  reject(e);
};

export const outputAs = async (
  // deno-lint-ignore no-explicit-any
  input : Promise<any>,
  outputMode : string[] | boolean = false,
  // deno-lint-ignore no-explicit-any
) : Promise<any> => {
  // console.group('outputAs()');
  // console.log('input:', input);
  // console.log('outputMode:', outputMode);
  const output = await input;
  // console.log('output:', output);
  // console.groupEnd();
  if (outputMode === true) {
    return asObjKV(output);
  }

  if (Array.isArray(output) && Array.isArray(outputMode)) {
    return output.map(filterObj(outputMode as string[]));
  }

  return output;
};

// deno-lint-ignore no-explicit-any
export const storeCatch = (reason: any) => { console.error('Error:', reason); };

export const parseKeyValSelector = (selector : string) : IKeyStr[] => selector
  .split(/(?:\|\||\&\&)/)
  .map((item) => {
    const [indexName, value] = item.split('=').map((kv) => kv.trim());

    return { indexName, value };
  });

export const getByKeyValue = async (
  db : CDataStoreClass,
  storeName: string,
  selector : string,
  // deno-lint-ignore no-explicit-any
) : Promise<any> => {
  // console.group('getByKeyValue()');
  // console.log('db:', db);
  // console.log('storeName:', storeName);
  // console.log('selector:', selector);
  const selectors : IKeyStr[] = parseKeyValSelector(selector);
  const primary = selectors.shift();
  // console.log('selectors:', selectors);
  // console.log('primary:', primary);

  if (typeof primary !== 'undefined') {
    const tx = db.transaction(storeName, 'readonly');
    // console.log('tx:', tx);
    const index = tx.store.index(primary.indexName);
    // console.log('index:', index);

    const output = (primary.value.startsWith('#'))
      ? [await index.get(primary.value)]
      : await index.getAll(primary.value)

    if (selectors.length === 0) {
      // console.log('output:', output);
      // console.groupEnd();

      return output;
    }

    return output.filter((item : IKeyValue) : boolean => {
      // console.group('getByKeyValue().filter()');
      // console.log('item:', item);
      for (const kv of selectors) {
        // console.log('kv.indexName:', kv.indexName);
        // console.log('kv.value:', kv.value);
        // console.log(`item[${kv.indexName}]:`, item[kv.indexName]);

        if (typeof item[kv.indexName] === 'undefined' || item[kv.indexName] !== kv.value) {
          // console.groupEnd();
          // console.groupEnd();
          return false;
        }
      }
      // console.groupEnd();
      // console.groupEnd();
      return true;
    })
  }
}

export const pullStoreData = async (
  db : CDataStoreClass,
  storeName : string,
  url: string,
  now: boolean = false,
) : Promise<(void|IDBValidKey)[]> => {
  // console.group('pullStoreData()');
  // console.log('storeName:', storeName);
  // console.log('url:', url);
  // console.log('now:', now);

  const last = await db.get('_meta', storeName);

  const when = (now === true)
    ? 300000 // 5 minutes
    : 86400000; // 24 hours

  // console.log('last:', last);
  // console.log(`lastFetched ${storeName}:`, last?.value);
  // console.log('when:', when);
  // console.groupEnd();
  if (typeof last === 'undefined' || (Date.now() - last.value) > when) {
    console.log('Fetching new data for', storeName);

    try {
      const response = await fetch(url);

      // console.log('response:', response);

      if (response.ok) {
        // console.log('Update last fetched time for', storeName);
        db.put('_meta', { key: storeName, value: Date.now() });
        console.log('newLast:', await db.get('_meta', storeName));

        const data : IIdObject[]= await response.json();
        // console.log('data:', data);


        if (Array.isArray(data) && data.length > 0) {
          const newItems : IIdObject[] = [];

          for (const item of data) {
            if (typeof item.id !== 'undefined') {
              const _tmp = await db.get(storeName, item.id);
              if (typeof _tmp === 'undefined' || _tmp === null) {
                newItems.push(item);
              }
            }
          }

          const added = [];

          if (newItems.length > 0) {
            const tx = db.transaction(storeName, 'readwrite');

            for (const item of newItems) {
              console.log('New item:', item);
              added.push(await tx.store.add(item));
            }

            added.push(tx.done);

            console.info('Added', newItems.length, 'new items to', storeName);
            // console.groupEnd();

            return Promise.all(added);
          }

          console.info('No new items to add to', storeName);
        }
      }
    } catch (e) {
      console.error('Error fetching data:', e);
    }
  } else {
    console.info(`Data for "${storeName}" is up to date.`);
  }

  // console.groupEnd();
  return Promise.resolve([]);
}

export const fetchLatestKilns = async (db : CDataStoreClass) : Promise<void|(void|IDBValidKey)[]> => {
  console.info('fetchLatestKilns()');
  await pullStoreData(db, 'kilns', '/data/kilns.json').catch(storeCatch);
};

export const fetchLatestPrograms = async (db : CDataStoreClass) : Promise<void|(void|IDBValidKey)[]> => {
  console.info('fetchLatestPrograms()');
  await pullStoreData(db, 'programs', '/data/programs.json').catch(storeCatch);
};

export const fetchLatestFirings = async (db : CDataStoreClass) : Promise<void|(void|IDBValidKey)[]> => {
  console.info('fetchLatestFirings()');
  await pullStoreData(db, 'firings', '/data/firings.json').catch(storeCatch);
};

export const fetchLatestUsers = async (db : CDataStoreClass) : Promise<void|(void|IDBValidKey)[]> => {
  console.info('fetchLatestUsers()');
  await pullStoreData(db, 'users', '/data/users.json', true).catch(storeCatch);
};

export const fetchLatest : FActionHandler = async (db : CDataStoreClass) : Promise<void> => {
  console.info('fetchLatest()');
  await Promise.all([
    // fetchLatestFirings(db),
    fetchLatestKilns(db),
    fetchLatestPrograms(db),
    // fetchLatestUsers(db),
  ]).catch(storeCatch).finally(() => { console.groupEnd(); });
};

export const getKeyRange = (
  start : string | number | unknown,
  end : string | number | unknown,
) : IDBKeyRange | null => {
  const lower = isStrNum(start)
    ? start
    : null;
  const upper = isStrNum(end)
    ? end
    : null;

  if (lower !== null && upper !== null) {
    return (lower > upper)
      ? IDBKeyRange.bound(upper, lower)
      : IDBKeyRange.bound(lower, upper);
  }

  if (upper !== null) {
    return IDBKeyRange.upperBound(upper);
  }

  if (lower !== null) {
    return IDBKeyRange.lowerBound(lower)
  }

  return null;
}

export const addUpdateHelper = async (
  db: CDataStoreClass,
  _method: string,
  storeName: string,
  itemType: string,
  isThing: (input: unknown) => boolean,
  {
    action,
    allowed,
    id,
    permissionLevel,
    type,
  } : TUpdateHelperOptions = {},
) : Promise<IUpdateHelperData> => {
  const _permissionLevel : number = (typeof permissionLevel === 'number')
    ? permissionLevel
    : 2;

  const _allowed : string = (typeof allowed === 'string')
    ? allowed
    : 'any';

  const _action : string = (typeof action === 'string')
    ? action
    : 'update';

  const _type : string = (typeof type === 'string')
    ? type
    : 'details';
  const _id : ID | null = (isID(id))
    ? id
    : null;

  const { user, hold, msg } : TUserNowLaterAuth = await userCanNowLater(db, _allowed, _permissionLevel);
  let thing = null;

  if (msg === '') {
    if (user === null) {
      // This should never happen because `msg` will contain an error
      // message if user is null
      throw new Error('Cannot proceed because user is null');
    } else {
      if (isNonEmptyStr(_id)) {
        thing = await db.get(storeName, _id);

        if (!isThing(thing)) {
          throw new Error(`Could not find ${itemType} matching "${_id}"`);
        }
      }
    }
  } else {
    throw new Error(`${msg} ${_action} ${itemType} ${_type}`);
  }

  return { hold, thing, user };
}
