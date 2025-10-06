import type { IDBPDatabase } from "idb";
import type { ID, IKeyStr } from "../types/data-simple.d.ts";
import type { IKiln } from "../types/kilns.d.ts";
import { isProgram } from "../types/program.type-guards.ts";
import type { IProgram, PProgramDetails } from "../types/programs.d.ts";
import type { CDataStoreClass, FActionHandler } from "../types/store.d.ts";
import { validateProgramData } from "../utils/program.utils.ts";
import { isNonEmptyStr } from "../utils/string.utils.ts";
import { getKiln } from "./kiln-store.utils.ts";
import { isCDataStoreClass } from "../types/store.type-guards.ts";

export const getProgram = async (input : Promise<IProgram|IProgram[]|null|undefined>) : Promise<IProgram|null> => {
  // console.group('getKiln()');
  let program = await input;
  // console.log('kiln (before):', kiln);

  if (Array.isArray(program) && program.length > 0) {
    program = program[0];
  }
  // console.log('kiln (after):', kiln);
  // console.log('isKiln(kiln):', isKiln(kiln));

  const _tmp = validateProgramData(program);
  // console.log('_tmp:', _tmp);
  if (_tmp !== null) {
    console.warn('Kiln data is invalid:', _tmp);
    return null;
  }
  // console.groupEnd();

  return isProgram(program)
    ? program
    : null;
}

export const getProgramData : FActionHandler = async (
  db: IDBPDatabase | CDataStoreClass,
  { id, kilnUrlPart, programUrlPart } : { id: ID | null, kilnUrlPart: string | null, programUrlPart: string | null },
) : Promise<PProgramDetails> => {
  // console.group('getProgramData()');
  // console.log('id:', id);
  // console.log('kilnUrlPart:', kilnUrlPart);
  // console.log('kilnUprogramUrlPartrlPart:', programUrlPart);
  // console.log('db:', db);

  let program : Promise<IProgram | null> = Promise.resolve(null);
  let kiln : Promise<IKiln | null> = Promise.resolve(null);
  let EfiringTypes : Promise<IKeyStr | null> = Promise.resolve(null);

  if (isCDataStoreClass(db) === true) {
    EfiringTypes = db.read('EfiringType', '', true);

    let _program : IProgram | null = null;
    let _kiln : IKiln | null = null;

    if (isNonEmptyStr(id)) {
      _program = await getProgram(db.read('programs', `#${id}`));

      if (_program !== null) {
        kiln = getKiln(db.read('kilns', `#${_program.kilnID}`));
      }

      program = Promise.resolve(_program);
    } else if (isNonEmptyStr(kilnUrlPart) && isNonEmptyStr(programUrlPart)) {
      _kiln = await getKiln(db.read('kilns', `urlPart=${kilnUrlPart}`));

      if (_kiln !== null) {
        program = getProgram(db.read('programs', `kilnID=${_kiln.id}&&urlPart=${programUrlPart}`));
      }

      kiln = Promise.resolve(_kiln);
    }
  }

  // console.log('kiln:', kiln);
  // console.log('program:', program);
  // console.log('EfiringTypes:', EfiringTypes);
  // console.groupEnd();

  return { EfiringTypes, program, kiln };
};
