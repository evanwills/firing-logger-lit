import { ID, ISO8601 } from './data-simple.d.ts'

// --------------------------------------------------------
// START: Enums

export enum EEnergySource {
  electric,
  gas,
  wood,
  oil,
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
  packed,
  heating,
  cooling,
  emptied
}

export enum EProgramLogState {
  pending,
  heating,
  holding,
  cooling,
  completed,
  aborted
}

export enum EResponsibilityType {
  'Primary packer',
  'Primary unpacker',
  'Assistant packer',
  'Assistant unpacker',
  'Program setter',
  'Watcher',
  'Primary pricer',
  'Assistant pricer',
}

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

export type Kiln = {
  id: ID,
  brand: string,
  model: string,
  name: string,
  installDate: ISO8601|null,
  fuel: EEnergySource,
  type: EkilnType,
  openingType: EkilnOpeningType,
  heatSources: HeatSource[],
  maxTemp: number,
  maxProgramCount: number,
  pyrometerCount: number,
  width: number,
  depth: number,
  height: number,
  glaze: boolean,
  bisque: boolean,
  luster: boolean,
  onglaze: boolean,
  saggar: boolean,
  raku: boolean,
  pit: boolean,
  black: boolean,
  rawGlaze: boolean,
  saltGlaze: boolean,
  isRetired: false,
  isWorking: boolean,
}

export type MaintenanceLog = {
  id: ID,
  kilnID: ID,
  userID: ID,
  date: ISO8601,
  repairType: string,
  description: string,
}

export type FiringStep = {
  endTemp: number, // positive degrees
  rate: number,    // degrees per hour
  hold: number     // minutes to hold at end temperature
}

export interface FiringProgram {
  id: ID,
  kilnID: string,
  controllerProgramID: number,
  type: EfiringType,
  name: string,
  version: number,
  description: string,
  maxTemp: number,
  duration: number,
  averageRate: number,
  steps: [FiringStep],
  created: ISO8601,
  createdBy: ID,
  superseded: boolean,
  parentID: ID|null,
  used: boolean,
  useCount: number,
  deleted: boolean,
  locked: boolean
}

export interface FiringLogEntry {
  firingID: ID
  userID: ID,
  time: ISO8601,
  isTemp: boolean,
  notes: string,
}

export interface TempLogEntry extends FiringLogEntry {
  firingID: ID
  userID: ID,
  time: ISO8601,
  isTemp: true,
  temperature: number,
  openingsNotes: string,
  notes: string,
}

export interface CombustionLogEntry extends TempLogEntry {
  damperAdjustment: number,
}

export type BurnerState = {
  burnerID: ID,
  burnerPosition: string,
  burnerType: string,
  valvePosition: number,
  primaryAir: number,
}

export interface GasLogEntry extends CombustionLogEntry {
  /**
   * The pressure in kPa
   *
   * @property {number} pressure
   */
  pressure: number,
  /**
   * The gas flow in L/min
   *
   * @property {number} gasFlow
   */
  burnerStates: [BurnerState],
}

export interface ResponsibleLogEntry {
  startTime: ISO8601,
  endTime: ISO8601,
  userID: ID,
  responsibilityType: EResponsibilityType,
  notes: string|null,
}

export type burnerState = {
  burnerID: ID,
  burnerPosition: string,
  burnerType: string,
  valvePosition: number,
  primaryAir: number,
  notes: string|null,
  time: ISO8601,
  userID: ID,
}

export interface FiringLog {
  id: ID,
  kilnID: ID,
  programID: ID,
  ownerID: ID,
  diaryID: ID|null,
  firingType: EfiringType,
  scheduledStart: ISO8601,
  scheduledEnd: ISO8601,
  scheduledCold: ISO8601,
  actualStart: ISO8601|null,
  actualEnd: ISO8601|null,
  actualCold: ISO8601|null,
  started: boolean,
  complete: boolean,
  cold: boolean,
  maxTemp: number,
  currentTemp: number,
  notes: string|null,
  tempLog: [FiringLogEntry],
  responsibleLog: [ResponsibleLogEntry],
  burnerStates: [burnerState],
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
