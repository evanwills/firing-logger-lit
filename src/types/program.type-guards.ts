import { validateProgramData, validateProgramStep } from '../components/programs/program.utils.ts';
import { isNonEmptyStr } from "../utils/string.utils.ts";
import { isID, isIkeyValue } from "./data.type-guards.ts";
import type { IProgramStep, IProgram, PProgramDetails, TFiringType, TProgramListRenderItem } from './programs.d.ts';

export const isProgram = (obj: unknown) : obj is IProgram => {
  return (validateProgramData(obj) === null);
}

export const isFiringStep = (obj : unknown) : obj is IProgramStep => {
  return (validateProgramStep(obj) === null);
}

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
