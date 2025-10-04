import { validateKilnData } from "../utils/kiln-data.utils.ts";
import type { IKiln } from './kilns.d.ts';

export const isKiln = (kiln : unknown) : kiln is IKiln => {
  return validateKilnData(kiln) === null;
}
