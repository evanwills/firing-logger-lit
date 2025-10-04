import { css, html, LitElement, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
// import { hasSlotContent } from '../../utils/lit.utils.ts';
import { emptyOrNull } from '../../utils/data.utils.ts';
import { isNonEmptyStr } from '../../utils/string.utils.ts';

@customElement('alert-block')
export class AlertBlock extends LitElement {
  // ------------------------------------------------------
  // START: properties/attributes

  @property({ type: String, attribute: 'heading' })
  heading : string = '';

  @property({ type: Number, attribute: 'h-level' })
  headingLevel : number = 3;

  @property({ type: String, attribute: 'body' })
  body : string = '';

  @property({ type: String, attribute: 'type' })
  type : 'error' | 'warning' | 'success' | 'info' = 'error';

  //  END:  properties/attributes
  // -----------------------------
  // START: state

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper render methods

  _getHead() : TemplateResult | string {
    if (emptyOrNull(this.heading)) {
      return '';
    }
    switch (this.headingLevel) {
      case 1:
        return html`<h1 class="h">${this.heading}</h1>`;

      case 2:
        return html`<h2 class="h">${this.heading}</h2>`;

      case 3:
        return html`<h3 class="h">${this.heading}</h3>`;

      case 4:
        return html`<h4 class="h">${this.heading}</h4>`;

      case 5:
        return html`<h5 class="h">${this.heading}</h5>`;
    }
    return '';
  }

  _getBody() : TemplateResult | string {
    return isNonEmptyStr(this.body)
      ? html`<p>${this.body}</p>`
      : '';
  }

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult | string {
    return html`<div role="alert" aria-live="polite" class="wrap ${this.type}">
      <!-- icon -->
      <div class="inner">
        <slot name="heading">${this._getHead()}</slot>
        <slot>${this._getBody()}</slot>
      </div>
    </div>`;
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`
  .error { --bg-colour: var(--bg-colour-error); }
  .warning { --bg-colour: var(--bg-colour-warning); }
  .success { --bg-colour: var(--bg-colour-success); }
  .info { --bg-colour: var(--bg-colour-info); }
  .wrap {
    box-sizing: border-box;
    border: 0.1rem solid var(--border-colour);
    background-color: var(--bg-colour);
    display: inline-flex;
    gap: 1rem;
    width: auto;
    max-width: 25rem;
    padding: 1rem;
    border-radius: 0.5rem;
    text-align: left;
  }
  .inner {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  p, .h {
    margin: 0;
    padding: 0;
    font-size: 1rem;
    line-height: 1.25rem;
  }
  `;

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'alert-block': AlertBlock,
  }
};
