import type { TemplateResult } from 'lit';
import type { FReportValidity, TFauxValidity, TTrueValidity } from '../types/fauxDom.d.ts';
import { getTrueValidity } from './event.utils.ts';
import type { IKeyValue } from '../types/data-simple.d.ts';
import { numOrNan } from './numeric.utils.ts';
import { dateOrNull } from './date-time.utils.ts';

export default class InputValue {
  // ------------------------------------------------------
  // START: Private properties

  _defaultValue : string | number | object;

  _id : string;

  _name : string;

  _reportValidity : null | FReportValidity;

  _validity : TTrueValidity;

  _value : string | number | IKeyValue;

  //  END:  Private properties
  // ------------------------------------------------------
  // START: Constructor

  /**
   *
   * @param value          Current value of the field
   * @param validity       Validity state of the field
   * @param ogTarget       Input/Select/Textarea element that
   *                       triggered the event
   * @param reportValidity (optional) function to do provide custom
   *                       error messages if user input is invalid
   */
  constructor(
    value : string | number | IKeyValue,
    validity : TFauxValidity,
    ogTarget : HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | InputValue,
    reportValidity : null | FReportValidity = null,
    defaultValue : string | null = null,
  ) {
    this._value = value;

    this._validity = getTrueValidity();

    this._id = ogTarget.id;
    this._name = (ogTarget.name !== '')
      ? ogTarget.name
      : ogTarget.id;

    if (ogTarget instanceof HTMLSelectElement === false) {
      this._defaultValue = ogTarget.defaultValue;
    } else {
      // @todo work out how to find the default selected option of select input
      this._defaultValue = (defaultValue !== null)
        ? defaultValue
        : this._getDefaultOption(ogTarget);
    }

    this._setValidity(validity);

    this._reportValidity = reportValidity;
  }

  //  END:  Constructor
  // ------------------------------------------------------
  // START: Private methods

  _getDefaultOption(field : HTMLSelectElement) : string {
    const defaultOption = field.querySelector('option[selected]');

    return (defaultOption !== null)
      ? (defaultOption as HTMLOptionElement).value
      : '';
  }

  _setValidity(validity : TFauxValidity) : void {
    let invalid : boolean = false;
    for (const key of Object.keys(this._validity)) {
      if (typeof validity[key] === 'boolean') {
        this._validity[key] = validity[key];
        if (key !== 'valid' && validity[key] === true) {
          invalid = true;
        }
      }
    }

    this._validity.valid = !invalid;
  }

  //  END:  Private methods
  // ------------------------------------------------------
  // START: Public getters

  get value() : string | number | IKeyValue { return this._value; }

  get defaultValue() : string | number | IKeyValue { return this._defaultValue; }

  get validity() : TTrueValidity { return this._validity; }

  get id() : string {
    return (this._id !== '')
      ? this._id
      : this._name;
  }

  get name() : string {
    return (this._name !== '')
      ? this._name
      : this._id;
  }

  get defaultAsDate() : Date | null {
    return dateOrNull(this._defaultValue);
  }

  get defaultAsNumber() : number {
    return numOrNan(this._defaultValue);
  }

  get valueAsDate() : Date | null {
    return dateOrNull(this._value);
  }

  get valueAsNumber() : number {
    return numOrNan(this._value);
  }

  get isNewValue() : boolean { return this._value !== this._defaultValue; }

  //  END:  Public getters
  // ------------------------------------------------------
  // START: Public methods

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
      return 'Length of input is too long';
    }
    if (this._validity.tooShort) {
      return 'Length of input is not long enough';
    }
    if (this._validity.typeMismatch) {
      return 'Input was wrong type';
    }
    if (this._validity.valueMissing) {
      return 'No input';
    }

    return '';
  }

  //  END:  Public methods
  // ------------------------------------------------------
}
