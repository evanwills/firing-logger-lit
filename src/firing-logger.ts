import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { nanoid } from 'nanoid';
import { getDataStoreSingleton } from "./data/IdbDataStore.class.ts";
import './components/lit-router/lit-router.ts'


getDataStoreSingleton();

/**
 * An example element.
 *
 */
@customElement('firing-logger')
export class FiringLogger extends LitElement {
  /**
   * Copy for the read the docs hint.
   */
  @property()
  docsHint = 'Click on the Vite and Lit logos to learn more';

  /**
   * The number of times the button has been clicked.
   */
  @state()
  ready : boolean = false;

  @state()
  firingID : string = nanoid(10);

  @state()
  userID : string = nanoid(10);

  @state()
  _path : string = '';

  updateReady() {
    console.groupCollapsed('<firing-logger>.updateReady');
    console.info('DB is now ready');
    this.ready = true;
    console.groupEnd();
  }

  connectedCallback(): void {
    super.connectedCallback();

    this._path = globalThis.location.pathname;

    // console.log('this._path:', this._path);
    const db = getDataStoreSingleton();
    db.watchReady(this.updateReady.bind(this));
  }

  render() {
    // console.group('<firing-logger>.render()');
    // console.log('this.firingID:', this.firingID);
    // console.log('this.firingID:', this.firingID);
    // console.log('this.userID:', this.userID);
    // console.groupEnd();

    return html`
      <h1>Firing Logger</h1>
      <p>A kiln firing logger and plotter.</p>
      <p>ID: <code>${nanoid(10)}</code></p>

      ${(this.ready === true)
        ? html`
          <lit-router initial-route="${this._path}">`
        : ''
      }
    `
  }

  static styles = css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
      width: calc(100% - 4rem);
    }

    .logo {
      height: 6em;
      padding: 1.5em;
      will-change: filter;
      transition: filter 300ms;
    }
    .logo:hover {
      filter: drop-shadow(0 0 2em #646cffaa);
    }
    .logo.lit:hover {
      filter: drop-shadow(0 0 2em #325cffaa);
    }

    .card {
      padding: 2em;
    }

    .read-the-docs {
      color: #888;
    }

    ::slotted(h1) {
      font-size: 3.2em;
      line-height: 1.1;
    }

    a {
      font-weight: 500;
      color: #646cff;
      text-decoration: inherit;
    }
    a:hover {
      color: #535bf2;
    }

    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #1a1a1a;
      cursor: pointer;
      transition: border-color 0.25s;
    }
    button:hover {
      border-color: #646cff;
    }
    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }

    @media (prefers-color-scheme: light) {
      a:hover {
        color: #747bff;
      }
      button {
        background-color: #f9f9f9;
      }
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'firing-logger': FiringLogger
  }
}
