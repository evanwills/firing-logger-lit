// import type { SVGTemplateResult, TemplateResult } from 'lit';
import type { ID, ISO8601 } from './data-simple.d.ts';

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

  stage: number,

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

export interface IScheduleLogEntry extends IFiringLogEntry {
  id: ID,
  firingID: ID,
  time: ISO8601,
  timeOffset: null,
  userID: ID,
  type: 'schedule',
  notes: string|null,
  newStart: ISO8601,
  oldStart: ISO8601,
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

export interface IBurnerStateLogEntry  extends IFiringLogEntry {
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
  time?: ISO8601,
  type?: TFiringLogEntryType,
  notes?: string | null,
};

export interface INewFiringStateLogEntryOptions {
  timeOffset?: number | null,
  notes?: string | null,
  time?: ISO8601,
  newState: TFiringState,
  oldState: TFiringState,
};

export interface INewTempLogEntryOptions {
  timeOffset: number,
  time?: ISO8601,
  notes?: string | null,
  tempExpected: number,
  tempActual: number,
  state: TTemperatureState,
};

export interface INewScheduleLogEntryOptions {
  notes?: string | null,
  time?: ISO8601,
  newStart: ISO8601,
  oldStart: ISO8601,
};
