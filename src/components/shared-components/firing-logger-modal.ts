import { LitElement, css, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { isNonEmptyStr } from '../../utils/string.utils.ts';
import { emptyOrNull } from '../../utils/data.utils.ts';
import { srOnly } from "../../assets/css/sr-only.css.ts";
import { ifDefined } from "lit/directives/if-defined.js";

@customElement('firing-logger-modal')
export class FiringLoggerModal extends LitElement {
  // ------------------------------------------------------
  // START: properties/attributes

  @property({ type: String, attribute: 'access-key' })
  accessKey : string = '';

  @property({ type: String, attribute: 'btn-text' })
  btnText : string = '';

  @property({ type: String, attribute: 'heading' })
  heading : string = '';

  @property({ type: Boolean, attribute: 'no-open' })
  noOpen : boolean = false;

  //  END:  properties/attributes
  // -----------------------------
  // START: state

  @state()
  open : boolean = false;

  _modal : HTMLDialogElement | null = null;

  //  END:  state
  // ------------------------------------------------------
  // START: static methods

  //  END:  static methods
  // ------------------------------------------------------
  // START: helper methods

  _getModal() : HTMLDialogElement | null {
    if (this._modal instanceof HTMLDialogElement) {
      return this._modal;
    }

    const tmp = this.shadowRoot?.querySelector('dialog');

    if (tmp instanceof HTMLDialogElement) {
      this._modal = tmp;
      return this._modal;
    }

    return null;
  }

  _dispatchOpen() : void {
    this.dispatchEvent(
      new CustomEvent(
        'open',
        {
          bubbles: true,
          composed: true,
          detail: this.open,
        },
      ),
    );
  }

  //  END:  helper methods
  // ------------------------------------------------------
  // START: public methods

  showModal() {
    // console.group('<firing-modal>.showModal()');
    // console.log('this._modal (before):', this._modal);
    // console.log('this._open (before):', this.open);
    const tmp = this._getModal();

    if (tmp instanceof HTMLDialogElement) {
      if (tmp.open === false) {
        tmp.showModal();
      }
      this.open = tmp.open;
      this._dispatchOpen();
    }
    // console.log('this._open (after):', this.open);
    // console.log('this._modal (after):', this._modal);
    // console.groupEnd();
  }

  close() {
    const tmp = this._getModal();

    if (tmp instanceof HTMLDialogElement) {
      if (tmp.open === true) {
        tmp.close();
      }

      this.open = tmp.open;
      this._dispatchOpen();
    }
  }

  //  END:  public methods
  // ------------------------------------------------------
  // START: public getters

  // get open() : boolean {
  //   const tmp = this._getModal();

  //   if (tmp instanceof HTMLDialogElement) {
  //     return tmp.open;
  //   }

  //   return false;
  // }

  //  END:  public getters
  // ------------------------------------------------------
  // START: event handlers

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper render methods

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render(): TemplateResult | string {
    // console.group('<firing-modal>.render()');
    if (emptyOrNull(this.btnText) && this.noOpen === false) {
      throw new Error(
        '<firing-modal> Expects btn-text attribute to be a non-empty string',
      );
    }


    let cls = 'open-btn';

    if (this.open === true) {
      cls += ' open-btn--open';
    }

    const openKey = (isNonEmptyStr(this.accessKey) === true)
      ? this.accessKey
      : null;

    // console.log('this.accessKey:', this.accessKey);
    // console.log('openKey:', openKey);
    // console.log('this.heading:', this.heading);
    // console.log('this.open:', this.open);
    // console.log('this.btnText:', this.btnText);
    // console.groupEnd();

    return html`
      ${(this.noOpen !== true)
        ? html`<button
            accesskey="${ifDefined(openKey)}"
            class="${cls}"
            type="button"
            @click=${this.showModal}>${this.btnText}</button>`
        : ''
      }

      <dialog class="wrap">
        <button aria-hidden class="bg-close" type="button" @click=${this.close}>
          Close
        </button>

        <div>
          ${isNonEmptyStr(this.heading)
        ? html`<h2>${this.heading}</h2>`
        : ''
      }
          <slot></slot>
          <button
            class="corner-close"
            type="button"
            @click=${this.close}>
            <span class="sr-only">Close ${this.heading}</span>
          </button>
        </div>
      </dialog>`;
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`
    ${srOnly}
    dialog {
      background-color: var(--bg-colour, #101112);
      border: none;
      padding: 0;
      max-width: 30rem;
      width: calc(100% - 2rem);
    }
    dialog::backdrop {
      background-color: var(--backdrop, rgba(0, 0, 0, 0.7));
    }
    .open-btn {
      background-color: var(--rl-btn-bg-success);
      border: var(--rl-btn-border);
      border-radius: var(--rl-btn-border-radius);
      color: var(--rl-btn-colour);
      display: var(--rl-btn-display);
      font-family: var(--rl-btn-font-family);
      font-size: var(--rl-btn-font-size);
      font-weight: var(--rl-btn-font-weight);
      letter-spacing: var(--rl-btn-letter-spacing, inherit);
      line-height: var(--rl-btn-line-height);
      padding: var(--rl-btn-padding);
      text-decoration: var(--rl-btn-text-decoration);
      text-transform: var(--rl-btn-text-transform);
      text-underline-offset: var(--rl-btn-text-underline-offset, 0.1rem);
      white-space: var(--rl-btn-white-space, normal);
      word-spacing: var(--rl-btn-word-spacing, normal);
    }
    .open-btn:hover:not(.disabled),
    .open-btn:focus:not(.disabled) {
      background-color: var(--rl-btn-bg-hover-success);
      color: var(--rl-btn-hover-colour);
      text-decoration: var(--rl-btn-hover-text-decoration);
      cursor: pointer;
    }
    .open-btn--open {
      opacity: 0;
    }

    div {
      border: var(--border, 0.05rem solid #fff);
      padding: 1.5rem 1.5rem 1.25rem;
      position: relative;
      border-radius: var(--modal-border-radius, 0.25rem);
      overflow-x: hidden;
    }
    h2 {
      margin: 0 0 1rem;
      line-height: 1.25rem;
      font-size: 1.25rem;
      text-align: left;
      font-family: Arial, Helvetica, sans-serif;
    }

    .bg-close {
      background-color: tranparent;
      color: transparent;
      cursor: pointer;
      inset: 0;
      position: fixed;
      opacity: 0;
    }

    .bg-close:hover {
      background-color: transparent;
      border: none;
      opacity: 1;
    }

    .corner-close {
      background-color: transparent;
      border: var(--border, 0.05rem solid #fff);
      border-left-style: none;
      border-bottom-style: none;
      border-top-right-radius: var(--modal-border-radius, 0.25rem);
      box-sizing: border-box;
      cursor: pointer;
      display: block;
      height: 2rem;
      padding: 1rem;
      position: absolute;
      right: -0.05rem;
      top: -0.05rem;
      width: 2rem;
    }

    .corner-close::hover {
      background-color: inherit;
    }

    .corner-close::after {
      content: '\u00D7';
      display: inline-block;
      height: 1.5rem;
      left: 0.25rem;
      line-height: 1.5rem;
      position: absolute;
      top: 0.1rem;
      font-size: 1.5rem;
      transform-origin: 51% 58%;
      transition: font-size, rotate ease-in-out 0.2s;
      width: 1.5rem;
    }

    .corner-close:focus::after,
    .corner-close:hover::after {
      scale: 1.5;
      rotate: 90deg;
    }
  `;

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'firing-logger-modal': FiringLoggerModal,
  }
};
