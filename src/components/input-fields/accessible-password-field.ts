import { html, type TemplateResult } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js';
import { AccessibleWholeField } from './AccessibleWholeField.ts';

/**
 * An example element.
 */
@customElement('accessible-password-field')
export class AccessiblePasswordField extends AccessibleWholeField {
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

  @state()
  _show : boolean = false;

  @state()
  _type : string = 'password';

  @state()
  _btnTxt : string = 'show';

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  toggleVisibility() {
    this._show = !this._show;
    if (this._show === true) {
      this._btnTxt = 'text';
      this._btnTxt = 'hide';
    } else {
      this._btnTxt = 'password';
      this._btnTxt = 'show';
    }
  }

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  //  END:  lifecycle ethods
  // ------------------------------------------------------
  // START: helper render methods

  renderField() : TemplateResult {
    return html`
      <span class="input">
        <input
        ?disabled=${ifDefined(this.disabled)}
        .id="${this.id}"
        .maxlength=${ifDefined(this.maxlength)}
        .minlength=${ifDefined(this.minlength)}
        .pattern=${ifDefined(this.pattern)}
        ?placeholder=${this.placeholder}
        ?readonly=${this.readonly}
        ?required=${this.required}
        .type="${this._type}"
        .value=${ifDefined(this.value)}
        @change=${this.handleChange}
        @keyup=${this.handleKeyup} />

        <button @click=${this.toggleVisibility}>
          <span class="sr-only">${this._btnTxt} password</span>
        </button>
      </span>`;
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
    'accessible-password-field': AccessiblePasswordField
  }
}
