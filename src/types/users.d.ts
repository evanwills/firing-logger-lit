import type { ID, IIdObject, IKeyValue } from './data-simple';

export interface TUser implements IKeyValue, IIdObject {
  id: ID,
  username: string
  firstName: string
  lastName: string,
  preferredName: string,
  phone: string,
  email: string,
  canFire: boolean,
  canProgram: boolean,
  canLog: boolean,
  canPack: boolean,
  canUnpack: boolean,
  canPrice: boolean,
  adminLevel: number,
  notMetric: boolean,
  colourScheme: 'auto' | 'light' | 'dark',
}
