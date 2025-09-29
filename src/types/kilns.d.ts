import { ID, ISO8601, type IKeyStr } from './data-simple.d.ts';
import type { IKiln, IStoredFiringProgram, TUniqueNameItem } from './data.d.ts';

// --------------------------------------------------------
// START: Enums

export enum EEnergySource {
  electric,
  gas,
  wood,
  oil,
  other,
}

export enum EkilnType {
  'general',
  'raku',
  'platter',
  'black firing',
  'annagamma'
}

export enum EkilnOpeningType {
  front,  // Front loading kiln
  top,    // Top loading kiln
  tophat, // Top hat kiln
  trolly, // Trolly kiln
}

export enum EfiringType {
  bisque,
  glaze,
  rawGlaze,
  luster,
  onglaze,
}

export enum EfiringLogType {
  temperature,
  packing,
  programSet,
  unpacking,
}

export enum EkilnReadyStatus {
  available,
  packing,
  packed,
  heating,
  holding,
  cooling,
  cold,
  unpacking,
  emptied,
};

enum EkilnServiceState {
  purchased,
  delivered,
  installed,
  working,
  maintenance,
  brokenAwaitingRepair,
  brokenBeingRepaired,
  retired,
  decomissioned,
  removed,
};

//  END:  Enums
// --------------------------------------------------------
// START: Types

export type HeatSource = {
  id: ID,
  kilnID: ID,
  position: string,
  type: string, // e.g. 'gas', 'electric', 'wood'
  subType: string, // e.g. 'burner', 'element', 'flame'
}

export interface IKiln implements IKeyValue, IIdObject, IIdNameObject, ILinkObject {
  id: ID,
  brand: string,
  model: string,
  name: string,
  urlPart: string,
  installDate: ISO8601|null,
  fuel: EfuelSource,
  type: EkilnType,
  maxTemp: number,
  maxProgramCount: number,
  volume: number,
  width: number,
  depth: number,
  height: number,
  bisque: boolean,
  glaze: boolean,
  single: boolean,
  luster: boolean,
  onglaze: boolean,
  saggar: boolean,
  raku: boolean,
  salt: boolean,
  black: boolean,
  useCount: number,
  isRetired: boolean,
  isWorking: boolean,
  isInUse: boolean,
  isHot: boolean
}

export type MaintenanceLog = {
  id: ID,
  kilnID: ID,
  userID: ID,
  date: ISO8601,
  repairType: string,
  description: string,
}

export type KilnState = {
  /**
   * The ID of the kiln
   *
   * NOTE: This is unique within the kilnStates table. i.e. there is only one kilnState per kiln.
   */
  kilnID: ID, //
  loaded: boolean,
  temperature: number,
  firingLogID: ID|null,
  firingCount: number,
  isInUse: boolean,
  isHot: boolean
}

export type KilnStates = KilnState[]
export type FiringLogs = FiringLogs[]

export type TKilnDetails = {
  EfiringTypes: Promise<IKeyStr>,
  EfuelSources: Promise<IKeyStr>,
  EkilnTypes: Promise<IKeyStr>,
  kiln: IKiln | null,
  programs: Promise<IStoredFiringProgram[]>,
  uniqueNames: TUniqueNameItem[],
};

export type PKilnDetails = {
  EfuelSources: Promise<IKeyStr>,
  EfiringTypes: Promise<IKeyStr>,
  EkilnTypes: Promise<IKeyStr>,
  kiln: Promise<IKiln|null>,
};
