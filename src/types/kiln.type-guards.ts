import { validateKilnData } from '../components/kilns/kiln-data.utils.ts';
import { isObj } from "../utils/data.utils.ts";
import type { IKiln, PKilnDetails, TKilnDetails } from './kilns.d.ts';

export const isKiln = (kiln : unknown) : kiln is IKiln => {
  return validateKilnData(kiln) === null;
}

export const isPKilnDetails = (obj: unknown) : obj is PKilnDetails => (isObj(obj)
  && typeof (obj as PKilnDetails).EfiringTypes !== 'undefined'
  && (obj as PKilnDetails).EfiringTypes instanceof Promise
  && typeof (obj as PKilnDetails).EfuelSources !== 'undefined'
  && (obj as PKilnDetails).EfuelSources instanceof Promise
  && typeof (obj as PKilnDetails).EkilnTypes !== 'undefined'
  && (obj as PKilnDetails).EkilnTypes instanceof Promise
  && typeof (obj as PKilnDetails).EkilnLoadingTypes !== 'undefined'
  && (obj as PKilnDetails).EkilnLoadingTypes instanceof Promise
  && typeof (obj as PKilnDetails).kiln !== 'undefined'
  && (obj as PKilnDetails).kiln instanceof Promise);

export const isTKilnDetails = (obj: unknown) : obj is TKilnDetails => (isObj(obj)
  && typeof (obj as TKilnDetails).EfiringTypes !== 'undefined'
  && (obj as TKilnDetails).EfiringTypes instanceof Promise
  && typeof (obj as TKilnDetails).EfuelSources !== 'undefined'
  && (obj as TKilnDetails).EfuelSources instanceof Promise
  && typeof (obj as TKilnDetails).EkilnTypes !== 'undefined'
  && (obj as TKilnDetails).EkilnTypes instanceof Promise
  && typeof (obj as TKilnDetails).EkilnLoadingTypes !== 'undefined'
  && (obj as TKilnDetails).EkilnLoadingTypes instanceof Promise
  && typeof (obj as TKilnDetails).kiln !== 'undefined'
  && ((obj as TKilnDetails).kiln === null || isKiln((obj as TKilnDetails).kiln))
  && typeof (obj as TKilnDetails).programs !== 'undefined'
  && (obj as TKilnDetails).programs instanceof Promise
  && typeof (obj as TKilnDetails).uniqueNames !== 'undefined'
  && Array.isArray((obj as TKilnDetails).uniqueNames));
