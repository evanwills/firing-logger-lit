// ------------------------------------------------------------------
// START: Basic scalar types

import type { TemplateResult } from 'lit';

export type ISO8601 = string;
export type TTimeStamp = number;
export type ID = string;

//  END:  Basic scalar types
// ------------------------------------------------------------------
// START: Basic object types

export interface IKeyValue {
  [key: string]: any
};

export interface IIdObject implements IKeyValue {
  [key: string]: any,
  id: ID,
};

export interface IIdNameObject implements IKeyValue, IIdObject {
  [key: string]: any
  id: ID,
  name: string,
};

export interface ILinkObject implements IKeyValue, IIdObject, IIdNameObject {
  [key: string]: any
  id: ID,
  name: string,
  urlPart: string,
};

export interface IKeyStr extends IKeyValue {
  [key:string] : string
};

export interface IKeyNum extends IKeyValue {
  [key:string] : number
};

export interface IKeyBool extends IKeyValue {
  [key:string] : boolean
};

export interface IKeyScalar  extends IKeyValue {
  [key:string] : string | number | boolean | null
};

//  END:  Basic object types
// ------------------------------------------------------------------

export interface IKeyValPair implements IKeyStr {
  key: string,
  value: string,
};

export interface IKeyValUrl implements IKeyValue {
  [key: string]: any
  help?: string,
  key: string,
  noEmpty?: boolean,
  placeholder?: string,
  uid?: string,
  url?: string,
  value: string,
}

export type TOrderedEnum = {
  order: number,
  value: string,
  label: string,
};

export type TNewItemResponse = {
  uid: ID,
  urlPart: string,
}
