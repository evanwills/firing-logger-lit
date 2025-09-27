import type { SVGTemplateResult } from 'lit';
import type { ID, IKeyValue, ILinkObject, IIdObject, ISO8601 } from './data-simple.d.ts';

// ========================================================
// START: REDUX types

export interface Action {
  type: string,
  payload: object
}

export interface FancyPayload implements IKeyValue, IIdObject {
  id: ID,
  value: any,
  isChecked: boolean,
  extra: string|number,
  suffix: string|number
}
export interface FancyAction extends Action {
  type: string,
  payload: FancyPayload,
  href: string | null,
  now: number,
  userID: ID,
}

//  END:  REDUX types
// ========================================================
// START: stored data types


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

export interface  EquipmentLogEntry implements IKeyValue, IIdObject {
  id: ID,
  equipmentID: string,
  date: number,
  type: EequipmentLogType,
  user: string,
  shortDesc: string,
  longDesc: string,
  parentID: string | null,
  verifiedDate: number | null,
  verifiedBy: string | null
}

export interface IFiringProgramData implements IKeyValue, IIdObject, IIdNameObject, ILinkObject {
  id: ID,
  kilnID: string,
  controllerProgramID: number,
  type: EfiringType,
  name: string,
  urlPart: string,
  version: number,
  description: string,
  steps: [FiringStep],
  created: ISO8601,
  createdBy: ID,
  superseded: boolean,
  parentID: string,
  used: boolean,
  useCount: number,
  deleted: boolean,
  locked: boolean
}

export interface IStoredFiringProgram extends IKeyValue, IIdObject, IIdNameObject, ILinkObject, IFiringProgramData {
  id: ID,
  kilnID: ID,
  controllerProgramID: number,
  type: string,
  name: string,
  urlPart: string,
  version: number,
  description: string,
  maxTemp: number,
  cone: string,
  duration: number,
  averageRate: number,
  steps: [FiringStep],
  created: ISO8601,
  createdBy: ID,
  superseded: boolean,
  parentID: string,
  used: boolean,
  useCount: number,
  deleted: boolean,
  locked: boolean
}

export interface FiringProgramTmp implements IKeyValue, IIdObject, IIdNameObject, ILinkObject, IStoredFiringProgram {
  confirmed: boolean,
  errors: object,
  lastField: string,
  mode: string
}

export type FiringStep = {
  order: number,   // step order in program, starting at 1
  endTemp: number, // positive degrees
  rate: number,    // degrees per hour
  hold: number     // minutes to hold at end temperature
}

export interface FiringLog implements IKeyValue, IIdObject {
  id: ID,
  kilnID: ID,
  programID: ID,
  diaryID: ID|null,
  firingType: EfiringType,
  firingState: EkilnReadyStatus,
  start: number,
  end: number|null,
  started: boolean,
  complete: boolean,
  maxTemp: number,
  cone: string,
  currentTemp: number,
  responsibleID: ID,
  notes: string,
  tempLog: [TemperatureLogEntry]
  responsibleLog: [ResponsibleLogEntry]
}

export interface IFiringLogEntry {
  userID: ID,
  firingID: ID,
  time: Date,
  notes: string,
}

export interface TemperatureLogEntry extends IFiringLogEntry {
  userID: ID,
  firingID: ID,
  time: Date,
  timeOffset: number,
  tempExpected: number,
  tempActual: number,
  state: EtemperatureState,
  notes: string,
}

export interface ResponsibleLogEntry extends IFiringLogEntry {
  userID: ID,
  firingID: ID,
  time: Date,
  isStart: boolean
}

export interface StateChangeLogEntry extends IFiringLogEntry {
  userID: ID,
  firingID: ID,
  time: Date,
  newState: EkilnReadyStatus,
}

export interface Kilns {
  all: [IKiln],
  tmp: IKiln
}

export interface AllFiringPrograms {
  all: [FiringProgram]
  tmp: FiringProgram
}

export type FiringLogs = [FiringLog]
export type equipmentLog = [EquipmentLogEntry]
export type calendar = [DiaryEntry]

export interface DiaryEntry implements IKeyValue, IIdObject {
  id: ID,
  date: Date,
  kilnID: string,
  ownerID: string,
  approverID: string,
  programID: string,
  firingType: EfiringType,
  notes: string,
  confirmed: boolean,
  started: boolean,
}

export interface TUser implements IKeyValue, IIdObject {
  id: ID,
  username: string
  firstName: string
  lastName: string,
  preferredName: string,
  phone: string,
  email: string,
  canFire: boolean,
  canProgram: boolean,
  canLog: boolean,
  canPack: boolean,
  canUnpack: boolean,
  canPrice: boolean,
  adminLevel: number,
  notMetric: boolean,
  colourScheme: 'auto' | 'light' | 'dark',
}

export interface Studio implements IKeyValue {
  kilns: IKiln[],
  firingPrograms: AllFiringPrograms,
  firingLogs: FiringLogs,
  equipmentLogs: EquipmentLog,
  users: TUser[],
  diary: Calendar
}

export type TConeData = {
  cone: string,
  rate: number,
  temp: number
};

//  END:  stored data types
// ========================================================
// START: view only types

export type TSvgPathItem = {
  timeOffset: number, // number of minutes from start of firing
  actualTime?: string, // ISO8601 date-time string for tooltips
  temp: number, // temperature at this time
}

export type TSvgUnit = {
  offset: number,
  value: string|number|SVGTemplateResult,
}


export interface FiringReport {
    kilnName: string,
    program: firingProgram,
    firingType: EfiringType,
    kilnState: EprogramState,
    responsible: string,
    startTime: Date,
    endTime: Date,
    programState: EprogramState,
    tempState: EtemperatureState,
    log: [reportRow]
    currentRate: number
}

export interface ReportRow {
  time: Date,
  temp: number,
  expectedTemp: number,
  rate: number,
  expectedRate: number
}

export interface veiw {
  route: [string],
  title: string,
  url: string,
  navOpen: false,
  settingsOpen: false
}

export interface App {
  currentUser: user,
  reports: [firingReport],
  view: Eview,
  stateSlice: IKilns | allFiringPrograms | firingLogs | maintenance | issues | users | diary
}

function Fview (state: object, eHandler: function, routes: array) : html


//  END:  view only types
// ========================================================
// START: enums


enum EfiringType {
  bisque,
  glaze,
  single,
  luster,
  onglaze
}

enum EprogramState {
  idle,
  pending,
  started,
  completed,
  aborted,
}

enum EkilnReadyStatus {
  available,
  packing,
  packed,
  heating,
  holding,
  cooling,
  cold,
  unpacking,
  emptied,
}

enum EkilnMServiceState {
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
}

enum EtemperatureState {
  nominal,
  over,
  overError,
  under,
  underError,
}

enum Eview {
  diary,
  firings,
  kilns,
  programs,
  report,
  users
}

enum EfuelSource {
  electric,
  gas,
  wood,
  oil,
}

enum EkilnType {
  'general',
  'raku',
  'platter',
  'black firing',
  'annagamma'
}

enum EequipmentLogType {
  usage,
  maintenance,
  problem
}

enum EprogramStatus {
  unused,
  selected,
  used
}


//  END:  enums
// ========================================================

