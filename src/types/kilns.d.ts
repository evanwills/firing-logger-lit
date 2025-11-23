import { ID, ISO8601, type IKeyStr } from './data-simple.d.ts';
import type { IKiln, IProgram, TUniqueNameItem } from './data.d.ts';

// --------------------------------------------------------
// START: Enums

export enum EEnergySource {
  electric,
  gas,
  wood,
  oil,
  other,
}

export type TkilnType = 'general' |
  'raku' |
  'platter' |
  'black firing' |
  'annagamma';

export type TkilnLoadingType = 'front' | 'top' | 'tophat' | 'trolley';

export enum EfiringType {
  bisque,
  glaze,
  rawGlaze,
  luster,
  onglaze,
}

export type TkilnReadyStatus = 'available' |
  'packing' |
  'packed' |
  'heating' |
  'holding' |
  'cooling' |
  'cold' |
  'unpacking' |
  'emptied';

export type TkilnServiceState = 'purchased' |
  'delivered' |
  'installed' |
  'working' |
  'maintenance' |
  'brokenAwaitingRepair' |
  'brokenBeingRepaired' |
  'retired' |
  'decomissioned' |
  'removed';

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
  [key: string]: any
  id: ID,
  /**
   * @property The manufacturer of the kiln
   */
  brand: string,
  /**
   * @property The model of the kiln
   */
  model: string,
  /**
   * @property The name the kiln is known by in the studio
   */
  name: string,
  /**
   * @property The url string for this kiln
   *           (non-editable - derived from the kiln's name)
   */
  urlPart: string,
  /**
   * @property When the kiln was first installed in the studio
   *           (i.e. when it was first ready to turn on)
   */
  installDate: ISO8601|null,
  /**
   * @property The energy source required to run the kiln
   */
  fuel: 'electric' | 'gas' | 'wood' | 'oil' | 'other',
  /**
   * @property Type of kiln
   */
  type: 'general' | 'raku' | 'platter' | 'black' | 'annagamma',
  /**
   * @property The basic shape of the kiln (volume of the kiln is
   *           calculated realtive to the shape)
   */
  shape: 'box' | 'barrel' | 'arch' | 'catenary',
  /**
   * @property
   */
  loadingType: 'front' | 'top' | 'tophat' | 'trolley',
  /**
   * @property The amount of time required for packing, before the
   *           kiln starts
   */
  leadTime: number,
  /**
   * @property The amount of time required for unpacking and cleaning,
   *           after the kiln has cooled
   */
  tailTime: number,
  /**
   * @property The proportion of time the kiln takes to cool enough
   *           for unpacking relative to the firing duration
   */
  coolingRate: number,
  /**
   * @property The highest temperature the kiln is rated for
   *           (this sets the top temperature for any program run on
   *            that kiln.)
   */
  maxTemp: number,
  /**
   * @property (Only for kilns with computer controllers) The maximum
   *           number of unique programs that can be set at any one
   *           time.
   */
  maxProgramCount: number,
  /**
   * @property The computed volume of the kiln based on the internal
   *           dimensions
   */
  volume: number,
  /**
   * @property The width of the packing space within the kiln
   */
  width: number,
  /**
   * @property The depth of the packing space within the kiln
   *           (excluding the space either side for air flow)
   */
  depth: number,
  /**
   * @property The height of the packing space within the kiln
   *           (excluding the offset height of the bottom shelf)
   */
  height: number,
  /**
   * @property Whether or not the kiln is allowed to run bisque
   *           firings
   */
  bisque: boolean,
  /**
   * @property Whether or not the kiln is allowed to run glaze
   *           firings
   */
  glaze: boolean,
  /**
   * @property Whether or not the kiln is allowed to run single
   *           firing glaze programs
   */
  single: boolean,
  /**
   * @property Whether or not the kiln is allowed to run luster
   *           firings
   */
  luster: boolean,
  /**
   * @property Whether or not the kiln is allowed to run onglaze
   *           firing
   */
  onglaze: boolean,
  /**
   * @property Whether or not the kiln is allowed to do firings with
   *           saggar boxes
   */
  saggar: boolean,
  /**
   * @property Whether or not the kiln is allowed to run raku firings
   */
  raku: boolean,
  /**
   * @property Whether or not the kiln is allowed to run salt/soda
   *           firings
   */
  salt: boolean,
  /**
   * @property Whether or not the kiln is allowed to run black
   *           firings
   */
  black: boolean,
  /**
   * @property The number of times the kiln has started a firing
   *           (this includes aborted firings but does not include
   *            firings that were cancelled before a firing became
   *            active)
   */
  useCount: number,
  /**
   * @property The number to multiply a program duration to estimate
   *           the expected "cold" time for a firing
   */
  coolingMultiplier: number,
  /**
   * @property The current state of the kiln's availability for use
   */
  readyState: 'unavailable' | 'available' | 'packing' | 'packed' | 'heating' | 'holding' | 'cooling' | 'cold' | 'unpacking' | 'emptied',
  /**
   * @property The current condition of the kiln in terms of service
   *           and maintenance
   */
  serviceState: 'purchased' | 'delivered' | 'installed' | 'working' | 'maintenance' | 'awaitingRepair' | 'beingRepaired' | 'retired' | 'decommissioned' | 'removed',
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

export type KilnStates = KilnState[];
export type FiringLogs = FiringLogs[];

export type TKilnDetailsForProgram = {
  EfiringTypes: Promise<IKeyStr>,
  kiln: Promise<IKiln | null>,
};

export type IKilnStatusLogEntry = {
  kilnID: ID,
  created: ISO8601,
  userID: ID,
  type: 'fault' | 'observation' | 'mantenance' | 'note' | 'serviceState',
  previous: string,
  current: string,
  notes: string,
}

export type TKilnDetails = {
  EfiringTypes: Promise<IKeyStr>,
  EfuelSources: Promise<IKeyStr>,
  EkilnLoadingTypes: Promise<IKeyStr>,
  EkilnTypes: Promise<IKeyStr>,
  kiln: IKiln | null,
  programs: Promise<IProgram[]>,
  uniqueNames: TUniqueNameItem[],
};

export type PKilnDetails = {
  EfuelSources: Promise<IKeyStr>,
  EfiringTypes: Promise<IKeyStr>,
  EkilnTypes: Promise<IKeyStr>,
  EkilnLoadingTypes: Promise<IKeyStr>,
  kiln: Promise<IKiln|null>,
};

export type TGetKilnDataPayload = {
  uid: ID,
  urlPart: string,
};

export type TKilnListItem = {
  id: ID,
  depth: number,
  fuel: string,
  height: number,
  maxTemp: number,
  name: string,
  width: number,
  urlPart: string,
}
