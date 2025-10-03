import type { TemplateResult } from 'lit';

export type TLogEntryOptionItem = {
  label: string,
  value: number,
};

export type TLogEntryOption = {
  key: string,
  label: string,
  options: [TLogEntryOptionItem],
  value: number,
};

export type TUserEnteredOptions = { [key:string]: number };

export type FValidationMessage = (target : HTMLInputElement | InputValue) => string | TemplateResult;

export type TOptionValueLabel = {
  value: string,
  label: string,
};
export type TCheckboxValueLabel = {
  value: string,
  label: string,
  checked: boolean,
};

export type FSanitise = (input: string) => string;

export type FWrapOutput = (input : TemplateResult | string) => TemplateResult;

export type FIsChecked = (option : TCheckboxValueLabel | TOptionValueLabel) => boolean;

export type FGetID = (option : TCheckboxValueLabel | TOptionValueLabel) => string;
