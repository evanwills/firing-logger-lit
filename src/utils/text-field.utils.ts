import { html, type TemplateResult } from "lit";
import type { FValidationMessage } from "../types/renderTypes.d.ts";
import type InputValue from "./InputValue.class.ts";

export const getCustomErrorMsg = (
  fieldName: string,
  type: string,
  min : number | null,
  max : number | null,
) : FValidationMessage => {
  const msg = getCustomHelpMsg(fieldName, type, min, max);
  return (target : HTMLInputElement | InputValue) : string | TemplateResult => {
    if (target.validity.patternMismatch === true
      || target.validity.tooLong === true
      ||target.validity.tooShort === true
    ) {
      return msg;
    }

    const output = target.reportValidity();

    return (typeof output !== 'boolean')
      ? output
      : '';
  };
};

export const getCustomHelpMsg = (
  fieldName: string,
  type: string,
  min : number | null,
  max : number | null,
) : TemplateResult => {
  const _min = (min !== null)
    ? min
    : 3;

  const _max = (max !== null)
    ? max
    : 50;

  let startWith = 'must start with a letter';
  const okChars = html`and spaces, plus the following punctuation characters:<br />"-", ",", ".", "(", ")", ":", "&", "/"`;
  let extraOK = '';

  let rules = 'alphabetical letters';

  switch (type) {
    case 'name':
      break;
    case 'title':
      rules += ', numbers ';
      startWith += ' or number';
      extraOK += ', "+"'
      break;
    default:
      return '';
  }

  return html`
    ${fieldName} ${startWith}.<br />
    It must have at least ${_min} characters and no more than ${_max} characters.<br />
    It can only contain ${rules} ${okChars}${extraOK}.`
}
