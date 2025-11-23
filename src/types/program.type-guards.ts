import { isNumMinMax } from "../utils/data.utils.ts";
import { isNonEmptyStr } from "../utils/string.utils.ts";
import { isID, isIdNameObject, isIkeyValue, isISO8601, isTCone } from "./data.type-guards.ts";
import type { IProgramStep, IProgram, PProgramDetails, TFiringType, TProgramListRenderItem } from './programs.d.ts';

export const isProgram = (program: unknown) : program is IProgram => (
  isIdNameObject(program) === true
  && isID(program.kilnID) === true
  && isNumMinMax(program.controllerProgramID, 1, 100) === true
  && isTFiringType(program.type) === true
  && isNonEmptyStr(program, 'urlPart')
  && typeof program.description === 'string'
  && isNumMinMax(program.maxTemp, 0, 1500)
  && isTCone(program.cone)
  && isNumMinMax(program.duration, 1, 864000)
  && isNumMinMax(program.averageRate, 0, 500)
  && Array.isArray(program.steps)
  && program.steps.length > 0
  && program.steps.every(isFiringStep)
  && isISO8601(program.created)
  && isID(program.createdBy)
  && isNumMinMax(program.version, 0, 1000)
  && typeof program.superseded === 'boolean'
  && (program.supersedesID === null || isID(program.supersedesID))
  && isNumMinMax(program.useCount, 0, 10000)
  && typeof program.deleted === 'boolean'
  && typeof program.locked === 'boolean'
);

export const isIProgramStep = (step : unknown) : step is IProgramStep => (
  isIkeyValue(step) === true
  && isNumMinMax((step as IProgramStep).order, 1, 100)   // step order in program, starting at 1
  && isNumMinMax((step as IProgramStep).endTemp, 0, 1500) // positive degrees
  && isNumMinMax((step as IProgramStep).rate, 0, 500) // degrees per hour
  && isNumMinMax((step as IProgramStep).hold, 0, 1440) // minutes to hold at end temperature
);
export const isFiringStep = isIProgramStep;

export const isPProgramDetails = (obj : unknown) : obj is PProgramDetails => (
  typeof (obj as PProgramDetails).program !== 'undefined'
  && (obj as PProgramDetails).program instanceof Promise
  && typeof (obj as PProgramDetails).kiln !== 'undefined'
  && (obj as PProgramDetails).kiln instanceof Promise
  && typeof (obj as PProgramDetails).EfiringTypes !== 'undefined'
  && (obj as PProgramDetails).EfiringTypes instanceof Promise
);

export const isTFiringType = (value : unknown) : value is TFiringType => (
  typeof value === 'string'
  && new Set(['bisque', 'glaze', 'single', 'luster', 'onglaze', 'raku', 'salt', 'black']).has(value)
);

export const isTProgramListRenderItem = (obj : unknown) : obj is TProgramListRenderItem => (
  isIkeyValue(obj)
  && isID(obj.programID)
  && isNonEmptyStr(obj.programName)
  && isNonEmptyStr(obj.programURL)
  && isID(obj.kilnID)
  && isNonEmptyStr(obj.kilnID)
  && isNonEmptyStr(obj.kilnID)
  && isNonEmptyStr(obj.type)
  && typeof obj.maxTemp === 'number'
  && isNonEmptyStr(obj.cone)
  && /^0?[1-3]?\d$/.test(obj.cone)
  && typeof obj.duration === 'number'
  && typeof obj.superseded === 'boolean'
  && typeof obj.redirect === 'boolean'
);
