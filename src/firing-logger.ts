import { LitElement, css, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { getDataStoreClassSingleton } from './data/PidbDataStore.class.ts';
import { wrapApp } from './utils/lit.utils.ts';
import './components/lit-router/lit-router.ts';
import type { CDataStoreClass } from "./types/store.d.ts";

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

  _updateReady() {
    // console.group('<firing-logger>._updateReady()');
    // console.info('DB is now ready');
    this._ready = true;
    // console.groupEnd();
  }

  _addReadyWatcher(db: CDataStoreClass) : void {
    // console.group('<firing-logger>._addReadyWatcher()');
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

    this._path = globalThis.location.pathname;
    // console.log('this._path:', this._path);

    getDataStoreClassSingleton().then(this._addReadyWatcher.bind(this));
    // console.groupEnd();
  }

  render() : TemplateResult | string {
    // console.group('<firing-logger>.render()');
    // console.log('this._path:', this._path);
    // console.log('this._ready:', this._ready);
    // console.groupEnd();

    return (this._ready === true)
      ? html`<lit-router initial-route="${this._path}" .wrapperFunc=${wrapApp}></lit-router>`
      : 'Not ready yet';
  }

  static styles = css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 6rem 2rem 2rem;
      text-align: center;
      width: calc(100% - 4rem);
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
