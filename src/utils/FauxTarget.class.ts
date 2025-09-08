import type { IKeyValue } from "../types/data.d.ts";
import { isNonEmptyStr, isObj } from './data.utils.ts';

export default class FauxTarget {
  // ----------------------------------------------------------------
  // START: Public properties

  value;

  validity : ValidityState = {
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

  //  END:  Public properties
  // ----------------------------------------------------------------
  // START: Private properties

  _localName = '';

  _otherProps : IKeyValue = {};

  _externalReport;

  _validityMsg = '';

  //  END:  Private properties
  // ----------------------------------------------------------------
  // START: Constructor

  /**
   * Get a faux target DOM element as would be expected to be in an
   * InputEvent
   *
   * @param value      Value to be sent with faux input elements
   * @param validity   [{} (empty object)] Input validity props
   * @param otherProps [{} (empty object)] Any other props you
   *                            might want to add to the event target
   * @param tag        ["input"] Tag name for the event target
   *
   */
  constructor(
    value : string | number,
    validity : IKeyValue = {},
    otherProps : IKeyValue = {},
    tag = 'input',
  ) {
    this._localName = tag.toLowerCase();
    this.value = value;

    const { reportValidity, ...other } = (isObj(otherProps) === true)
      ? otherProps
      : {};

    this._otherProps = other;

    const { validityMsg, ..._validity } = (isObj(validity) === true)
      ? validity
      : {};

    this._setValidity(_validity);

    this._validityMsg = validityMsg;

    this._externalReport = reportValidity;
  }

  //  END:  Constructor
  // ----------------------------------------------------------------
  // START: Getter methods

  get id() {
    return (typeof this._otherProps.id === 'string')
      ? this._otherProps.id
      : '';
  }

  get faux() { return true; } // eslint-disable-line class-methods-use-this

  get nodeName() { return this._getTAG(); }

  get rawValue() {
    return (typeof this._otherProps.rawValue !== 'undefined')
      ? this._otherProps.rawValue
      : this.value;
  }

  get tagName() { return this._getTAG(); }

  //  END:  Getter methods
  // ----------------------------------------------------------------
  // START: Private methods

  _getTAG() { return this._localName.toUpperCase(); }

  _setValidity(_validity : IKeyValue) {
    this.validity = {
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

    if (isObj(_validity)) {
      for (const key of Object.keys(_validity)) {
        if (typeof _validity[key] === 'boolean') {
          this.validity[key] = _validity[key];
        }
      }
    }
  }

  //  END:  Private methods
  // ----------------------------------------------------------------
  // START: Public methods

  checkValidity() : boolean {
    for (const key in this.validity) {
      const tmp = (key === 'valid')
        ? !(this.validity[key] as boolean)
        : (this.validity[key] as boolean);

      if (tmp === true) {
        return false;
      }
    }

    return true;
  }

  other(prop : string) : any {
    return this._otherProps[prop];
  }

  reportValidity() : string {
    const rType = typeof this._externalReport;

    if (rType === 'function') {
      return this._externalReport();
    }

    if (rType === 'string') {
      return this._externalReport;
    }

    return (isNonEmptyStr(this._validityMsg))
      ? this._validityMsg
      : '';
  }

  //  END:  Public methods
  // ----------------------------------------------------------------
}
