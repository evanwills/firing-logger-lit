// import type { SVGTemplateResult, TemplateResult } from 'lit';
import type {
  ID,
  // IKeyValue,
  // ILinkObject,
  // IIdObject,
  ISO8601,
  TCone,
  IOrderedEnum,
} from './data-simple.d.ts';
import type { IKiln } from "./kilns.d.ts";
import type { IProgram, TFiringType } from "./programs.d.ts";


export enum EProgramLogState {
  idle,
  ready,
  active,
  completed,
  aborted,
};

export enum EfiringLogType {
  temperature,
  packing,
  programSet,
  unpacking,
};

enum EtemperatureState {
  nominal,
  over,
  overError,
  under,
  underError,
};

export enum EResponsibilityType {
  'Primary packer',
  'Primary unpacker',
  'Assistant packer',
  'Assistant unpacker',
  'Program setter',
  'Watcher',
  'Primary pricer',
  'Assistant pricer',
};

export interface ReportRow {
  time: Date,
  temp: number,
  expectedTemp: number,
  rate: number,
  expectedRate: number,
};

export type TFiringLogEntryType = 'temp' | 'firingState' | 'issue' | 'observation' | 'damper' | 'burner' | 'gas' | 'wood' | 'responsible' | 'schedule';
export type TFiringActiveState = 'normal' | 'cancelled' | 'aborted' | 'completed';
export type TFiringState = 'created' |
  'scheduled' |
  'packing' |
  'ready' |
  'cancelled' |
  'active' |
  'complete' |
  'aborted' |
  'cold' |
  'unpacking' |
  'empty';
export type TTemperatureState = 'underError' | 'under' | 'expected' | 'over' | 'overError' | 'n/a';

export interface IFiringLogEntry {
  id: ID,
  firingID: ID,
  time: ISO8601,
  timeOffset: number | null,
  userID: ID,
  type: TFiringLogEntryType,
  notes: string | null,
};

export interface ITempLogEntry extends IFiringLogEntry {
  id: ID,
  firingID: ID,
  time: ISO8601,
  userID: ID,
  type: 'temp',
  timeOffset: number,
  tempExpected: number,
  tempActual: number,
  state: TTemperatureState,
  notes: string|null,
};

export interface IStateLogEntry extends IFiringLogEntry {
  id: ID,
  firingID: ID,
  time: ISO8601,
  timeOffset: number | null,
  userID: ID,
  type: 'firingState',
  notes: string|null,
  newState: TFiringState,
  oldState: TFiringState,
};

export interface IDamperLogEntry extends IFiringLogEntry {
  id: ID,
  firingID: ID,
  time: ISO8601,
  timeOffset: number,
  userID: ID,
  type: 'damper',
  damperAdjustment: number,
  notes: string|null,
};

export interface IBurnerState  extends IFiringLogEntry {
  id: ID,
  firingID: ID,
  time: ISO8601,
  timeOffset: number,
  userID: ID,
  type: 'burner',
  burnerID: ID,
  burnerPosition: string,
  burnerType: string,
  valvePosition: number,
  primaryAir: number,
  notes: string|null,
};

export interface IGasLogEntry extends IFiringLogEntry {
  id: ID,
  firingID: ID,
  time: ISO8601,
  timeOffset: number,
  userID: ID,
  type: 'gas',
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
  IburnerStates: [IBurnerState],
  notes: string,
};

export interface IResponsibleLogEntry extends IFiringLogEntry {
  id: ID,
  firingID: ID,
  userID: ID,
  time: ISO8601,
  timeOffset: number | null,
  type: 'responsible',
  isStart: boolean,
  responsibilityType: EResponsibilityType,
  notes: string|null,
};

export interface INewLogEntryOptions {
  timeOffset?: number | null,
  type?: TFiringLogEntryType,
  notes?: string | null,
};

export interface INewFiringStateLogEntryOptions {
  timeOffset?: number | null,
  notes?: string | null,
  newState: TFiringState,
  oldState: TFiringState,
};
export interface IFiring {
  id: ID,
  kilnID: ID,
  programID: ID,
  ownerID: ID,
  diaryID: ID|null,
  firingType: TFiringType,
  scheduledStart: ISO8601|null,
  scheduledEnd: ISO8601|null,
  scheduledCold: ISO8601|null,
  packed: ISO8601|null,
  actualStart: ISO8601|null,
  actualEnd: ISO8601|null,
  actualCold: ISO8601|null,
  unpacked: ISO8601|null,
  maxTemp: number,
  cone: TCone,
  active: boolean,
  firingState: TFiringState,
  firingActiveState: TFiringActiveState,
  temperatureState: TTemperatureState,
  log: FiringLogEntry[],
};

export interface IFiringReport {
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
};

export type TFiringsListItem = {
  id: ID,
  programID: ID,
  programName: string,
  programURL: string,
  kilnID: ID,
  kilnName: string,
  kilnURL: string,
  firingType: TFiringType,
  maxTemp: number,
  cone: TCone,
  active: boolean,
  firingState: TFiringState,
  start: ISO8601|null,
  end: ISO8601|null,
}

export type TGetFirningDataPayload = {
  firing: Promise<IFiring|null>,
  kiln: Promise<IKiln>,
  log: Promise<IFiringLogEntry[]>,
  program: Promise<IProgram>,
  firingStates: Promise<IOrderedEnum[]>,
  firingTypes: Promise<IOrderedEnum[]>,
  temperatureStates: Promise<IOrderedEnum[]>,
  ownerName: string,
};
