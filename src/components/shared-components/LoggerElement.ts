import { LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { IKeyValue } from '../../types/data-simple.d.ts';
import { c2f, f2c, i2m, m2i, x2x } from '../../utils/conversions.utils.ts';
import type { CDataStoreClass } from '../../types/store.d.ts';
import { getDataStoreClassSingleton } from '../../store/FiringLoggerStore.class.ts';
import './loading-spinner.ts';

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

  /**
   * A list of key/value pairs that can be used to preset filter
   * values
   *
   * @property
   */
  @property({ type: Object, attribute: 'filters' })
  filters : IKeyValue | null = null;

  /**
   * Anchor link hash ID so the page can be scrolled into view
   *
   * @property
   */
  @property({ type: String, attribute: 'hash' })
  hash : string = '';

  /**
   * Whether or not to render length and weight values in imperial
   * units & values
   *
   * @property
   */
  @property({ type: Boolean, attribute: 'not-metric' })
  notMetric : boolean = false;

  /**
   * Whether or not to prevent the user editing values
   *
   * @property
   */
  @property({ type: Boolean, attribute: 'read-only' })
  readOnly : boolean = false;

  //  END:  properties/attributes
  // ------------------------------------------------------
  // START: state

  @state()
  _dbReady : boolean = false;

  @state()
  _ready : boolean = false;

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
  _store : CDataStoreClass | null = null;

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

  _watchReady(_isReady : boolean) : void {
    this._dbReady = true;
  }

  async _getFromStore() : Promise<void> {
    if (this._store === null) {
      this._store = await getDataStoreClassSingleton(this._watchReady.bind(this));
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
