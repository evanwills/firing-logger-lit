import { html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { AccessibleWholeField } from './AccessibleWholeField.ts';
import { getCustomErrorMsg } from '../../utils/text-field.utils.ts';
import { round } from "../../utils/numeric.utils.ts";
import { isNonEmptyStr } from "../../utils/string.utils.ts";

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

  @property({ type: Boolean, attribute: 'multi-line'})
  multiLine : boolean = false;

  @property({ type: String, attribute: 'pattern' })
  pattern : string | null = null;

  @property({ type: Boolean, attribute: 'spellcheck' })
  spellCheck : boolean | null = null;

  @property({ type: String, attribute: 'validation-type'})
  validationType : string = '';

  //  END:  properties/attributes
  // ------------------------------------------------------
  // START: state

  @state()
  textStyle : string | null = '--textarea-height: 3.5rem;';

  @state()
  textHeight : number = 0;

  _regexes : {[key:string]:RegExp} = {
    name: /\w[\w\- .,\(\):\&\/]{2,49}/,
    title: /[\w\d][\d\w\- .,\(\):\&\/\+]{2,49}/,
    anyPhone: /^0[234578]\d{8}$/,
    fixedphone: /^0[2378]\d{8}$/,
    mobilephone: /^0[45]\d{8}$/,
    intphone: /^\+\d{8-14}$/,
    email: /^[a-zA-Z\d]+[\-a-zA-Z\d_.']*@[\-a-zA-Z\d]+(?:\.[\-a-zA-Z\d]+)*(?:\.[a-zA-Z]+){1,2}$/,
  };

  _knownTypes = new Set(['name', 'title']);

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  getPattern() {
    if (isNonEmptyStr(this.pattern)) {
      return this.pattern;
    }

    if (isNonEmptyStr(this.validationType)
      && typeof this._regexes[this.validationType] !== 'undefined'
    ) {
      return this._regexes[this.validationType].source;
    }

    return null;
  }

  _setFieldHeight({ clientHeight, scrollHeight} : HTMLTextAreaElement) {
    if (scrollHeight > clientHeight) {
      const oldHeight = this.textHeight;
      const tmp = round((scrollHeight / 16), 2);

      if (tmp > oldHeight) {
        this.textHeight = tmp;

        this.textStyle = `--textarea-height: ${this.textHeight}rem;`;
      }
    }
  }

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  handleKeyup(event: KeyboardEvent | InputEvent): void {
    super.handleKeyup(event);

    if (this.multiLine === true) {
      this._setFieldHeight(event.target as HTMLTextAreaElement);
    }
  }

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  connectedCallback() : void {
    super.connectedCallback();

    if (this._knownTypes.has(this.validationType)) {
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

  _renderInput() : TemplateResult {
    return html`<input
      accesskey="${ifDefined(this.key())}"
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

  _renderTextarea() : TemplateResult {
    return html`<textarea
      accesskey="${ifDefined(this.key())}"
      ?disabled=${this.disabled}
      .autocomplete=${ifDefined(this.autocomplete)}
      .id="${this.fieldID}"
      .maxlength=${ifDefined(this.maxlength)}
      .minlength=${ifDefined(this.minlength)}
      .list=${ifDefined(this._listID)}
      .pattern=${ifDefined(this.pattern)}
      .placeholder=${ifDefined(this.placeholder)}
      ?spellcheck=${this.spellCheck}
      .style=${ifDefined(this.textStyle)}
      ?readonly=${this.readonly}
      ?required=${this.required}
      .value=${ifDefined(this.value)}
      @change=${this.handleChange}
      @keyup=${this.handleKeyup}></textarea>`;

  }

  renderField() : TemplateResult {
    return (this.multiLine === true)
      ? this._renderTextarea()
      : this._renderInput();
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
