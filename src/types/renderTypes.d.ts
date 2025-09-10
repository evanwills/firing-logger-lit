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

export type FValidationMessage = (target : HTMLInputElement) => string;

export type TOptionValueLabel = {
  value: string,
  label: string,
};

export type FSanitise = (input: string) => string;
