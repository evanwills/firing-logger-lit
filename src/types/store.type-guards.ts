import type { CDataStoreClass } from "./store.d.ts";

export const isCDataStoreClass = (store : unknown) : store is CDataStoreClass => (
  typeof (store as CDataStoreClass).ready === 'boolean'
  && typeof (store as CDataStoreClass).loading === 'boolean'
  && typeof (store as CDataStoreClass).db === 'object'
  && typeof (store as CDataStoreClass).read === 'function'
  && typeof (store as CDataStoreClass).action === 'function'
  && typeof (store as CDataStoreClass).watch === 'function'
  && typeof (store as CDataStoreClass).ignore === 'function'
  && typeof (store as CDataStoreClass).watchReady === 'function'
);
