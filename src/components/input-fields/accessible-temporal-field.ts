import { html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { AccessibleWholeField } from './AccessibleWholeField.ts';

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

  @state()
  _tValue : string | null = null;

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

      if (['date', 'time', 'datetime-local'].includes(this.type) === false) {
        throw new Error(
          '<accessible-temporal-field> expects the "type" attribute '
          + 'to be either "date", "time" or "datetime-local". "'
          + `${this.type}" is not a valid type`,
        );
      }

      if (typeof this.value === 'string' && this.value.trim() !== '') {
        this._tValue = (this.type === 'datetime-local')
          ? this.value.replace(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}).*$/, '$1')
          : this.value
      }
    }

  //  END:  lifecycle ethods
  // ------------------------------------------------------
  // START: helper render methods

  renderField() : TemplateResult {
    // console.group('<accessible-temporal-field>.renderField()');
    // console.log('this.fieldID:', this.fieldID);
    // console.log('this.value:', this.value);
    // console.groupEnd();
    return html`<input
      .autocomplete=${ifDefined(this.autocomplete)}
      ?disabled=${ifDefined(this.disabled)}
      .id="${this.fieldID}"
      .list=${ifDefined(this._listID)}
      .max=${ifDefined(this.max)}
      .min=${ifDefined(this.min)}
      ?placeholder=${this.placeholder}
      ?readonly=${this.readonly}
      ?required=${this.required}
      .step=${ifDefined(this.step)}
      .type=${this.type}
      .value=${ifDefined(this._tValue)}
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
