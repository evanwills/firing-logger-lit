import { LitElement, css, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { FReportValidity, TTrueValidity } from '../../types/fauxDom.d.ts';
import { logEntryInputStyle, logEntryInputVars } from '../../assets/css/log-entry-styles.ts';
import { getISO8601time } from '../../utils/date-time.utils.ts';
import { srOnly } from '../../assets/css/sr-only.css.ts';
import { dispatchCustomEvent, getTrueValidity } from '../../utils/event.utils.ts';

/**
 * An example element.
 */
@customElement('time-input')
export class TimeInput extends LitElement {
  // ------------------------------------------------------
  // START: properties/attributes

  @property({ type: Boolean, attribute: 'future' })
  future : boolean = false;

  @property({ type: String, attribute: 'id' })
  id : string = '';

  @property({ type: String, attribute: 'label' })
  label : string = 'Time';

  @property({ type: Number, attribute: 'min-offset' })
  minOffset : number = 0;

  @property({ type: Number, attribute: 'max-offset' })
  maxOffset : number = 60;

  @property({ type: Boolean, attribute: 'readonly' })
  readonly : boolean = false;

  @property({ type: Number, attribute: 'value' })
  value : number = 0;

  //  END:  properties/attributes
  // ------------------------------------------------------
  // START: state

  @state()
  _max : string = '';

  @state()
  _min : string = '';

  @state()
  _autoUpdateTime : boolean = true;

  @state()
  _now : number = 0;

  @state()
  _errorMsg : string | TemplateResult = '';

  @state()
  _reportValidity : FReportValidity | null = null;

  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  _getMax() {
    return (this.value > 0 && this.maxOffset > 0)
      ? getISO8601time(this.value + (this.maxOffset * 1000))
      : '';
  }

  _getMin() {
    return (this.value > 0 && this.minOffset > 0)
      ? getISO8601time(this.value - (this.minOffset * 1000))
      : '';
  }

  _getNow() {
    let now = 0;
    if (this._now > 0) {
      now = this._now;
    } else if (this.value > 0) {
      now = this.value;
    }

    return (now > 0)
      ? getISO8601time(now)
      : '';
  }

  _getReportValidity() {
    const min = this._min;
    const max = this._max;

    const reportRange = (
      val : string,
      rel: string,
    ) => html`Please enter a time of day that is ${rel} ${val}.`;

    return (validity : TTrueValidity) : string | TemplateResult => {
      if (validity.badInput
        || validity.customError
        || validity.patternMismatch
        || validity.stepMismatch
        || validity.typeMismatch
      ) {
        return 'Please enter a valid kiln temperature';
      }

      if (validity.valueMissing) {
        return 'Please enter the current kiln temperature';
      }

      if (validity.rangeOverflow || validity.tooLong) {
        return reportRange(max, 'before');
      }

      if (validity.rangeUnderflow || validity.tooShort) {
        return reportRange(min, 'after');
      }

      return '';
    }
  }

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  handleChange(event : InputEvent) : void {
    if (this._reportValidity !== null) {
      this._errorMsg = this._reportValidity(
        ((event.target as HTMLInputElement).validity as TTrueValidity),
      );
    }

    dispatchCustomEvent(
      this,
      this._now,
      ((event.target as HTMLInputElement).validity as TTrueValidity),
      this._reportValidity
    );
  }

  setNow() : void {
    this._now = Date.now();

    if (this.minOffset > 0) {
      this._min = getISO8601time(this._now - (this.minOffset * 1000));
    }

    if (this.maxOffset > 0) {
      this._max = getISO8601time(this._now + (this.maxOffset * 1000));
    }

    dispatchCustomEvent(
      this,
      this._now,
      getTrueValidity(),
      this._reportValidity
    );
  }

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  connectedCallback() : void {
    super.connectedCallback();

    if (this.value > 0) {
      if (this.minOffset > 0) {
        this._min = getISO8601time(this.value - (this.minOffset * 1000));
      }

      if (this.maxOffset > 0) {
        this._max = getISO8601time(this.value + (this.maxOffset * 1000));
      }
    }
  }

  //  END:  lifecycle ethods
  // ------------------------------------------------------
  // START: helper render methods

  renderReadOnly() : TemplateResult {
    return html`
      <span class="label">
        ${this.label}:
      </span>
      <span class="input">${this._getNow()}</span>`;

  }
  renderEditable() : TemplateResult {
    return html`
      <label class="label" for="${this.id}">${this.label}:</label>
      <input
        class="input"
        type="time"
        id="${this.id}"
        max="${this._getMax()}"
        min="${this._getMin()}"
        .value="${this._getNow()}"
        @change=${this.handleChange} />
      <button @click=${this.setNow} title="Set time to now"><span class="sr-only">Set time to now</span></button>`;
  }

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult {
    const content = (this.readonly === true)
      ? this.renderReadOnly()
      : this.renderEditable();

    return html`
      <li>
        ${content}
      </li>
    `;
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`
    ${srOnly}
    ${logEntryInputVars}
    ${logEntryInputStyle}
    button {
      border: none;
      background: transparent;
      display: inline-block;
      padding: 0;
      margin-left: 0.75rem;
    }
    button:hover {
      cursor: pointer;
    }
    button::before {
      border: 0.05rem solid #eee;
      border-radius: 2rem;
      content: '\\021BB';
      display: inline-block;
      font-size: 1.25rem;
      height: 1.5rem;
      line-height: 1.2rem;
      transform: translateY(-0.1rem), rotate(90deg);
      width: 1.5rem;
    }
    button:hover::before {
      color: #000;
      background-color: #eee;
      border: 0.05rem solid #000;
    }
  `;

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'time-input': TimeInput
  }
}
