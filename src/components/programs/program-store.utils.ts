import type { IDBPDatabase } from 'idb';
import type {
  ID,
  IIdObject,
  IKeyStr,
  IKeyValue,
  // TNewItemResponse,
} from '../../types/data-simple.d.ts';
import { nanoid } from 'nanoid';
import type { IKiln } from '../../types/kilns.d.ts';
import type { IProgram, PProgramDetails } from '../../types/programs.d.ts';
import type { CDataStoreClass, FActionHandler } from '../../types/store.d.ts';
import type { TUserNowLaterAuth } from '../../types/users.d.ts';
import { isProgram } from '../../types/program.type-guards.ts';
import { isCDataStoreClass } from '../../types/store.type-guards.ts';
import { validateProgramData } from './program.utils.ts';
import { isNonEmptyStr } from '../../utils/string.utils.ts';
import { getKiln } from '../kilns/kiln-store.utils.ts';
import { saveChangeOnHold } from '../../store/save-data.utils.ts';
import { userCanNowLater } from '../users/user-data.utils.ts';
import { mergeChanges } from '../../utils/store.utils.ts';

export const getProgram = async (
  input : Promise<IProgram|IProgram[]|null|undefined>,
) : Promise<IProgram|null> => {
  let program = await input;

  if (Array.isArray(program) && program.length > 0) {
    program = program.filter((item) => item.superseded === false)[0]
  }

  const _tmp = validateProgramData(program);

  if (_tmp !== null) {
    console.warn('Program data is invalid:', _tmp);
    console.log('program:', program);
    return null;
  }

  return isProgram(program)
    ? program
    : null;
}

export const getProgramData : FActionHandler = async (
  db: IDBPDatabase | CDataStoreClass,
  { id, kilnUrlPart, programUrlPart } : { id: ID | null, kilnUrlPart: string | null, programUrlPart: string | null },
) : Promise<PProgramDetails> => {
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

  return { EfiringTypes, program, kiln };
};

export const getProgramURL = async (
  db: IDBPDatabase | CDataStoreClass,
  uid : ID,
) : Promise<string> => {
  const { program, kiln } = await getProgramData(
    db, { id: uid, kilnUrlPart : null, programUrlPart : null }
  );
  const _kiln = await kiln;
  const _program = await program;

  if (_kiln !== null && _program !== null) {
    return `/kilns/${_kiln.urlPart}/programs/${_program.urlPart}`;
  }
  return '';
}

const saveProgramChanges = async (
  db: IDBPDatabase,
  _userID : string,
  changes : IIdObject | null,
  program : IProgram,
) : Promise<IDBValidKey> => {
  const _program : IIdObject = mergeChanges(changes, program);

  const programError = validateProgramData(_program);

  if (programError !== null) {
    return Promise.reject(programError);
  }

  const method = changes === null ? 'add' : 'put';

  try {
    return await db[method]('programs', _program);
  } catch (error) {
    console.group('saveProgramChanges()');
    console.log('_userID:', _userID);
    console.log('changes:', changes);
    console.log('program:', program);
    console.log('_program:', _program);
    console.error('Failed to save Program data:', error);
    console.groupEnd();
    return Promise.reject(error);
  }
}

export const updateProgram : FActionHandler = async (
  db: IDBPDatabase | CDataStoreClass,
  changes : IIdObject,
) : Promise<IDBValidKey> => {
  if (isCDataStoreClass(db)) {
    throw new Error('updateProgram() expects first param `db` to be a IDBPDatabase type object');
  }

  const { user, hold, msg } : TUserNowLaterAuth = await userCanNowLater(db);

  if (msg !== '') {
    return Promise.reject(`${msg} update program details`);
  }

  if (user === null) {
    throw new Error('Cannot proceed because user is null');
  }

  const { _SUPERSEDE, ...newData } = changes;

  const program : IProgram | null = await db.get('programs', newData.id);

  if (!isProgram(program)) {
    return Promise.reject(`Could not find program matching "${newData.id}"`);
  }

  const oldData : IIdObject = { id: program.id };

  if (_SUPERSEDE === true) {
    newData.id = nanoid(10);
    oldData.supersededByID = newData.id;
    oldData.superseded = true;

    const _newData : IProgram = {
      ...program,
      ...newData,
      supersedesID: program.id,
      created: new Date().toISOString(),
      version: program.version + 1,
    }
    newData.supersedesID = program.id;
    newData.created = new Date().toISOString();
    newData.version = program.version + 1;
    newData.createdBy = user.id;

    if (hold === true) {
      saveChangeOnHold(db, 'programs', user.id, oldData, program);
      return saveChangeOnHold(db, 'programs', user.id, _newData, null);
    } else {
      saveProgramChanges(db, user.id, oldData, program);
      return saveProgramChanges(db, user.id, null, _newData);
    }
  } else if (hold === true) {
    return saveChangeOnHold(db, 'programs', user.id, newData, program);
  } else {
    return saveProgramChanges(db, user.id, newData, program);
  }
}

export const addProgram : FActionHandler = async (
  data : IKeyValue
) : Promise<IDBValidKey> => {
  // console.group('addProgram()');
  console.log('data:', data);

  return Promise.resolve('');
  // console.groupEnd();
}
