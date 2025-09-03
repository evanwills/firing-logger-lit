import type { FReportValidity, TFauxValidity, TTrueValidity } from "../types/fauxDom";
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
  value : string | number | object,
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

export const getTrueValidity = (overrdes : TFauxValidity = {}) : TTrueValidity => {
  const output : TTrueValidity = {
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
  };

  for (const key of Object.keys(output)) {
    if (typeof overrdes[key] === 'boolean') {
      output[key] = overrdes[key];
    }
  }

  return output;
};

export const dispatchCustomEvent = (
  node : HTMLElement,
  value : string | number | object,
  validity : TTrueValidity,
  report : FReportValidity | null = null,
  type : string = 'change',
) : void => {
  node.dispatchEvent(getCustomEvent(value, validity, report, type));
};

export const dispatchFLaction = (
  node : HTMLElement,
  type : string,
  payload : any,
  userID : string,
) : void => {
  console.group('dispatchFLaction()');
  console.log('node:', node);
  console.log('type:', type);
  console.log('payload:', payload);
  console.log('userID:', userID);
  console.groupEnd();
  node.dispatchEvent(
    new CustomEvent(
      'flaction',
      {
        bubbles: true,
        composed: true,
        detail: {
          type,
          payload,
          userID,
          time: Date.now(),
        },
      },
    )
  )
};

/**
 * Get value to increment numberic input based on control and shift
 * key states.
 *
 * @param event
 * @returns
 */
export const getIncrement = (event: KeyboardEvent) : { inc: number, minus: number, _default: number } => {
  let inc = 0;
  let minus = 0;
  let _default = -273;
  const moveKeys = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'];
  const a = moveKeys.indexOf(event.key);

  if (a >= 0) {
    inc = (a < 2)
      ? 1
      : -1;
    minus = inc;
    if (event.ctrlKey === true) {
      inc *= (event.shiftKey === true)
        ? 20
        : 10;
    } else if (event.shiftKey === true) {
      inc *= 5;
    }

    return { inc, minus, _default };
  }

  const pageKeys = ['PageUp', 'PageDown'];
  const b = pageKeys.indexOf(event.key);

  if (b >= 0) {
    inc = (b === 0)
      ? 10
      : -10;
    _default = 0;

    if (event.shiftKey === true) {
      inc *= 2;
    }
  }

  return { inc, minus, _default };
};
