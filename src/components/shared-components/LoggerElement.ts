import { LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { IKeyValue } from '../../types/data-simple.d.ts';
import type { TUser } from "../../types/data.d.ts";
import type { CDataStoreClass } from '../../types/store.d.ts';
import { c2f, f2c, i2m, m2i, x2x } from '../../utils/conversions.utils.ts';
import { getDataStoreClassSingleton } from '../../store/FiringLoggerStore.class.ts';
import './loading-spinner.ts';
import { storeCatch } from "../../store/idb-data-store.utils.ts";
import { isUser } from "../../types/data.type-guards.ts";
import { getCookie } from "../../utils/cookie.utils.ts";

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

  _user : TUser | null = null;

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  _userHasAuth(level: number) : boolean {
    if (this._user === null || isUser(this._user) === false) {
      return false;
    }

    const sessionID = getCookie('SessionID');
    if (sessionID === null || this._user.id !== sessionID || this._user.adminLevel < level)  {
      return false;
    }

    return true;
  }

  _userCan(key: string, level : number = 1) : boolean {
    if (this._user !== null && isUser(this._user) && this._userHasAuth(level)) {
      switch(key) {
        case 'canFire':
          return this._user.canFire;

        case 'canLog':
          return this._user.canLog;

        case 'canPack':
          return this._user.canPack;

        case 'canPrice':
          return this._user.canPrice;

        case 'canProgram':
          return this._user.canProgram;

        case 'canUnpack':
          return this._user.canUnpack;
      }
    }

    return false;
  }


  _setUser(user: TUser | null) : void {
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
        this._tUnit = 'in';
      } else {
        this._tConverter = x2x;
        this._tConverterRev = x2x;
        this._tUnit = 'C';
        this._lConverter = x2x;
        this._lConverterRev = x2x;
        this._tUnit = 'mm';
      }
    }
  }

  async _getFromStore() : Promise<void> {
    if (this._store === null) {
      this._store = await getDataStoreClassSingleton();
      this._store.read('UserPreferences', '', true).then(this._setUser.bind(this)).catch(storeCatch);
      this._dbReady = true;
    }
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
