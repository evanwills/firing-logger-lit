import { html, type TemplateResult } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { ifDefined } from "lit/directives/if-defined.js";
import { AccessibleWholeField } from "./AccessibleWholeField.ts";

/**
 * An example element.
 */
@customElement('accessible-temporal-field')
export class AccessibleTemporalField extends AccessibleWholeField {
  // ------------------------------------------------------
  // START: properties/attributes

  @property({ type: String, attribute: 'type' })
  type : string = '';

  // - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // START: Standard HTML <input type="date"> properties

  @property({ type: String, attribute: 'max' })
  max : string | null = null;

  @property({ type: String, attribute: 'min' })
  min : string | null = null;

  @property({ type: Number, attribute: 'step' })
  step : number | null = 60;


  //  END:  Standard HTML <input type="date"> properties
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

    connectedCallback() : void {
      super.connectedCallback();

      if (['date', 'time', 'datetime-local'].includes(this.id) === false) {
        throw new Error(
          '<accessible-temporal-field> expects the "type" attribute '
          + 'to be either "date", "time" or "datetime-local". "'
          + `${this.type}" is not a valid type`,
        );
      }
    }

  //  END:  lifecycle ethods
  // ------------------------------------------------------
  // START: helper render methods

  renderField() : TemplateResult {
    return html`<input
      .type=${this.type}
      .id="${this.id}"
      .step=${ifDefined(this.step)}
      .max=${ifDefined(this.max)}
      .min=${ifDefined(this.min)}
      .autocomplete=${ifDefined(this.autocomplete)}
      .list=${ifDefined(this._listID)}
      ?disabled=${ifDefined(this.disabled)}
      ?placeholder=${this.placeholder}
      ?readonly=${this.readonly}
      ?required=${this.required}
      .value=${ifDefined(this.value)}
      @change=${this.handleChange}
      @keyup=${this.handleKeyup} />`;
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
    'accessible-temporal-field': AccessibleTemporalField
  }
}
