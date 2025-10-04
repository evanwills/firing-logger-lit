import { css, html, LitElement, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { isNonEmptyStr } from '../../utils/string.utils.ts';

/**
 * An example element.
 */
@customElement('not-allowed')
export class NotAllowed extends LitElement {
  // ------------------------------------------------------
  // START: properties/attributes

  @property({ type: String, attribute: 'mode' })
  mode : 'add' | 'clone' | 'copy' | 'delete' | 'edit' = 'edit'

  @property({ type: String, attribute: 'type' })
  type : string = '';

  @property({ type: String, attribute: 'name' })
  name : string = '';

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

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult {
    let what = '';

    if (isNonEmptyStr(this.name)) {
      what = this.name;
    } else {
      const join = (this.mode === 'add')
        ? 'a new'
        : 'this';
      what = `${join} ${this.type}`;
    }



    return html`<div role="alert">
      <h2>Not allowed!!!</h2>
      <p>You do not have permission to ${this.mode} ${what}</p>
    </div>`;
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
    'not-allowed': NotAllowed,
  }
};


