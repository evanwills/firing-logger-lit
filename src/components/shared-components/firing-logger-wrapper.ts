import { css, html, LitElement, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { nanoid } from 'nanoid';
import { deleteCookie, getCookie } from '../../utils/cookie.utils.ts';
import { linkStyle } from '../../assets/css/link-style.ts';
// import { isNonEmptyStr } from '../../utils/string.utils.ts';
import './login-ui.ts';
import { LitRouter } from '../lit-router/lit-router.ts';

@customElement('firing-logger-wrapper')
export class FiringLoggerWrapper extends LitElement {
  // ------------------------------------------------------
  // START: properties/attributes`;

  //  END:  properties/attributes
  // ------------------------------------------------------
  // START: state

  @state()
  _isLoggedIn : boolean = false;

  @state()
  _showLogin : boolean = false;

  @state()
  _loginUI : HTMLDialogElement | null = null;

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  _watchAuthExpire() {
    this._isLoggedIn = (getCookie(import.meta.env.VITE_AUTH_COOKIE) !== null);

    if (this._isLoggedIn === true) {
      setTimeout(this._watchAuthExpire.bind(this), 1000);
    }
  }

  //  END:  helper methods
  // ------------------------------------------------------
  // START: lifecycle methods

  connectedCallback() {
    super.connectedCallback();

    this._watchAuthExpire();
  }

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper render methods

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: event handlers

  loginLogout(event : Event) {
    event.preventDefault();

    if (getCookie(import.meta.env.VITE_AUTH_COOKIE) === null) {
      this._showLogin = true;
    } else {
      deleteCookie(import.meta.env.VITE_AUTH_COOKIE);

      this._isLoggedIn = false;
      this._showLogin = false;

      LitRouter.dispatchRouterEvent(this, '/logout', {}, 'refresh');
    }
  }

  _handleLogin() {
    this._showLogin = false;
    this._watchAuthExpire();
  }

  //  END:  event handlers
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult {
    const dir = (this._isLoggedIn === false)
      ? 'in'
      : 'out';

    return html`
    <div class="wrap">
      <header>
        <h1 class="title"><router-link url="/">Firing Logger</router-link></h1>
        <p>A kiln firing logger and plotter.</p>
        <nav>
          <ul>
            <li><router-link
              url="/kilns"
              label="Kilns"></router-link></li>
            <li><router-link
              url="/programs"
              label="Programs"></router-link></li>
            <li><router-link
              url="/firings"
              label="Firings"></router-link></li>
            <li><a href="/log${dir}" @click=${this.loginLogout}>Log${dir}</a></li>
          </ul>
        </nav>
      </header>

      <main><slot></slot></main>

      <login-ui
        .open=${this._showLogin}
        @close=${this._handleLogin}
        @loggedin=${this._handleLogin}></login-ui>

      <footer>
        <p>ID: <code>${nanoid(10)}</code></p>
      </footer>
    </div>
    `;
  }
  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`
    div.wrap {
      container-type: inline-size;
      container-name: firing-logger;
      margin: 0 auto;
      padding: 4.5rem 0 2rem;
      text-align: center;
      width: 100%;
    }
    header {
      background-color: var(--bg-colour, #242424);
      border-bottom: 0.05rem solid;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      left: 0;
      padding: 0.5rem 2rem 0.5rem;
      position: fixed;
      right: 0;
      top: 0;
      width: 100%;
      z-index: 10;
    }
    header h1 {
      --rl-colour: var(--font-colour, #fff);
      --rl-text-decoration: none;
      --rl-hover-text-decoration: underline;
      flex-grow: 1;
      line-height: 1.5rem;
      margin: 0 0 0.5rem;
      text-align: center;
    }
    header p {
      display: none;
      font-family: 'Lucida Handwriting', cursive;
      transform: translateY(0.25rem);
    }
    header ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      column-gap: 1rem;
      grid-area: nav;
    }
    .title {
      font-family: var(--title-font, 'Harlow Solid', cursive);
    }
    main {
      max-width: var(--max-width, 50rem);
      margin: 0 auto;
    }

    @container firing-logger (inline-size > 30rem) {
      header {
        align-items: center;
        flex-direction: row;
        padding: 1rem 2rem 1.5rem;
      }
      header h1 {
        flex-grow: 1;
        margin: 0;
        line-height: 1.5rem;
        text-align: left;
      }
    }

    @container firing-logger (inline-size > 50rem) {
      header h1 {
        flex-grow: 0;
      }
      header p {
        display: block;
        flex-grow: 1;
        margin: 0;
      }
    }

    footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
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

    ${linkStyle}

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
  `;

//  END:  styles
// ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'firing-logger-wrapper': FiringLoggerWrapper,
  }
};
