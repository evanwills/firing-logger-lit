// import type { SVGTemplateResult, TemplateResult } from 'lit';
import type {
  ID,
  // IKeyValue,
  // ILinkObject,
  // IIdObject,
  ISO8601,
} from './data-simple.d.ts';


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

export interface IFiringLogEntry {
  id: ID,
  firingID: ID,
  time: ISO8601,
  userID: ID,
  type: 'temp' | 'firingState' | 'damper' | 'burner' | 'gas' | 'wood' | 'resonsible',
  notes: string|null,
};

export interface TempLogEntry extends IFiringLogEntry {
  id: ID,
  firingID: ID,
  time: ISO8601,
  userID: ID,
  type: 'temp',
  timeOffset: number,
  tempExpected: number,
  tempActual: number,
  state: EtemperatureState,
  notes: string|null,
};

export interface CombustionLogEntry extends IFiringLogEntry {
  id: ID,
  firingID: ID,
  time: ISO8601,
  userID: ID,
  type: 'damper',
  damperAdjustment: number,
  notes: string|null,
};

export interface BurnerState  extends IFiringLogEntry {
  id: ID,
  firingID: ID,
  time: ISO8601,
  userID: ID,
  type: 'burner',
  burnerID: ID,
  burnerPosition: string,
  burnerType: string,
  valvePosition: number,
  primaryAir: number,
  notes: string|null,
};

export interface GasLogEntry extends IFiringLogEntry {
  id: ID,
  firingID: ID,
  time: ISO8601,
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
  burnerStates: [BurnerState],
  notes: string,
};

export interface ResponsibleLogEntry extends IFiringLogEntry {
  id: ID,
  firingID: ID,
  time: ISO8601,
  userID: ID,
  type: 'resonsible',
  isStart: boolean,
  userID: ID,
  responsibilityType: EResponsibilityType,
  notes: string|null,
};

export interface Firing {
  id: ID,
  kilnID: ID,
  programID: ID,
  ownerID: ID,
  diaryID: ID|null,
  firingType: EfiringType,
  scheduledStart: ISO8601|null,
  scheduledEnd: ISO8601|null,
  scheduledCold: ISO8601|null,
  packed: ISO8601|null,
  actualStart: ISO8601|null,
  actualEnd: ISO8601|null,
  actualCold: ISO8601|null,
  unpacked: ISO8601|null,
  maxTemp: number,
  cone: string,
  firingState: 'scheduled' | 'packing' | 'ready' | 'active' | 'complete' | 'cold' | 'unpacking' | 'empty' | 'aborted',
  temperatureState: 'underError' | 'under' | 'expected' | 'over' | 'overError' | 'n/a',
  log: [FiringLogEntry],
};

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
};

export type TFiringListItem = {
  firingID: ID,
  programID: ID,
  programName: string,
  programURL: string,
  kilnID: ID,
  kilnName: string,
  kilnURL: string,
  type: string,
  maxTemp: number,
  cone: string,
  duration: number,
  programState: string,
  actualStart: ISO8601|null,
  actualEnd: ISO8601|null,
}
