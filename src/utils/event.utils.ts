import type { FReportValidity, TTrueValidity } from "../types/fauxDom";
import { isNonEmptyStr } from "./data.utils";
import InputValue from "./InputValue.class"

/**
 * Get a new custom event to dispatch
 *
 * @param event An event triggered by a input field within a custom
 *              element
 * @param type  Overrride type to use as the Custom event's type.
 *              (If omitted or empty string the original event's
 *              type will be used)
 *
 * @returns a new CustomEvent object
 */
export const getCustomEvent = (
  value : string | number,
  validity : TTrueValidity,
  report : null | FReportValidity = null,
  type : string = 'change',
) : CustomEvent => {

  return new CustomEvent(
    type,
    {
      bubbles: true,
      composed: true,
      detail: new InputValue(value, validity, report),
    },
  );
};

export const getTrueValidity = () : TTrueValidity => ({
  badInput: false,
  customError: false,
  patternMismatch: false,
  rangeOverflow: false,
  rangeUnderflow: false,
  stepMismatch: false,
  tooLong: false,
  tooShort: false,
  typeMismatch: false,
  valid: true,
  valueMissing: false,
});

export const dispatchCustomEvent = (
  node : HTMLElement,
  value : string | number,
  validity : TTrueValidity,
  report : FReportValidity | null = null,
  type : string = 'change',
) : void => {
  node.dispatchEvent(getCustomEvent(value, validity, report, type));
};
