import { css, html, LitElement, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('route-link')
export class RouterLink extends LitElement {
  // ------------------------------------------------------
  // START: properties/attributes

  @property({ type: String, attribute: 'link' })
  url : string = '';

  @property({ type: String, attribute: 'label' })
  label : string = '';

  @property({ type: String, attribute: 'uid' })
  uid : string = '';

  //  END:  properties/attributes
  // ------------------------------------------------------
  // START: state

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  navClick(event : Event): void {
    event.preventDefault();

    this.dispatchEvent(
      new CustomEvent(
        'routernav',
        {
          bubbles: true,
          composed: true,
          detail: { uid: this.uid, url: this.url},
        },
      ),
    );
  }

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper render methods

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult {
    return html`<a
      href="${this.url}"
      class="router-link"
      @click=${this.navClick}><slot>${this.label}</slot></a>`;
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`
`;

//  END:  styles
// ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'route-link': RouterLink,
  }
};
