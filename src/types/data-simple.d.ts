// ------------------------------------------------------------------
// START: Basic scalar types

import type { TemplateResult } from "lit";

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
  id: ID,
};

export interface IIdNameObject implements IKeyValue, IIdObject {
  id: ID,
  name: string,
};

export interface ILinkObject implements IKeyValue, IIdObject, IIdNameObject {
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
  [key:string] : bool
};

//  END:  Basic object types
// ------------------------------------------------------------------

export interface IKeyValPair implements IKeyStr {
  key: string,
  value: string,
};

export interface IKeyValUrl implements IKeyValue {
  help?: string,
  key: string,
  noEmpty?: boolean,
  uid?: string,
  url?: string,
  value: string,
}
