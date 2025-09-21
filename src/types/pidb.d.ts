export type IDBPupgrade = (
  database: IDBPDatabase<unknown>,
  oldVersion: number,
  newVersion: number | null,
  transaction: IDBPTransaction<unknown, string[], "versionchange">,
  event: IDBVersionChangeEvent
) => void;

export type IDBPpopulate = (db : IDBPDatabase) => Promise<void>;
