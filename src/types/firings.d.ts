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

export type EResponsibilityType =
  'Primary packer' |
  'Primary unpacker' |
  'Assistant packer' |
  'Assistant unpacker' |
  'Program setter' |
  'Watcher' |
  'Primary pricer' |
  'Assistant pricer';

export interface ReportRow {
  time: Date,
  temp: number,
  expectedTemp: number,
  rate: number,
  expectedRate: number,
};

export type TFiringLogEntryType = 'temp' |
  'firingState' |
  'issue' |
  'observation' |
  'damper' |
  'burner' |
  'gas' |
  'wood' |
  'responsible' |
  'schedule';
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
  /**
   * @property Unique ID of the log entry
   */
  id: ID,

  /**
   * @property The ID of the firing the log entry is for
   */
  firingID: ID,

  /**
   * @property The time the log entry applies to
   *
   * __Note:__ For firings that are currently under way, this is
   *           usually the current time. However, for firings that
   *           are being logged retrospectively, this will be the
   *           time the data was recorded.
   */
  time: ISO8601,

  /**
   * @property Once the firing program hass tarted this is the number
   *           of seconds from when the firing went active.
   */
  timeOffset: number | null,

  /**
   * @property The ID of the user who submitted the log entry
   */
  userID: ID,

  /**
   * @property The type of log entry
   */
  type: TFiringLogEntryType,

  /**
   * @property Any additional info that's worth adding.
   *
   * __Note:__ In some instances (like aborting a firing) this
   *           becomes a required field.
   */
  notes: string | null,
};

export interface ITempLogEntry extends IFiringLogEntry {
  /**
   * @property Unique ID of the log entry
   */
  id: ID,

  /**
   * @property The ID of the firing the log entry is for
   */
  firingID: ID,

  /**
   * @property The time the log entry applies to
   *
   * __Note:__ For firings that are currently under way, this is
   *           usually the current time. However, for firings that
   *           are being logged retrospectively, this will be the
   *           time the data was recorded.
   */
  time: ISO8601,

  /**
   * @property The ID of the user who submitted the log entry
   */
  userID: ID,

  /**
   * @property The type of log entry
   *           (for TTempLogEntry it's always "temp")
   */
  type: 'temp',

  /**
   * @property Once the firing program hass tarted this is the number
   *           of seconds from when the firing went active.
   */
  timeOffset: number,

  /**
   * @property The expected temperature of the kiln
   *
   * __Note:__ This is a computed value derived from the program and
   *           not editable by the user.
   */
  tempExpected: number,

  /**
   * @property The current temperature of the kiln (at the time the
   *           log was entered)
   */
  tempActual: number,

  /**
   * @property Describes the relation of the current temperature to
   *           the expected temperature of the firing
   *
   * __Note:__ This is a computed value and not editable by the user.
   */
  state: TTemperatureState,

  /**
   * @property Any additional info that's worth adding.
   *
   * __Note:__ In some instances (like aborting a firing) this
   *           becomes a required field.
   */
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
  /**
   * @property Unique ID of the log entry
   */
  id: ID,

  /**
   * @property The ID of the firing the log entry is for
   */
  firingID: ID,

  /**
   * @property The ID of the user who submitted the log entry
   */
  userID: ID,

  /**
   * @property The time the log entry applies to
   *
   * __Note:__ For firings that are currently under way, this is
   *           usually the current time. However, for firings that
   *           are being logged retrospectively, this will be the
   *           time the data was recorded.
   */
  time: ISO8601,

  /**
   * @property Once the firing program hass tarted this is the number
   *           of seconds from when the firing went active.
   */
  timeOffset: number | null,

  /**
   * @property The type of log entry
   *           (for IResponsibleLogEntry it's always "responsible")
   */
  type: 'responsible',

  /**
   * @property Whether or not this is the start of a responsiblity
   *           block
   */
  isStart: boolean,

  /**
   * @property Type of responsibility being chnaged
   */
  responsibilityType: EResponsibilityType,

  /**
   * @property Any additional info that's worth adding.
   */
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

/**
 * All the details for a single firing
 */
export interface IFiring {
  /**
   * @property ID of the firing
   */
  id: ID,

  /**
   * @property The ID of the kiln in which the firing is to occur
   */
  kilnID: ID,

  /**
   * @property The ID of the program to be run for this firing
   */
  programID: ID,

  /**
   * @property The ID of the person who scheduled the firing
   */
  ownerID: ID,

  /**
   * @property The ID of the diary entry for this firing
   *
   * __NOTE:__ There is no functionality implemented for this and I
   *           think it's probably the wrong approach.
   *           My guess is that at a later date, I'll implement an
   *           approval flow for scheduled firings.
   */
  diaryID: ID|null,

  /**
   * @property The type of firing this is
   *
   * __NOTE:__ This comes directly from Program and cannot be
   *           changed by the user.
   */
  firingType: TFiringType,

  /**
   * @property When the firing is expected to start
   */
  scheduledStart: ISO8601|null,

  /**
   * @property When the firing is expected to start
   *
   * __NOTE:__ This is based on the program's calculated duration
   *           and cannot be changed by the user.
   */
  scheduledEnd: ISO8601|null,

  /**
   * @property The expected to end of the firing program
   *
   */
  scheduledCold: ISO8601|null,

  /**
   * @peroperty The time when packing was complete for the firing
   */
  packed: ISO8601|null,

  /**
   * @property When the firing actually started.
   */
  actualStart: ISO8601|null,

  /**
   * @property When the firing program actually completed.
   */
  actualEnd: ISO8601|null,

  /**
   * @property When the kiln was actually cool enough to unpack
   */
  actualCold: ISO8601|null,

  /**
   * @property When unpacking of the kiln was completed
   */
  unpacked: ISO8601|null,

  /**
   * @property Before the firing program starts: The expected maximum
   *           temperature of the firing.
   *           After the firing has started: The highest recorded
   *           temperature for the firing.
   * firing
   */
  maxTemp: number,

  /**
   * @property The cone the program is targeting for the firing
   */
  cone: TCone,

  /**
   * @property Whether or not the firing is active.
   *
   * __NOTE:__ A firing becomes activng when packing is started and
   *           remains active until the kiln is emptied.
   */
  active: boolean,

  /**
   * @property Whether or not the firing log is entered retrospectively
   *           (i.e. entered using documentation from a past firing.)
   */
  isRetro: false,

  /**
   * @property The current state of the whole firing process
   */
  firingState: TFiringState,

  /**
   * @property The status of the actual firing
   *           i.e whether
   *           * the program is running,
   *           * was cancelled before start,
   *           * was aborted during the firing
   *           * completed successfully
   */
  firingActiveState: TFiringActiveState,

  /**
   * @property The current state of the temperature (expected/under/over)
   */
  temperatureState: TTemperatureState,
};

export interface IArchivedFiring extends IFiring {
  /**
   * @property Full log of the
   */
  log: FiringLogEntry[],
}

export interface IFiringReport {
  kilnName: string,
  program: firingProgram,
  firingType: EfiringType,
  kilnState: EprogramState,
  responsible: string,
  startTime: Date,
  endTime: Date,
  programState: EprogramState,
  tempState: TTemperatureState,
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
