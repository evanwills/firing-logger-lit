import { css, html, LitElement, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { dispatchRouterEvent } from './lit-router.utils.ts';
import { srOnly } from '../../assets/css/sr-only.ts';
import { linkStyle } from '../../assets/css/link-style.ts';

@customElement('router-link')
export class RouterLink extends LitElement {
  // ------------------------------------------------------
  // START: properties/attributes

  @property({ type: Boolean, attribute: 'button' })
  asBtn : boolean = false;

  @property({ type: Boolean, attribute: 'disabled' })
  disabled : boolean = false;

  @property({ type: String, attribute: 'url' })
  url : string = '';

  @property({ type: String, attribute: 'label' })
  label : string = '';

  @property({ type: String, attribute: 'sr-label' })
  srLabel : string = '';

  //  END:  properties/attributes
  // ------------------------------------------------------
  // START: state

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  getClass() {
    const extra = (this.disabled === true)
      ? ' disabled'
      : '';

    return `router-link${extra}`;
  }

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  navClick(event : Event): void {
    if (this.asBtn === false) {
      event.preventDefault();

      dispatchRouterEvent(this, this.url, this.dataset);
    }
  }

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper render methods

  renderLabel() {
    return (typeof this.srLabel === 'string' && this.srLabel.trim() !== '')
      ? html`${this.label} <span class="sr-only">${this.srLabel}</span>`
      : this.label;
  }

  renderLink() {
    return html`<a
      href="${this.url}"
      class="${this.getClass()}"
      @click=${this.navClick}><slot>${this.renderLabel()}</slot></a>`;
  }
  renderBtn() {
    return html`<button
      class="${this.getClass()}"
      @click=${this.navClick}><slot>${this.renderLabel()}</slot></a>`;
  }

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult {
    // console.group('<router-link>.render()');
    // console.log('this.dataset.uid:', this.dataset.uid);
    // console.log('this.url:', this.url);
    // console.groupEnd();
    return (this.asBtn === true)
      ? this.renderBtn()
      : this.renderLink();
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`
    :host(.btn) {
      --rl-background-colour: var(--rl-btn-background-colour);
      --rl-border: var(--rl-btn-border);
      --rl-border-radius: var(--rl-btn-border-radius);
      --rl-colour: var(--rl-btn-colour);
      --rl-font-family: var(--rl-btn-font-family);
      --rl-font-size: var(--rl-btn-font-size);
      --rl-font-weight: var(--rl-btn-font-weight);
      --rl-line-height: var(--rl-btn-line-height);
      --rl-padding: var(--rl-btn-padding);
      --rl-text-decoration: var(--rl-btn-text-decoration);
      --rl-text-transform: var(--rl-btn-text-transform);
      --rl-hover-background-colour: var(--rl-btn-hover-background-colour);
      --rl-hover-colour: var(--rl-btn-hover-colour);
      --rl-hover-text-decoration: var(--rl-btn-hover-text-decoration);
    }
    ${linkStyle}
    ${srOnly}
  `;

//  END:  styles
// ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'router-link': RouterLink,
  }
};
