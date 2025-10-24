import { validateProgramData, validateProgramStep } from '../components/programs/program.utils.ts';
import type { IFiringStep, IProgram, PProgramDetails, TFiringType } from './programs.d.ts';

export const isProgram = (obj: unknown) : obj is IProgram => {
  return (validateProgramData(obj) === null);
}

export const isFiringStep = (obj : unknown) : obj is IFiringStep => {
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
