import { LitElement, css, html, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
// import { nanoid } from 'nanoid';
import type { CDataStoreClass } from './types/store.d.ts';
import { getDataStoreClassSingleton } from './store/FiringLogger.store.ts';
import { wrapApp } from './utils/lit.utils.ts';
import './components/lit-router/lit-router.ts';

// We want to initialise the data store as soon as possible
getDataStoreClassSingleton();

/**
 * An example element.
 *
 */
@customElement('firing-logger')
export class FiringLogger extends LitElement {
  /**
   * Whether or not we are ready to render the app
   */
  @state()
  _ready : boolean = false;

  /**
   * Whether or not we are ready to render the app
   */
  @state()
  _db : CDataStoreClass | null = null;

  @state()
  _path : string = '';

  @state()
  _search : string = '';

  @state()
  _hash : string = '';

  _updateReady() {
    // console.group('<firing-logger>._updateReady()');
    // console.info('DB is now ready');
    this._ready = true;
    if (this._db !== null && this._db.ready === true) {
      console.info('Fetching latest data on startup');
      // console.log('this._db:', this._db);
      // console.group('this._db.dispatch()');
      // console.log('this._db.dispatchs:', this._db.dispatchs);
      // console.groupEnd();
      // We don't await this - we just want to kick it off
      // and let it happen in the background
      this._db.dispatch('fetchLatest', null).catch((error) => {
        console.error('Failed to fetch latest data on startup:', error);
      });
    }
    // console.groupEnd();
  }

  _addReadyWatcher(db: CDataStoreClass) : void {
    // console.group('<firing-logger>._addReadyWatcher()');
    this._db = db;
    if (db.ready === false) {
      db.watchReady(this._updateReady.bind(this));
    } else {
      this._ready = true;
    }
    // console.groupEnd();
  };

  connectedCallback(): void {
    super.connectedCallback();

    // console.group('<firing-logger>.connectedCallback()');
    // console.info('ID:', nanoid(10));
    // console.log('globalThis.location:', globalThis.location);

    this._hash = globalThis.location.hash;
    this._path = globalThis.location.pathname;
    this._search = globalThis.location.search;
    // console.log('this._hash:', this._hash);
    // console.log('this._path:', this._path);
    // console.log('this._search:', this._search);

    getDataStoreClassSingleton().then(this._addReadyWatcher.bind(this));
    // console.groupEnd();

    // Usage:
    // const value = getCookie(import.meta.env.VITE_AUTH_COOKIE);
    // if (value !== null) {
    //   console.log(`Cookie - ${import.meta.env.VITE_AUTH_COOKIE}:`, value);
    // } else {
    //   console.log('Cookie does not exist or has expired.');
    // }
  }

  render() : TemplateResult | string {
    // console.group('<firing-logger>.render()');
    // console.log('this._path:', this._path);
    // console.log('this._ready:', this._ready);
    // console.log('this._db:', this._db);
    // console.groupEnd();

    return (this._ready === true)
      ? html`<lit-router
          initial-hash="${this._hash}"
          initial-route="${this._path}"
          initial-search="${this._search}"
          .store=${this._db}
          .wrapperFunc=${wrapApp}></lit-router>`
      : 'Not ready yet';
  }

  static styles = css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      width: calc(100% - 2rem);
      container-type: inline-size;
      container-name: firing-logger;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'firing-logger': FiringLogger
  }
}
