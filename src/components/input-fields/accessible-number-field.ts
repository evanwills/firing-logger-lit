import { html, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { AccessibleWholeField } from './AccessibleWholeField.ts';
import { isNonEmptyStr } from '../../utils/string.utils.ts';

/**
 * An example element.
 */
@customElement('accessible-number-field')
export class AccessibleNumberField extends AccessibleWholeField {
  // ------------------------------------------------------
  // START: properties/attributes

  // - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // START: Standard HTML <input type="number"> properties

  @property({ type: Number, attribute: 'max' })
  max : number | undefined = undefined;

  @property({ type: Number, attribute: 'min' })
  min : number | undefined = undefined;

  @property({ type: Number, attribute: 'step' })
  step : number | undefined = undefined;

  @property({ type: String, attribute: 'unit' })
  unit : string | undefined = undefined;

  @property({ type: Boolean, attribute: 'unit-before'})
  unitBefore : boolean = false;


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
    const _unit = (isNonEmptyStr(this.unit))
      ? html`<span class="unit">${this.unit}</span>`
      : ''

    return html`<span class="input-flex">${(this.unitBefore === true)
      ? _unit
      : ''
    }<input
      .autocomplete=${ifDefined(this.autocomplete)}
      ?disabled=${ifDefined(this.disabled)}
      .id="${this.fieldID}"
      .max=${ifDefined(this.max)}
      .min=${ifDefined(this.min)}
      .list=${ifDefined(this._listID)}
      .placeholder=${this.placeholder}
      ?readonly=${this.readonly}
      ?required=${this.required}
      .step=${ifDefined(this.step)}
      type="number"
      .value=${ifDefined(this.value)}
      @change=${this.handleChange}
      @keyup=${this.handleKeyup} />
    ${(this.unitBefore === false)
      ? _unit
      : ''
    }</span>`;
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
    'accessible-number-field': AccessibleNumberField
  }
}
