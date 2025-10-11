import type { IDBPDatabase } from 'idb';
import type {
  ID,
  IIdObject,
  IKeyStr,
} from '../../types/data-simple.d.ts';
import { nanoid } from 'nanoid';
import type { IKiln } from '../../types/kilns.d.ts';
import type { IProgram } from '../../types/programs.d.ts';
import type { CDataStoreClass, FActionHandler } from '../../types/store.d.ts';
import type { TUserNowLaterAuth } from '../../types/users.d.ts';
import { isPProgramDetails, isProgram } from '../../types/program.type-guards.ts';
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
) : Promise<unknown> => {
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

export const getProgramURL : FActionHandler = async (
  db: IDBPDatabase | CDataStoreClass,
  uid : ID,
) : Promise<string> => {
  let kiln : IKiln | null = null;
  let program : IProgram | null = null;

  const tmp : unknown = await getProgramData(
    db,
    {
      id: uid,
      kilnUrlPart : null,
      programUrlPart : null,
    },
  );

  if (isPProgramDetails(tmp)) {
    kiln = await tmp.kiln;
    program = await tmp.program;
  }

  if (kiln !== null && program !== null) {
    return `/kilns/${kiln.urlPart}/programs/${program.urlPart}`;
  }
  return '';
}

const saveProgramChanges = async (
  db: IDBPDatabase,
  _userID : string,
  changes : IIdObject | null,
  program : IProgram,
  kilnUrlPart : string,
) : Promise<IDBValidKey> => {
  const _program : IIdObject = mergeChanges(changes, program);

  const programError = validateProgramData(_program);

  if (programError !== null) {
    return Promise.reject(programError);
  }

  const method = changes === null ? 'add' : 'put';

  if (method === 'add' || typeof (changes as IIdObject).urlPart === 'string') {
    db.put(
      'redirects', {
        id: _program.id,
        firing: false,
        kiln: true,
        program: true,
        url: `/kilns/${kilnUrlPart}/programs/${_program.urlPart}`,
        user: false,
      },
    );

    if (method === 'add') {
      db.delete('redirects', program.id);
    }
  }

  try {
    return await db[method]('programs', _program);
  } catch (error) {
    console.group('saveProgramChanges() ERROR:');
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
    throw new Error(
      'updateProgram() expects first param `db` to be a '
      + 'IDBPDatabase type object',
    );
  }

  const { user, hold, msg } : TUserNowLaterAuth = await userCanNowLater(db);

  if (msg !== '') {
    return Promise.reject(`${msg} update program details`);
  }

  if (user === null) {
    throw new Error('Cannot proceed because user is null');
  }

  const { _SUPERSEDE, _KILN_URL_PART, ...newData } = changes;

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
      saveProgramChanges(db, user.id, oldData, program, _KILN_URL_PART);
      return saveProgramChanges(db, user.id, null, _newData, _KILN_URL_PART);
    }
  } else if (hold === true) {
    return saveChangeOnHold(db, 'programs', user.id, newData, program);
  } else {
    return saveProgramChanges(db, user.id, newData, program, _KILN_URL_PART);
  }
}

export const addProgram : FActionHandler = async (
  db: IDBPDatabase | CDataStoreClass,
  program : IProgram,
) : Promise<IDBValidKey> => {
  if (isCDataStoreClass(db)) {
    throw new Error(
      'addProgram() expects first param `db` to be a IDBPDatabase '
      + 'type object',
    );
  }

  const { user, hold, msg } : TUserNowLaterAuth = await userCanNowLater(db);

  if (msg !== '') {
    return Promise.reject(`${msg} update program details`);
  }

  if (user === null) {
    throw new Error('Cannot proceed because user is null');
  }

  const { _SUPERSEDE, _KILN_URL_PART, ...newData } = program;
  // console.group('addProgram()');
  console.log('program:', program);


  return (hold === true)
    ? saveChangeOnHold(db, 'kilns', user.id, newData, null)
    : saveProgramChanges(db, user.id, null, newData, _KILN_URL_PART);
  // console.groupEnd();
}
