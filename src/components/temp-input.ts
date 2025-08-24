import { LitElement, css, html, type TemplateResult } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { logEntryInputStyle, logEntryInputVars } from '../assets/log-entry-styles';
import { dispatchCustomEvent } from '../utils/event.utils';
import type { FReportValidity, TTrueValidity } from '../types/fauxDom';
import { c2f, f2c, x2x } from '../utils/conversions.utils';
// import { unsafeHTML } from 'lit/directives/unsafe-html.js';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('temperature-input')
export class TemperatureInput extends LitElement {
  // ------------------------------------------------------
  // START: properties/attributes

  @property({ type: Boolean, attribute: 'not-metric' })
  notMetric : boolean = false;

  @property({ type: Boolean, attribute: 'show-error' })
  showError : boolean = false;

  @property({ type: String, attribute: 'id' })
  id : string = '';

  @property({ type: String, attribute: 'label' })
  label : string = 'Temperature';

  @property({ type: Number, attribute: 'min' })
  min : number = 0;

  @property({ type: Number, attribute: 'max' })
  max : number = 1400;

  @property({ type: Boolean, attribute: 'readonly' })
  readonly : boolean = false;

  @property({ type: Number, attribute: 'value' })
  value : number = 0;

  //  END:  properties/attributes
  // ------------------------------------------------------
  // START: state

  @state()
  _unit : string = 'C';

  @state()
  _errorMsg : string | TemplateResult = '';

  @state()
  _reportValidity : FReportValidity | null = null;

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  _getReportValidity() {
    const converter = (this.notMetric === true)
      ? c2f
      : x2x;
    const unit = this._unit;
    const min = this.min;
    const max = this.max;

    const reportRange = (val : number, str: string) => html`Please enter a temperature that is ${str} than ${converter(val)}&deg;${unit}`;

    return (validity : TTrueValidity) : string | TemplateResult => {
      if (validity.badInput
        || validity.customError
        || validity.patternMismatch
        || validity.typeMismatch
      ) {
        return 'Please enter a valid kiln temperature';
      }

      if (validity.stepMismatch) {
        return 'Please enter the current temperature in whole degrees';
      }

      if (validity.valueMissing) {
        return 'Please enter the current kiln temperature';
      }

      if (validity.rangeOverflow || validity.tooLong) {
        return reportRange(max, 'less');
      }

      if (validity.rangeUnderflow || validity.tooShort) {
        return reportRange(min, 'greater');
      }

      return '';
    }
  }

  _getValue(input : number) : number {
    return (this.notMetric === true)
      ? c2f(input)
      : input;
  }

  _setValue(input : number) : number {
    return (this.notMetric === true)
      ? f2c(input)
      : input;
  }

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  handleChange(event : InputEvent) : void {
    console.group('<temp-input>.handleChange()');
    console.log('event:', event);
    console.log('this._errorMsg (before):', this._errorMsg);
    if (this._reportValidity !== null) {
      this._errorMsg = this._reportValidity(
        ((event.target as HTMLInputElement).validity as TTrueValidity),
      );
    }
    const value : string | number = typeof (event.target as HTMLInputElement).value === 'number'
      ? (event.target as HTMLInputElement).value
      : parseInt((event.target as HTMLInputElement).value, 10);

    dispatchCustomEvent(
      this,
      this._setValue(value as number),
      ((event.target as HTMLInputElement).validity as TTrueValidity),
      this._reportValidity
    );
    console.log('this._errorMsg (after):', this._errorMsg);
  }

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  connectedCallback() : void {
    super.connectedCallback();

    this._unit = (this.notMetric === true)
      ? 'F'
      : 'C';

    this._reportValidity = this._getReportValidity();
  }

  //  END:  lifecycle ethods
  // ------------------------------------------------------
  // START: helper render methods

  renderReadOnly() : TemplateResult {
    return html`
      <span class="label">
        ${this.label}:
        <span class="sr-only">in degrees ${this._unit}</span>
      </span>
      <span class="input">${this._getValue(this.value)}</span>`;
  }

  renderError() : TemplateResult | string {
    let msg : TemplateResult | string = '';
    if (this.showError === true) {
      msg = 'Please enter the temperature of the kiln.'
    } else if (this._errorMsg !== '') {
      msg = this._errorMsg;
    }

    return (msg !== '')
      ? html`<p class="error">${msg}</p>`
      : ''
  }

  renderEditable() : TemplateResult {
    return html`
      <label class="label" for="${this.id}">${this.label}:</label>
      <input
        class="input temp"
        type="number"
        id="${this.id}"
        max="${this._getValue(this.max)}"
        min="${this._getValue(this.min)}"
        step="1"
        .value="${(this.value > 0) ? this._getValue(this.value) : ''}"
        @change=${this.handleChange} />
      `;
  }

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult {
    const content = (this.readonly === true)
      ? this.renderReadOnly()
      : this.renderEditable();

    let msg : TemplateResult | string = '';
    if (this._errorMsg !== '') {
      msg = this._errorMsg;
    } else if (this.showError === true) {
      msg = 'Please enter the current temperature of the kiln.'
    }

    return html`
      <li>
        ${content}
        <span class="extra deg">&deg;${this._unit}</span>
        ${(msg !== '')
          ? html`<p class="error">${msg}</p>`
          : ''}
      </li>
    `;
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`
    ${logEntryInputVars}
    :host {
      --extra-left: 0.25rem;
    }
    ${logEntryInputStyle}
    .input.temp { width: 3.5rem }
  `;

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'temperature-input': TemperatureInput
  }
}
