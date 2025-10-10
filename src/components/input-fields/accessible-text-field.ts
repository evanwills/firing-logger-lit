import { html, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { AccessibleWholeField } from './AccessibleWholeField.ts';
import { getCustomErrorMsg } from '../../utils/text-field.utils.ts';

/**
 * An example element.
 */
@customElement('accessible-text-field')
export class AccessibleTextField extends AccessibleWholeField {
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

  @property({ type: String, attribute: 'validation-type'})
  validationType : string = '';

  //  END:  properties/attributes
  // ------------------------------------------------------
  // START: state

  regexes : {[key:string]:RegExp} = {
    name: /\w[\w\- .,\(\):\&\/]{2,49}/,
    title: /[\w\d][\d\w\- .,\(\):\&\/\+]{2,49}/,
  }

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  getPattern() {
    if (this.pattern !== '' && this.pattern !== null) {
      return this.pattern;
    }

    if (typeof this.regexes[this.validationType] !== 'undefined') {
      return this.regexes[this.validationType].source;
    }

    return null;
  }

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  connectedCallback() : void {
    super.connectedCallback();

    if (['name', 'title'].includes(this.validationType)) {
      if (this.getErrorMsg === null) {
        this._getErrorMsg = getCustomErrorMsg(
          this.label,
          this.validationType,
          this.minlength,
          this.maxlength,
        );
      }
    }
  }

  //  END:  lifecycle ethods
  // ------------------------------------------------------
  // START: helper render methods

  renderField() : TemplateResult {
    return html`<input
      .autocomplete=${ifDefined(this.autocomplete)}
      ?disabled=${this.disabled}
      id="${this.fieldID}"
      .list=${ifDefined(this._listID)}
      maxlength="${ifDefined(this.maxlength)}"
      minlength="${ifDefined(this.minlength)}"
      pattern="${ifDefined(this.getPattern())}"
      placeholder="${ifDefined(this.placeholder)}"
      ?readonly=${this.readonly}
      ?required=${this.required}
      ?spellcheck=${this.spellCheck}
      type="text"
      value="${ifDefined(this.value)}"
      @change=${this.handleChange}
      @keyup=${this.handleKeyup}
      @blur=${this._validate} />`;
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
    'accessible-text-field': AccessibleTextField
  }
}
