import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import type { ID } from '../types/data.d.ts';
import { c2f, f2c, i2m, m2i, x2x } from '../utils/conversions.utils.ts';
import type { TDataStore } from '../types/store.d.ts';
import { getDataStoreSingleton } from '../data/IdbDataStore.class.ts';

/**
 * `LoggerElement` is a renderless extension of `LitElement`. It
 * provides standard functionality that most Firing Logger elements
 * will need.
 *
 * It provides:
 * * Initialising
 *
 * It is intended that Firing Logger custom element extend
 * `LoggerElement` rather than extending `LitElement` directly.
 */
export class LoggerElement extends LitElement {
  // ------------------------------------------------------
  // START: properties/attributes

  @property({ type: Boolean, attribute: 'not-metric' })
  notMetric : boolean = false;

  @property({ type: String, attribute: 'user-uid' })
  userID : ID = '';

  @property({ type: Boolean, attribute: 'read-only' })
  readOnly : boolean = false;

  //  END:  properties/attributes
  // ------------------------------------------------------
  // START: state

  /**
   * Convert temperature from Celcius to Fahrenheit
   * (if needed)
   *
   * @var _tConverter
   */
  _tConverter : (T : number) => number = x2x;

  /**
   * Convert temperature from Fahrenheit to Celcius
   * (if needed)
   *
   * @var _tConverter
   */
  _tConverterRev : (T : number) => number = x2x;

  /**
   * Convert length from Millimetres to Inches
   * (if needed)
   *
   * @var _lConverter
   */
  _lConverter : (T : number) => number = x2x;

  /**
   * Convert length from Inches to Millimetres
   * (if needed)
   *
   * @var _lConverter
   */
  _lConverterRev : (T : number) => number = x2x;

  /**
   * Global store object that allows the component to read from the
   * store and write to the store. And watch for changes in the store
   *
   * @var _store
   */
  _store : TDataStore | null = null;

  /**
   * @var _tUnit Temperature unit indicator to match user's preference
   */
  _tUnit : string = 'C';

  /**
   * @var _lUnit Length unit indicator to match user's preference
   */
  _lUnit : string = 'mm';

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  _getFromStore() : void {
    if (this._store === null) {
      this._store = getDataStoreSingleton();
    }
  }

  //  END:  helper methods
  // ------------------------------------------------------
  // START: lifecycle methods

  connectedCallback() : void {
    super.connectedCallback();

    if (this.notMetric === true) {
      this._tConverter = c2f;
      this._tConverterRev = f2c;
      this._tUnit = 'F';
      this._lConverter = m2i;
      this._lConverterRev = i2m;
      this._tUnit = 'in';
    }
  }

  //  END:  lifecycle methods
  // ------------------------------------------------------
}
