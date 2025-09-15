import { html, type TemplateResult } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js';
import { AccessibleWholeField } from './AccessibleWholeField.ts';
import type { TOptionValueLabel } from '../../types/renderTypes.d.ts';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('accessible-select-field')
export class AccessibleSelectField extends AccessibleWholeField {
  // ------------------------------------------------------
  // START: properties/attributes

  // - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // START: Standard HTML <input type="number"> properties

  @property({ type: Array, attribute: 'options' })
  options : TOptionValueLabel[] = [];

  //  END:  Standard HTML <input type="number"> properties
  // - - - - - - - - - - - - - - - - - - - - - - - - - - -

  //  END:  properties/attributes
  // ------------------------------------------------------
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

  //  END:  lifecycle ethods
  // ------------------------------------------------------
  // START: helper render methods

  renderField() : TemplateResult {
    return html`<select
      .id="${this.id}"
      .autocomplete=${ifDefined(this.autocomplete)}
      ?disabled=${ifDefined(this.disabled)}
      ?placeholder=${this.placeholder}
      ?readonly=${this.readonly}
      ?required=${this.required}
      .value=${ifDefined(this.value)}
      @change=${this.handleChange}
      @keyup=${this.handleKeyup}>
      ${this.options.map(
        (option : TOptionValueLabel) : TemplateResult => html`
          <option
            value="${option.value}"
            ?selected=${option.value === this.value}>
            ${option.label}
          </option>`)}
    </select>`;
  }

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  // render() is inherited from AccessibleWholeField

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  // static styles is inherited from AccessibleWholeField

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'accessible-select-field': AccessibleSelectField
  }
}
