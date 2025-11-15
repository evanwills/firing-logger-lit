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
  isRetro: boolean,

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
