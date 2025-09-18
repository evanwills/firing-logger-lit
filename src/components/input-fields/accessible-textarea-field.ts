import { html, type TemplateResult } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js';
import { AccessibleWholeField } from './AccessibleWholeField.ts';
import { round } from '../../utils/numeric.utils.ts';

/**
 * An example element.
 */
@customElement('accessible-textarea-field')
export class AccessibleTextareaField extends AccessibleWholeField {
  // ------------------------------------------------------
  // START: properties/attributes

  @property({ type: Boolean, attribute: 'auto-expand' })
  autoExpand : boolean = false;

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
  textStyle : string | null = '--textarea-height: 3.5rem;';

  @state()
  textHeight : number = 0;

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  handleKeyup(event: InputEvent): void {
    super.handleKeyup(event);

    const { clientHeight, scrollHeight} = (event.target as HTMLTextAreaElement);

    if (scrollHeight > clientHeight) {
      const oldHeight = this.textHeight;
      const tmp = round((scrollHeight / 16), 2);

      if (tmp > oldHeight) {
        this.textHeight = tmp;

        this.textStyle = `--textarea-height: ${this.textHeight}rem;`;
      }
    }
  }

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  //  END:  lifecycle ethods
  // ------------------------------------------------------
  // START: helper render methods

  renderField() : TemplateResult {
    return html`<textarea
      ?disabled=${this.disabled}
      .autocomplete=${ifDefined(this.autocomplete)}
      .id="${this.id}"
      .maxlength=${ifDefined(this.maxlength)}
      .minlength=${ifDefined(this.minlength)}
      .list=${ifDefined(this._listID)}
      .pattern=${ifDefined(this.pattern)}
      ?placeholder=${this.placeholder}
      ?spellcheck=${this.spellCheck}
      .style=${ifDefined(this.textStyle)}
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
