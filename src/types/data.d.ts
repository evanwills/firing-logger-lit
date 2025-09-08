import type { SVGTemplateResult } from "lit";

export type ISO8601 = string;
export type ID = string;

// ========================================================
// START: REDUX types

export interface IKeyValue {
  [key: string]: any
}

export interface IIdObject implements IKeyValue {
  id: ID,
}

export interface Action {
  type: string,
  payload: object
}

export interface FancyPayload implements IIdObject, IKeyValue {
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


export interface IKiln implements IIdObject {
  id: ID,
  brand: string,
  model: string,
  name: string,
  installDate: ISO8601|null,
  fuel: EfuelSource,
  type: EkilnType,
  maxTemp: number,
  maxProgramCount: number,
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
  useCount: number,
  isRetired: boolean,
  isWorking: boolean,
  isInUse: boolean,
  isHot: boolean
}

export interface  EquipmentLogEntry implements IIdObject {
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

export interface IFiringProgramData implements IIdObject {
  id: ID,
  kilnID: string,
  controllerProgramID: number,
  type: EfiringType,
  name: string,
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

export interface IStoredFiringProgram extends IFiringProgramData {
  id: ID,
  kilnID: ID,
  controllerProgramID: number,
  type: string,
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
  parentID: string,
  used: boolean,
  useCount: number,
  deleted: boolean,
  locked: boolean
}

export interface FiringProgramTmp implements IStoredFiringProgram {
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

export interface FiringLog implements IIdObject {
  id: ID,
  kilnID: ID,
  programID: ID,
  diaryID: ID|null,
  firingType: EfiringType,
  firingState: EkilnFiringState,
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
  newState: EkilnFiringState,
}

export interface Kilns {
  all: [Kiln],
  tmp: Kiln
}

export interface AllFiringPrograms {
  all: [FiringProgram]
  tmp: FiringProgram
}

export type FiringLogs = [FiringLog]
export type equipmentLog = [EquipmentLogEntry]
export type users = [User]
export type calendar = [DiaryEntry]

export interface DiaryEntry implements IIdObject {
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

export interface User implements IIdObject {
  id: ID,
  firstName: string
  lastName: string,
  preferredName: string,
  phone: string,
  email: string,
  canFire: boolean,
  canLog: boolean,
  canPack: boolean,
  canUnpack: boolean,
  canPrice: boolean,
  adminLevel: number,
}

export interface Studio implements IIdObject {
  kilns: [kiln],
  firingPrograms: AllFiringPrograms,
  firingLogs: FiringLogs,
  equipmentLogs: EquipmentLog,
  users: Users,
  diary: Calendar
}


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
  stateSlice: kilns | allFiringPrograms | firingLogs | maintenance | issues | users | diary
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

enum EkilnFiringState {
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

