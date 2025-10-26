import { LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { FConverter, IKeyValue } from '../../types/data-simple.d.ts';
import type { TUser } from '../../types/users.d.ts';
import type { CDataStoreClass, TStoreAction } from '../../types/store.d.ts';
import { c2f, f2c, i2m, m2i, x2x } from '../../utils/conversions.utils.ts';
import { storeCatch } from '../../store/PidbDataStore.utils.ts';
import { isUser } from '../../types/user.type-guards.ts';
import { userCan, userHasAuth } from '../users/user-data.utils.ts';
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

  /**
   * Global store object that allows the component to read from the
   * store and write to the store. And watch for changes in the store
   *
   * @var _store
   */
  @property({ type: Object, attribute: 'store' })
  store : CDataStoreClass | null = null;

  //  END:  properties/attributes
  // ------------------------------------------------------
  // START: state

  /**
   * Whether or not to render length and weight values in imperial
   * units & values
   */
  @state()
  _notMetric : boolean = false;

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
  @state()
  _tConverter : FConverter = x2x;

  /**
   * Convert temperature from Fahrenheit to Celcius
   * (if needed)
   *
   * @var _tConverter
   */
  @state()
  _tConverterRev : FConverter = x2x;

  /**
   * Convert length from Millimetres to Inches
   * (if needed)
   *
   * @var _lConverter
   */
  @state()
  _lConverter : FConverter = x2x;

  /**
   * Convert length from Inches to Millimetres
   * (if needed)
   *
   * @var _lConverter
   */
  @state()
  _lConverterRev : FConverter = x2x;

  /**
   * Convert temperature from Celcius to Fahrenheit
   * (if needed)
   *
   * @var _tConverter
   */
  @state()
  _vConverter : FConverter = x2x;

  /**
   * Convert temperature from Fahrenheit to Celcius
   * (if needed)
   *
   * @var _tConverter
   */
  @state()
  _vConverterRev : FConverter = x2x;

  /**
   * @var _tUnit Temperature unit indicator to match user's preference
   */
  @state()
  _tUnit : string = 'C';

  /**
   * @var _lUnit Length unit indicator to match user's preference
   */
  @state()
  _lUnit : string = 'mm';

  /**
   * @var _lUnit Length unit indicator to match user's preference
   */
  @state()
  _vUnit : string = 'lt';

  @state()
  _user : TUser | null = null;

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  _userHasAuth(level: number) : boolean {
    return userHasAuth(this._user, level);
  }

  _userCan(key: string, level : number = 1) : boolean {
    return userCan(this._user, key, level);
  }


  _setUser(user: TUser | null) : void {
    // console.group('LoggerElement._setUser()');
    // console.log('user:', user);

    if (user !== null && isUser(user) === true) {
      this._user = user;
      this._notMetric = (typeof this._user?.notMetric === 'boolean')
        ? this._user.notMetric
        : false;

      if (this._notMetric === true) {
        this._tConverter = c2f;
        this._tConverterRev = f2c;
        this._tUnit = 'F';
        this._lConverter = m2i;
        this._lConverterRev = i2m;
        this._lUnit = 'in';
      } else {
        this._tConverter = x2x;
        this._tConverterRev = x2x;
        this._tUnit = 'C';
        this._lConverter = x2x;
        this._lConverterRev = x2x;
        this._lUnit = 'mm';
      }
    }
    // console.log('this._user:', this._user);
    // console.log('this._notMetric:', this._notMetric);
    // console.groupEnd();
  }

  _getFromStore() : void {
    // console.group('LoggerElement._getFromStore()');
    // console.log('this.store:', this.store);

    if (this.store !== null) {
      this.store.dispatch('getLoggedInUser' as TStoreAction)
        .then(this._setUser.bind(this))
        .catch(storeCatch);

      this._dbReady = true;
    }

    // console.groupEnd();
  }

  //  END:  helper methods
  // ------------------------------------------------------
  // START: lifecycle methods

  connectedCallback() : void {
    super.connectedCallback();
  }

  //  END:  lifecycle methods
  // ------------------------------------------------------
}
