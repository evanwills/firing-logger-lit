import type { SVGTemplateResult, TemplateResult } from 'lit';
import type { ID, IKeyValue, ILinkObject, IIdObject, ISO8601 } from './data-simple.d.ts';


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

export interface FiringLogEntry {
  userID: ID,
  time: ISO8601,
  isTemp: boolean,
  notes: string,
};

export interface TempLogEntry extends FiringLogEntry {
  userID: ID,
  time: ISO8601,
  isTemp: true,
  timeOffset: number,
  tempExpected: number,
  tempActual: number,
  state: EtemperatureState,
  notes: string,
};

export interface CombustionLogEntry extends TempLogEntry {
  damperAdjustment: number,
};

export type BurnerState = {
  burnerID: ID,
  burnerPosition: string,
  burnerType: string,
  valvePosition: number,
  primaryAir: number,
};

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
};

export interface ResponsibleLogEntry {
  time: ISO8601,
  isStart: boolean,
  userID: ID,
  responsibilityType: EResponsibilityType,
  notes: string|null,
};

export type burnerState = {
  burnerID: ID,
  burnerPosition: string,
  burnerType: string,
  valvePosition: number,
  primaryAir: number,
  notes: string|null,
  time: ISO8601,
  userID: ID,
};

export interface FiringLog {
  id: ID,
  kilnID: ID,
  programID: ID,
  ownerID: ID,
  diaryID: ID|null,
  firingType: EfiringType,
  scheduledStart: ISO8601|null,
  scheduledEnd: ISO8601|null,
  scheduledCold: ISO8601|null,
  actualStart: ISO8601|null,
  actualEnd: ISO8601|null,
  actualCold: ISO8601|null,
  started: boolean,
  complete: boolean,
  cold: boolean,
  maxTemp: number,
  programState: 'idle' | 'ready' | 'active' | 'complete' | 'aborted',
  temperatureState: 'underError' | 'under' | 'nominal' | 'over' | 'overError',
  currentTemp: number,
  notes: string|null,
  tempLog: [FiringLogEntry],
  responsibleLog: [ResponsibleLogEntry],
  burnerStates: [burnerState],
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
