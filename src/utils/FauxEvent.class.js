import { isObj } from './data-utils';
import FauxTarget from './FauxTarget.class';

export default class FauxEvent {
  // ----------------------------------------------------------------
  // START: Private properties

  _isKeyboard = false;

  _keyboard = {};

  _target;

  _timeStamp = 0;

  _type = '';

  //  END:  Private properties
  // ----------------------------------------------------------------
  // START: Constructor

  constructor(
    value,
    rawValue = undefined,
    validity = {},
    otherProps = {},
    type = 'change',
    tag = 'input',
  ) {
    this._timeStamp = Date.now();

    this._type = type;

    const { keyboard, _otherProps } = (isObj(otherProps) === true)
      ? otherProps
      : {};

    if (this.type.toLowerCase().startsWith('key')) {
      if (isObj(keyboard)) {
        this._keyboard = keyboard;
      } else {
        throw new Error(
          'FauxEvent constructor expects fourth argument '
          + '`otherProps` to contain object: `keyboard`. '
          + `${typeof keyboard} given`,
        );
      }

      this._iskeyboard = true;
    }

    this.target = new FauxTarget(value, rawValue, validity, _otherProps, tag);
  }

  //  END:  Constructor
  // ----------------------------------------------------------------
  // START: Getter methods

  get altKey() { return this._getKeyboardProp('altKey'); }

  get bubbles() { return false; } // eslint-disable-line class-methods-use-this

  get cancelable() { return false; } // eslint-disable-line class-methods-use-this

  get code() { return this._getKeyboardProp('code'); }

  get composed() { return false; } // eslint-disable-line class-methods-use-this

  get ctrlKey() { return this._getKeyboardProp('ctrlKey'); }

  get currentTarget() { return this._target; }

  get defaultPrevented() { return false; } // eslint-disable-line class-methods-use-this

  get faux() { return true; } // eslint-disable-line class-methods-use-this

  get isTrusted() { return true; } // eslint-disable-line class-methods-use-this

  get isComposing() { return this._getKeyboardProp('isComposing'); }

  get key() { return this._getKeyboardProp('key'); }

  get location() { return this._getKeyboardProp('location'); }

  get metaKey() { return this._getKeyboardProp('metaKey'); }

  get repeat() { return this._getKeyboardProp('repeat'); }

  get shiftKey() { return this._getKeyboardProp('shiftKey'); }

  get target() { return this._target; }

  get timeStamp() { return this._timeStamp; }

  get type() { return this._type; }

  //  END:  Getter methods
  // ----------------------------------------------------------------
  // START: Public methods

  /**
   * Get the modifier state of a particular keyboard modifier key
   *
   * @param {string} key Modifier key whose state is to be returned
   *
   * @returns {boolean} TRUE if the modifier state has been set to
   *                    true. FALSE otherwise
   *
   * @throws {Error} If Event is not a keyboard event
   */
  getModifierState(key) {
    try {
      switch (key) {
        case 'Alt':
        case 'AltGraph':
          return this._getKeyboardProp('altKey');

        case 'Control':
          return this._getKeyboardProp('ctrlKey');

        case 'Meta':
          return this._getKeyboardProp('metaKey');

        case 'Shift':
          return this._getKeyboardProp('shiftKey');

        default:
          // Other known modifier states:
          // * "Capslock"
          // * "Fn"
          // * "NumLock"
          // * "OS"
          // * "ScrollLock"
          // Anything else will always return FALSE
          return this._getKeyboardProp(key);
      }
    } catch (error) {
      throw Error(error);
    }
  }

  //  END:  Public methods
  // ----------------------------------------------------------------
  // START: Private methods

  _getKeyboardProp(prop) {
    if (this._isKeyboard === false) {
      throw new Error('FauxEvent is not a keyboard event');
    }

    if (typeof this._keyboard[prop] !== 'undefined') {
      return this._keyboard[prop];
    }

    if (prop === 'code' || prop === 'key') {
      return '';
    }

    if (prop === 'location') {
      return 0;
    }

    return false;
  }

  //  END:  Private methods
  // ----------------------------------------------------------------
}
