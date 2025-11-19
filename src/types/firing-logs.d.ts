// import type { SVGTemplateResult, TemplateResult } from 'lit';
import type { ID, ISO8601 } from './data-simple.d.ts';

export type TFiringLogEntryType = 'temp' |
  'burner' |
  'damper' |
  'firingState' |
  'gas' |
  'issue' |
  'observation' |
  'responsible' |
  'schedule' |
  'stage' |
  'wood';

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
   * @property The ID of the user who submitted the log entry
   */
  userID: ID,

  /**
   * @property If this log entry is updated, a new log entry is
   *           created with the updated data, this is the ID of
   *           previous version of the log entry.
   */
  supersededByID: ID | null,

  /**
   * @property The type of log entry
   */
  type: TFiringLogEntryType,

  /**
   * @property The time the log entry was created (if different to
   *           the time it applies to)
   */
  createdTime: ISO8601,

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
   * @property Once the firing program has started this is the number
   *           of seconds from when the firing went active.
   */
  timeOffset: number | null,

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
   * @property The ID of the user who submitted the log entry
   */
  userID: ID,

  /**
   * @property If this log entry is updated, a new log entry is
   *           created with the updated data, this is the ID of
   *           previous version of the log entry.
   */
  supersededByID: ID | null,

  /**
   * @property The type of log entry
   *           (for TTempLogEntry it's always "temp")
   */
  type: 'temp',

  /**
   * @property The time the log entry was created (if different to
   *           the time it applies to)
   */
  createdTime: null | ISO8601,

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
  notes: string | null,
};

export interface IStageLogEntry extends IFiringLogEntry {
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
   * @property If this log entry is updated, a new log entry is
   *           created with the updated data, this is the ID of
   *           previous version of the log entry.
   */
  supersededByID: ID | null,

  /**
   * @property The type of log entry
   */
  type: 'stage',

  /**
   * @property The time the log entry was created (if different to
   *           the time it applies to)
   */
  createdTime: null | ISO8601,

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
  timeOffset: number,

  /**
   * @property Any additional info that's worth adding.
   *
   * __Note:__ In some instances (like aborting a firing) this
   *           becomes a required field.
   */
  notes: string|null,

  /**
   * @property Stage/Step in the program
   */
  stage: number,

  /**
   * @property Program stage firing rate (degrees per hour)
   */
  rate: number,

  /**
   * @property target temperature at the end of the stage
   */
  endTemp: number,

  /**
   * @property number of minutes to hold at end/target temperature
   *           before moving on to the next stage/step of the program
   */
  hold: number,

  /**
   * @property Expected date/time when the stage/step will end
   */
  expectedEnd: ISO8601,
};

export interface IStateLogEntry extends IFiringLogEntry {
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
   * @property If this log entry is updated, a new log entry is
   *           created with the updated data, this is the ID of
   *           previous version of the log entry.
   */
  supersededByID: ID | null,

  /**
   * @property The type of log entry
   */
  type: 'firingState',

  /**
   * @property The time the log entry was created (if different to
   *           the time it applies to)
   */
  createdTime: null | ISO8601,

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
   * @property Once the firing program has started this is the number
   *           of seconds from when the firing went active.
   */
  timeOffset: number,

  /**
   * @property Any additional info that's worth adding.
   *
   * __Note:__ In some instances (like aborting a firing) this
   *           becomes a required field.
   */
  notes: string|null,

  /**
   * @property The current status of the firing
   */
  current: TFiringState,

  /**
   * @property The previous status of the firing
   */
  previous: TFiringState,
};

export interface IScheduleLogEntry extends IFiringLogEntry {
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
   * @property If this log entry is updated, a new log entry is
   *           created with the updated data, this is the ID of
   *           previous version of the log entry.
   */
  supersededByID: ID | null,

  /**
   * @property The type of log entry
   */
  type: 'schedule',

  /**
   * @property The time the log entry was created (if different to
   *           the time it applies to)
   */
  createdTime: ISO8601,

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
   * @property Once the firing program has started this is the number
   *           of seconds from when the firing went active.
   */
  timeOffset: null,

  /**
   * @property Any additional info that's worth adding.
   *
   * __Note:__ In some instances (like aborting a firing) this
   *           becomes a required field.
   */
  notes: string|null,

  /**
   * @property The current time the firing is scheduled to start
   */
  current: ISO8601,

  /**
   * @property The time the firing was previously scheduled to start
   */
  previous: ISO8601,
};

export interface IDamperLogEntry extends IFiringLogEntry {
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
   * @property If this log entry is updated, a new log entry is
   *           created with the updated data, this is the ID of
   *           previous version of the log entry.
   */
  supersededByID: ID | null,

  /**
   * @property The type of log entry
   */
  type: 'damper',


  /**
   * @property The time the log entry was created (if different to
   *           the time it applies to)
   */
  createdTime: ISO8601,

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
   * @property Once the firing program has started this is the number
   *           of seconds from when the firing went active.
   */
  timeOffset: number,

  /**
   * @property The percentage the exhaust damper is open
   *           (a number between 0 & 100)
   */
  damperAdjustment: number,

  /**
   * @property Any additional info that's worth adding.
   *
   * __Note:__ In some instances (like aborting a firing) this
   *           becomes a required field.
   */
  notes: string|null,
};

export interface IBurnerStateLogEntry  extends IFiringLogEntry {
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
   * @property If this log entry is updated, a new log entry is
   *           created with the updated data, this is the ID of
   *           previous version of the log entry.
   */
  supersededByID: ID | null,

  /**
   * @property The type of log entry
   */
  type: 'burner',

  /**
   * @property The time the log entry was created (if different to
   *           the time it applies to)
   */
  createdTime: ISO8601,

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
   * @property Once the firing program has started this is the number
   *           of seconds from when the firing went active.
   */
  timeOffset: number,

  /**
   * @property The ID of the burner for that particular kiln
   */
  burnerID: ID,

  /**
   * @property The position of the burner in the kiln
   */
  burnerPosition: string,

  /**
   * @property The type of burner
   */
  burnerType: string,

  /**
   * @property How far open the burner valve is open
   *           (a number between 1 & 100)
   */
  valvePosition: number,

  /**
   * @property How far open the burner's primary air control is open
   *           (a number between 1 & 100)
   */
  primaryAir: number,

  /**
   * @property Any additional info that's worth adding.
   *
   * __Note:__ In some instances (like aborting a firing) this
   *           becomes a required field.
   */
  notes: string|null,
};

export interface IGasLogEntry extends IFiringLogEntry {
  id: ID,
  firingID: ID,
  userID: ID,

  /**
   * @property If this log entry is updated, a new log entry is
   *           created with the updated data, this is the ID of
   *           previous version of the log entry.
   */
  supersededByID: ID | null,
  type: 'gas',

  /**
   * @property The time the log entry was created (if different to
   *           the time it applies to)
   */
  createdTime: null | ISO8601,
  time: ISO8601,
  timeOffset: number,
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
   * @property If this log entry is updated, a new log entry is
   *           created with the updated data, this is the ID of
   *           previous version of the log entry.
   */
  supersededByID: ID | null,

  /**
   * @property The type of log entry
   *           (for IResponsibleLogEntry it's always "responsible")
   */
  type: 'responsible',

  /**
   * @property The time the log entry was created (if different to
   *           the time it applies to)
   */
  createdTime: null | ISO8601,

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
  createdTime?: ISO8601 | null,
  type?: TFiringLogEntryType,
  notes?: string | null,
};

export interface INewFiringStateLogEntryOptions {
  timeOffset?: number | null,
  notes?: string | null,
  createdTime?: ISO8601 | null,
  time?: ISO8601,
  current: TFiringState,
  previous: TFiringState,
};

export interface INewTempLogEntryOptions {
  timeOffset: number,
  createdTime?: ISO8601 | null,
  time?: ISO8601,
  notes?: string | null,
  tempExpected: number,
  tempActual: number,
  state: TTemperatureState,
};

export interface INewScheduleLogEntryOptions {
  notes?: string | null,
  createdTime?: ISO8601 | null,
  time?: ISO8601,
  current: ISO8601,
  previous: ISO8601,
};
