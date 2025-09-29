import type { SVGTemplateResult, TemplateResult } from 'lit';
import type { ID, IKeyValue, ILinkObject, IIdObject, ISO8601 } from './data-simple.d.ts';

export type FiringStep = {
  order: number,   // step order in program, starting at 1
  endTemp: number, // positive degrees
  rate: number,    // degrees per hour
  hold: number     // minutes to hold at end temperature
}

export interface IFiringProgramData implements IKeyValue, IIdObject, IIdNameObject, ILinkObject {
  id: ID,
  kilnID: ID,
  controllerProgramID: number,
  type: string,
  name: string,
  urlPart: string,
  version: number,
  description: string,
  steps: FiringStep[],
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
  steps: FiringStep[],
  created: ISO8601,
  createdBy: ID,
  superseded: boolean,
  parentID: string,
  used: boolean,
  useCount: number,
  deleted: boolean,
  locked: boolean,
}

export interface FiringProgramTmp implements IKeyValue, IIdObject, IIdNameObject, ILinkObject, IStoredFiringProgram {
  confirmed: boolean,
  errors: object,
  lastField: string,
  mode: string
}
