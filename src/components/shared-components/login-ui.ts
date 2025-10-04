import { css, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { TUser } from '../../types/users.d.ts';
import { setCookie } from '../../utils/cookie.utils.ts';
import { isObj } from '../../utils/data.utils.ts';
import { isNonEmptyStr } from '../../utils/string.utils.ts';
import { LitRouter } from '../lit-router/lit-router.ts';
import { LoggerElement } from './LoggerElement.ts';
import { dialogStyles } from '../../assets/css/dialog.css.ts';
import { fieldListStyles } from '../../assets/css/input-field.css.ts';
import '../input-fields/accessible-text-field.ts';
import '../input-fields/accessible-password-field.ts';

@customElement('login-ui')
export class LoginUI extends LoggerElement {
  // ------------------------------------------------------
  // START: properties/attributes

  @property({ type: Boolean, attribute: 'open', reflect: true })
  open : boolean = false;

  //  END:  properties/attributes
  // ------------------------------------------------------
  // START: state

  @state()
  _showLogin : boolean = false;

  @state()
  _loginUI : HTMLDialogElement | null = null;
  _usernameField : HTMLInputElement | null = null;
  _passwordField : HTMLInputElement | null = null;

  @state()
  _username : string = '';
  _password : string = '';

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  _getDialogNode() : void {
    if (this._loginUI === null) {
      this._loginUI = this.renderRoot.querySelector('dialog');
      this._usernameField = this.renderRoot.querySelector('#username');
      this._passwordField = this.renderRoot.querySelector('#password');
    }
  }

  _dispatchClose(type : string) : void {
    this._username = '';
    this._password = '';

    if (this._loginUI?.open === true) {
      this._loginUI.close();
    }

    this.dispatchEvent(new Event(type));
  }

  //  END:  helper methods
  // ------------------------------------------------------
  // START: lifecycle methods

  connectedCallback() {
    super.connectedCallback();
    this._getFromStore();

    this._getDialogNode();
  }

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper render methods

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: event handlers

  async _login(event : Event | null = null) : Promise<void> {
    if (event !== null) {
      event.preventDefault();
    }

    if (this._username === '') {
      this._usernameField?.focus();
    // } else if (this._password === '') {
    //   console.log('this._passwordField:', this._passwordField);
    //   this._passwordField?.focus();
    } else {
      if (this._store !== null) {
        const user : TUser[] = await this._store.read('users', `username=${this._username}`);

        if (user.length > 0) {
          setCookie(import.meta.env.VITE_AUTH_COOKIE, user[0].id, 30);

          LitRouter.dispatchRouterEvent(this, '/login', { userName : user[0].username }, 'refresh');
        }
      }

      this._dispatchClose('loggedin');
    }
  }

  _changeHandler(event : CustomEvent) : void {
    const value = event.detail._target.value;

    switch (event.detail._target.id) {
      case 'username':
        this._username = value;
        // if (/^[a-z\d]{5,32$/i.test(value)) {
        //   this._username = value;
        // }
        break;

      case 'password':
        this._password = value;
        break;

      default:
        console.error('event:', event);
        throw new Error('could not determine what to do');
    }
  }

  _cancel() : void {
    this._dispatchClose('close');
  }

  _keydownHandler(event : KeyboardEvent) : void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this._cancel();
      return;
    }

    if ((event.key === 's' || event.key === 'S')
      && event.ctrlKey === true && event.altKey === true
    ) {
      event.preventDefault();
      console.info('using keyboard short cut to finish login');

      this._login();
      return;
    }
  }

  _keyupHandler(event : CustomEvent) : void {
    if (isObj(event.detail)) {
      this._changeHandler(event);
    }
  }

  //  END:  event handlers
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult {
    this._getDialogNode();

    const studio = isNonEmptyStr(import.meta.env, 'VITE_STUDIO_NAME')
      ? html` <span class="for">
        for <span class="studio">${import.meta.env.VITE_STUDIO_NAME}</span>
        </span>`
      : '';

    if (this.open === true
      && this._loginUI !== null
      && this._loginUI.open === false
    ) {
      this._loginUI.showModal();
      if (this._usernameField !== null) {
        // console.log('setting docus on username field');
        this._usernameField.focus();
      }
    }

    // NOTE: Below I'm conditionally rendering the input fields so
    //       they get reset each time the <DIALOG> element is opened.
    //       This prevents previous user input values persisting
    return html`
      <dialog id="login" @keydown=${this._keydownHandler} @close=${this._cancel}>
        <h2>Login to <span class="title">Firing Logger</span>${studio}</h2>
        ${(this.open === true)
          ? html`
        <ul>
          <li><accessible-text-field
            field-id="username"
            label="Username"
            @change=${this._changeHandler}
            @keyup=${this._keyupHandler}></accessible-text-field></li>
          <li><accessible-password-field
            field-id="password"
            label="Password"
            @change=${this._changeHandler}
            @keyup=${this._keyupHandler}></accessible-password-field></li>
        </ul>`
          : ''
        }
        <button @click=${this._login}>Login</button>
        <button @click=${this._cancel}>Cancel</button>
      </dialog>
    `;
  }
  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`
    ${dialogStyles}
    h2 {
      font-size: 1.15rem;
      font-weight: normal;
      margin-top: 0;
    }
    .title {
      font-family: var(--title-font, 'Harlow Solid', cursive);
      font-size: 2rem;
      font-weight: bold;
      padding-left: 0.5rem;
    }
    .for {
      display: block;
      font-weight: normal;
      font-size: 0.75em;
    }
    .studio {
      font-size: 2rem;
      font-style: italic;
      font-weight: bold;
      padding-left: 0.5rem;
    }
    ${fieldListStyles}
  `;

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'login-ui': LoginUI,
  }
};
