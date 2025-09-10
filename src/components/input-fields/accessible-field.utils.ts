
import type { FSanitise, FValidationMessage } from "../../types/renderTypes.d.ts";

export const getNameError : FValidationMessage = (target : HTMLInputElement) : string => {
  if (target.checkValidity() === true) {
    return '';
  }

  if (target.validity.patternMismatch) {
    return 'Only alpha-numeric character, spaces, hyphens ("-"), '
      + 'full stops ("."), commas (","), collons (":"), ampersand '
      + '("&") and forward slashes "/" are allowed.'
  }

  if (target.validity.valueMissing) {
    return 'Please enter a name'
  }

  return target.validationMessage
};

export const sanitiseName : FSanitise = (input: string) : string => input.replace(/^[\s\d]+/, '').replace(/\s+/g, ' ');
