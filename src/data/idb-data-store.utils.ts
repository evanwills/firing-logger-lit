import type { IKeyValue } from "../types/data.d.ts";

type Fresolver = (value: unknown) => void;
type kv = {
  key: string,
  value: string,
}

export const populateSlice = (
  db : IDBDatabase,
  items : Array<any>,
  slice : string,
) : void => {
  const store = db.transaction(slice, 'readwrite').objectStore(slice);

  for (const item of items) {
    store.add(item);
  }
};

export const populateEnumSlice = (
  db : IDBDatabase,
  obj : IKeyValue,
  slice : string,
) : void => {
  const store = db.transaction(slice, 'readwrite').objectStore(slice);

  for (const key of Object.keys(obj)) {
    store.add({ key, value: obj[key] });
  }
};

const asObjKV = (data : kv[]) : IKeyValue => {
  const output : IKeyValue = {};

  for (const item of data) {
    output[item.key] = item.value;
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
  const output = (event.target as IDBRequest).result;

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
