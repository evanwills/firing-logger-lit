import type { TemplateResult } from 'lit';
import type { IKeyBool } from "./data-simple.d.ts";

export interface TFauxValidity extends IKeyBool {
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
