import { LitElement, css, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { inputFieldCSS } from '../../assets/css/input-field.css.ts';
import { hasSlotContent } from '../../utils/lit.utils.ts';

@customElement('read-only-field')
export class ReadOnlyField extends LitElement {
  // ------------------------------------------------------
  // START: properties/attributes

  @property({ type: String, attribute: 'label' })
  label : string = '';

  @property({ type: String, attribute: 'value' })
  value : string | boolean | null = '';

  @property({ type: String, attribute: 'help-text' })
  helpMsg : string = '';


  //  END:  properties/attributes
  // ------------------------------------------------------
  // START: state

  @state()
  _innerClass : string = 'inner';

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

  renderHelp() : TemplateResult | string {
    if (hasSlotContent(this, 'help', 'helpMsg')) {
      const id = `${this.id}--help`;
      this._innerClass = 'inner inner-help';

      return html`<div class="help" id="${id}--help">
          <slot name="help">${this.helpMsg}</slot>
        </div>`;
    }

    this._innerClass = 'inner';

    return '';
  }

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult{
    let val = this.value;

    if (typeof val === 'boolean') {
      val = (val === true)
        ? 'Yes'
        : 'No'
    } else if (val === null) {
      val = '';
    }


    return html`
      <div class="outer">
        <div class="inner ${this._innerClass}">
          <span class="label">${this.label}:</span>
          <span class="input"><slot name="value">${val}</slot></span>
          ${this.renderHelp()}
        </div>
      </div>
    `;
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`${inputFieldCSS}`;

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'read-only-field': ReadOnlyField,
  }
};
