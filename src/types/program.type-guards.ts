import { validateProgramData } from "../utils/program.utils.ts";
import type { IProgram } from "./programs.d.ts";

export const isProgram = (obj: unknown) : obj is IProgram => {
  return (validateProgramData(obj) === null);
}
