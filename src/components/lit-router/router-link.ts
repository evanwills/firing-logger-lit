import { css, html, LitElement, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { LitRouter } from './lit-router.ts';
import { srOnly } from '../../assets/css/sr-only.css.ts';
import { linkStyle } from '../../assets/css/links.css.ts';
import { isNonEmptyStr } from '../../utils/string.utils.ts';
import { buttonStyle } from "../../assets/css/buttons.css.ts";

@customElement('router-link')
export class RouterLink extends LitElement {
  // ------------------------------------------------------
  // START: properties/attributes

  @property({ type: Boolean, attribute: 'active' })
  active : boolean = false;

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
    const active = (this.active === true)
      ? ' active'
      : '';

    return `router-link${extra}${active}`;
  }

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  navClick(event : Event): void {
    if (this.asBtn === false) {
      event.preventDefault();

      LitRouter.dispatchRouterEvent(this, this.url, this.dataset);
    }
  }

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper render methods

  renderLabel() {
    return (isNonEmptyStr(this, 'srLabel') === true)
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
    ${buttonStyle}
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
