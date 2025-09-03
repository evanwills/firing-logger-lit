import type { TemplateResult } from 'lit';
import type { FReportValidity, TFauxValidity, TTrueValidity } from '../types/fauxDom';
import { getTrueValidity } from './event.utils';

export default class {
  _value : string | number | object;

  _validity : TTrueValidity;

  _reportValidity : null | FReportValidity;

  constructor(
    value : string | number | object,
    validity: TFauxValidity,
    reportValidity : null | FReportValidity = null,
  ) {
    this._value = value;

    this._validity = getTrueValidity();

    this._setValidity(validity);

    this._reportValidity = reportValidity;
  }

  _setValidity(validity : TFauxValidity) {
    for (const key of Object.keys(this._validity)) {
      if (typeof validity[key] === 'boolean') {
        this._validity[key] = validity[key];
      }
    }
  }

  get value() { return this._value; }

  get validity() { return this._validity; }

  checkValidity() : boolean {
    for (const key of Object.keys(this._validity)) {
      const tmp = (key === 'valid')
        ? !this._validity[key]
        : this._validity[key];

      if (tmp === true) {
        return false;
      }
    }

    return true;
  }

  reportValidity() : string | TemplateResult {
    if (this._reportValidity !== null) {
      return this._reportValidity(this._validity);
    }

    if (this._validity.badInput) {
      return 'Bad input';
    }
    if (this._validity.customError) {
      return 'There was an error with your input';
    }
    if (this._validity.patternMismatch) {
      return 'Input did not match required pattern';
    }
    if (this._validity.rangeOverflow) {
      return 'Value exeeded upper limit';
    }
    if (this._validity.rangeUnderflow) {
      return 'Value is below lower limit';
    }
    if (this._validity.stepMismatch) {
      return 'Input falls between allowed steps';
    }
    if (this._validity.tooLong) {
      return 'Length of input was too long';
    }
    if (this._validity.tooShort) {
      return 'Length of input was not long enough';
    }
    if (this._validity.typeMismatch) {
      return 'Input was wrong type';
    }
    if (this._validity.valueMissing) {
      return 'No input';
    }

    return '';
  }
}
