import { validateProgramData, validateProgramStep } from '../components/programs/program.utils.ts';
import type { IFiringStep, IProgram } from './programs.d.ts';

export const isProgram = (obj: unknown) : obj is IProgram => {
  return (validateProgramData(obj) === null);
}

export const isFiringStep = (obj : unknown) : obj is IFiringStep => {
  return (validateProgramStep(obj) === null);
}
