import { isNonEmptyStr, isObj } from './data.utils';

export default class FauxTarget {
  // ----------------------------------------------------------------
  // START: Public properties

  value;

  validity = {};

  //  END:  Public properties
  // ----------------------------------------------------------------
  // START: Private properties

  _rawValue;

  _localName = '';

  _otherProps = {};

  _externalReport;

  _validityMsg = '';

  //  END:  Private properties
  // ----------------------------------------------------------------
  // START: Constructor

  /**
   * Get a faux target DOM element as would be expected to be in an
   * InputEvent
   *
   * @param {any}    value      Value to be sent with faux input
   *                            elements
   * @param {Object} validity   [{} (empty object)] Input validity props
   * @param {Object} otherProps [{} (empty object)] Any other props you
   *                            might want to add to the event target
   * @param {string} tag        ["input"] Tag name for the event target
   *
   * @returns {Object} Object that mimics an HTML
   *                   input/select/button/textarea field included as
   *                   the `target` property of an event
   */
  constructor(value, validity = {}, otherProps = {}, tag = 'input') {
    this._localName = tag.toLowerCase();
    this.value = value;

    const { reportValidity, rawValue, ...other } = (isObj(otherProps) === true)
      ? otherProps
      : {};

    const unknown = {};

    for (const key of Object.keys(other)) {
      if (typeof this[key] === typeof other[key]) {
        this[key] = other[key];
      } else {
        unknown[key] = other[key];
      }
    }

    this._otherProps = unknown;

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

  get faux() { return true; } // eslint-disable-line class-methods-use-this

  get nodeName() { return this._getTAG(); }

  get rawValue() {
    return (typeof this._rawValue !== 'undefined')
      ? this._rawValue
      : this.value;
  }

  get tagName() { return this._getTAG(); }

  //  END:  Getter methods
  // ----------------------------------------------------------------
  // START: Private methods

  _getTAG() { return this._localName.toUpperCase(); }

  _setValidity(_validity) {
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

  checkValidity() {
    for (const key of Object.keys(this.validity)) {
      const tmp = (key === 'valid')
        ? !this.validity[key]
        : this.validity[key];

      if (tmp === true) {
        return false;
      }
    }

    return true;
  }

  other(prop) {
    return this._otherProps[prop];
  }

  reportValidity() {
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
