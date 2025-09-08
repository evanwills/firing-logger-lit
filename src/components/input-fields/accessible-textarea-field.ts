import { html, type TemplateResult } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { ifDefined } from "lit/directives/if-defined.js";
import { AccessibleWholeField } from "./AccessibleWholeField.ts";

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('accessible-textarea-field')
export class AccessibleTextareaField extends AccessibleWholeField {
  // ------------------------------------------------------
  // START: properties/attributes

  @property({ type: Number, attribute: 'maxlength' })
  maxlength : number | null = null;

  @property({ type: Number, attribute: 'minlength' })
  minlength : number | null = null;

  @property({ type: String, attribute: 'pattern' })
  pattern : string | null = null;

  @property({ type: Boolean, attribute: 'spellcheck' })
  spellCheck : boolean | null = null;

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
    return html`<textarea
      .id="${this.id}"
      .maxlength=${ifDefined(this.maxlength)}
      .minlength=${ifDefined(this.minlength)}
      .pattern=${ifDefined(this.pattern)}
      ?spellcheck=${this.spellCheck}
      .autocomplete=${ifDefined(this.autocomplete)}
      .list=${ifDefined(this._listID)}
      ?disabled=${this.disabled}
      ?placeholder=${this.placeholder}
      ?readonly=${this.readonly}
      ?required=${this.required}
      .value=${ifDefined(this.value)}
      @change=${this.handleChange}
      @keyup=${this.handleKeyup}></textarea>`;
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
    'accessible-textarea-field': AccessibleTextareaField
  }
}
