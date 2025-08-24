import type { TemplateResult } from "lit";

export interface IBoolObject { [key: string]: boolean,
}
export interface IStringObject { [key: string]: number };
export interface INumberObject { [key: string]: number };
export interface IAnyObject { [key: string]: any };

export interface TFauxValidity extends IBoolObject {
  badInput ? : boolean,
  customError ? : boolean,
  patternMismatch ? : boolean,
  rangeOverflow ? : boolean,
  rangeUnderflow ? : boolean,
  stepMismatch ? : boolean,
  tooLong ? : boolean,
  tooShort ? : boolean,
  typeMismatch ? : boolean,
  valid ? : boolean,
  valueMissing ? : boolean,
};

export interface TTrueValidity extends TFauxValidity {
  badInput : boolean,
  customError : boolean,
  patternMismatch : boolean,
  rangeOverflow : boolean,
  rangeUnderflow : boolean,
  stepMismatch : boolean,
  tooLong : boolean,
  tooShort : boolean,
  typeMismatch : boolean,
  valid : boolean,
  valueMissing : boolean,
};

export type FReportValidity = (input: TTrueValidity) => string | TemplateResult;
