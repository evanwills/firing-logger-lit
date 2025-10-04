import type { ID } from "../types/data-simple.d.ts";
import type { IKiln } from "../types/kilns.d.ts";
import type { IProgram, PProgramDetails } from "../types/programs.d.ts";
import type { CDataStoreClass } from "../types/store.d.ts";
import { isNonEmptyStr } from "../utils/string.utils.ts";
import { getKiln } from "./kiln-store.utils.ts";

export const getProgram = async (input : Promise<IProgram|IProgram[]|null|undefined>) : Promise<IProgram|null> => {
  // console.group('getKiln()');
  let program = await input;
  // console.log('kiln (before):', kiln);

  if (Array.isArray(program) && program.length > 0) {
    program = program[0];
  }
  // console.log('kiln (after):', kiln);
  // console.log('isKiln(kiln):', isKiln(kiln));
  const _tmp = validateKilnData(program);
  // console.log('_tmp:', _tmp);
  if (_tmp !== null) {
    console.warn('Kiln data is invalid:', _tmp);
  }
  // console.groupEnd();

  return (isKiln(program))
    ? program
    : null;
}

export const getBasicProgramData = async (
  db: CDataStoreClass,
  id: ID | null = null,
  kilnUrlPart: string | null = null,
  programUrlPart: string | null = null
) : Promise<PProgramDetails> => {
  // console.group('getBasicKilnData()');
  // console.log('id:', id);
  // console.log('urlPart:', urlPart);
  const EfiringTypes = db.read('EfiringType', '', true);
  let _program : IProgram | null = null;
  let _kiln : IKiln | null = null;

  let program : Promise<IProgram | null> = Promise.resolve(null);
  let kiln : Promise<IKiln | null> = Promise.resolve(null);


  if (isNonEmptyStr(id)) {
    _program = await db.read('programs', `#${id}`);

    if (_program !== null) {
      kiln = db.read('kilns', `#${_program.kilnID}`);
    }

    program = Promise.resolve(_program);
  } else if (isNonEmptyStr(kilnUrlPart)) {
    _kiln = await getKiln(db.read('kilns', `urlPart=${kilnUrlPart}`));

    if (_kiln !== null) {
      program = db.read('programs', `kilnID=${_kiln.id}&&urlPart=${programUrlPart}`);
    }

    kiln = Promise.resolve(_kiln);
  }

  // console.log('selector:', selector);
  // console.groupEnd();

  return { program, kiln, EfiringTypes };
};
