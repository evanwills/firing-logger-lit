import { css, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { FReportValidity, TTrueValidity } from '../../types/fauxDom.d.ts';
import { forceNum } from '../../utils/data.utils.ts';
import { dispatchCustomEvent, getIncrement } from '../../utils/event.utils.ts';
import { logEntryInputStyle, logEntryInputVars } from '../../assets/css/log-entry-styles.ts';
import { srOnly } from '../../assets/css/sr-only.css.ts';
import { LoggerElement } from '../shared-components/LoggerElement.ts';
// import { unsafeHTML } from 'lit/directives/unsafe-html.js';

/**
 * An example element.
 */
@customElement('temperature-input')
export class TemperatureInput extends LoggerElement {
  // ------------------------------------------------------
  // START: properties/attributes

  // - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Properties/Attributes inherited from LoggerElement
  //
  // notMetric : boolean = false;
  // userID : ID = '';
  // readOnly : boolean = false;
  //
  // - - - - - - - - - - - - - - - - - - - - - - - - - - -

  /**
   * @property Whether or not to show an error message for this field
   */
  @property({ type: Boolean, attribute: 'show-error' })
  showError : boolean = false;

  /**
   * @property ID of the temperature input field
   */
  @property({ type: String, attribute: 'id' })
  id : string = '';

  /**
   * @property Label string for the temperature input field label
   */
  @property({ type: String, attribute: 'label' })
  label : string = 'Temperature';

  /**
   * @property Minimum temperature (in celsius) the user may enter.
   */
  @property({ type: Number, attribute: 'min' })
  min : number = 0;

  /**
   * @property Maximum temperature (in celsius) the user may enter.
   */
  @property({ type: Number, attribute: 'max' })
  max : number = 1400;

  /**
   * @property Placeholder (expected) temperature (in celsius)
   */
  @property({ type: Number, attribute: 'placeholder' })
  placeholder: number = 0;

  /**
   * @property Predefined temperature (in celsius)
   */
  @property({ type: Number, attribute: 'value' })
  value : number = 0;

  //  END:  properties/attributes
  // ------------------------------------------------------
  // START: state

  // - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // State inherited from LoggerElement
  //
  // _converter : (T : number) => number = x2x;
  // _store : CDataStoreClass | null = null;
  // _unit : string = 'C';
  //
  // - - - - - - - - - - - - - - - - - - - - - - - - - - -

  @state()
  _errorMsg : string | TemplateResult = '';

  @state()
  _reportValidity : FReportValidity | null = null;

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  _getReportValidity() {
    const min = this.min;
    const max = this.max;

    const reportRange = (val : number, str: string) => html`Please enter a temperature that is ${str} than ${this._tConverter(val)}&deg;${this._tUnit}`;

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
    return this._tConverter(input);
  }

  _setValue(input : number) : number {
    return this._tConverterRev(input);
  }

  _handleChangeInner(target: HTMLInputElement) : void {
    if (this._reportValidity !== null) {
      this._errorMsg = this._reportValidity((target.validity as TTrueValidity));
    }
    const value : string | number = typeof target.value === 'number'
      ? target.value
      : parseInt(target.value, 10);

    dispatchCustomEvent(
      this,
      this._setValue(value as number),
      (target.validity as TTrueValidity),
      this._reportValidity
    );
  }

  _getTargetVal(inc: number) : string {
    return ((this.placeholder * 1) + inc).toString();
  }

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  handleChange(event : InputEvent) : void {
    this._handleChangeInner((event.target as HTMLInputElement));
  }

  handleKeyUp(event: KeyboardEvent) : void {
    if (typeof event.target !== 'undefined'
      && event.target instanceof HTMLInputElement
    ) {
      const { inc, minus, _default } = getIncrement(event);
      const val = forceNum(event.target.value, _default);

      if (inc !== 0 && val > -273) {
        if (val < 2) {
          event.target.value = this._getTargetVal(inc);
        } else if (inc > 1) {
          event.target.value = ((val + inc) - minus).toString();
        } else if (inc < -1) {
          event.target.value = ((val + inc) + minus).toString();
        }
      }
    }

    this._handleChangeInner(event.target as HTMLInputElement);
  }

  /**
   * If the input value is empty set input value to match placeholder
   * value
   *
   * @param event
   */
  handleInput(event: InputEvent) : void {
    const data = forceNum(event.data, -273);

    if (event.inputType === 'insertReplacementText'
      && event.target instanceof HTMLInputElement
      && data > -273
      && data < 2
    ) {
      event.target.value = this._getTargetVal((data === 1) ? 1 : -1);
    }
  }

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  connectedCallback() : void {
    super.connectedCallback();

    this._reportValidity = this._getReportValidity();
  }

  //  END:  lifecycle ethods
  // ------------------------------------------------------
  // START: helper render methods

  renderReadOnly() : TemplateResult {
    return html`
      <span class="label">
        ${this.label}:
        <span class="sr-only">in degrees ${this._tUnit}</span>
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
        placeholder=${ifDefined((this.placeholder > 0) ? this._getValue(this.placeholder) : undefined)}
        step="1"
        .value="${(this.value > 0) ? this._getValue(this.value) : ''}"
        @change=${this.handleChange}
        @input=${this.handleInput}
        @keyup=${this.handleKeyUp} />
      `;
  }

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult {
    const content = (this.readOnly === true)
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
        <span class="extra deg">&deg;${this._tUnit}</span>
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
    .input.temp {
      padding-right: 0;
      text-align: end;
      width: 3.5rem;
    }
    ${srOnly}
  `;

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'temperature-input': TemperatureInput
  }
}
