import type { SVGTemplateResult, TemplateResult } from 'lit';
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

export type Fview = (state: object, eHandler: function, routes: array) => TemplateResult;

export type TUniqueNameItem = {
  name: string,
  urlPart: string,
};

//  END:  view only types
// ========================================================
// START: enums

enum EequipmentLogType {
  usage,
  maintenance,
  problem,
}


//  END:  enums
// ========================================================

