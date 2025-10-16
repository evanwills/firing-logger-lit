import type { SVGTemplateResult, TemplateResult } from 'lit';
import type { ID, IKeyValue, ILinkObject, IIdObject, ISO8601 } from './data-simple.d.ts';

export interface IFiringStep extends IKeyValue {
  order: number,   // step order in program, starting at 1
  endTemp: number, // positive degrees
  rate: number,    // degrees per hour
  hold: number     // minutes to hold at end temperature
}

export interface IProgram extends IKeyValue, IIdObject, IIdNameObject, ILinkObject {
  id: ID,
  kilnID: ID,
  controllerProgramID: number,
  type: 'bisque' | 'glaze' | 'single' | 'luster' | 'onglaze' | 'raku' | 'salt' | 'black',
  name: string,
  urlPart: string,
  description: string,
  maxTemp: number,
  cone: string,
  duration: number,
  averageRate: number,
  steps: IFiringStep[],
  created: ISO8601,
  createdBy: ID,
  version: number,
  superseded: boolean,
  supersedesID: ID | null,
  supersededByID: ID | null,
  useCount: number,
  deleted: boolean,
  locked: boolean,
}

export interface FiringProgramTmp implements IKeyValue, IIdObject, IIdNameObject, ILinkObject, IProgram {
  confirmed: boolean,
  errors: object,
  lastField: string,
  mode: string
}

export type PProgramDetails = {
  program: Promise<IProgram|null>,
  kiln: Promise<IKiln|null>,
  EfiringTypes: Promise<IKeyStr>,
}


export type TProgramListRenderItem = {
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
  superseded: boolean,
  redirect: boolean,
  url: string | null,
}
