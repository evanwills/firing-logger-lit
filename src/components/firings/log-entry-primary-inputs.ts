import { LitElement, css, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import type { TLogEntryOption, TUserEnteredOptions } from '../../types/renderTypes.d.ts';
import { logEntryInputStyle, logEntryInputVars } from '../../assets/css/log-entry-styles.ts';
import { dispatchFLaction } from '../../utils/event.utils.ts';
import { calculateExpectedTemp, forceNum } from '../../utils/data.utils.ts';
import InputValueClass from '../../utils/InputValue.class.ts';
import './log-temp-input.ts';
import './log-time-input.ts';
import { dialogStyles } from '../../assets/css/dialog.css.ts';

/**
 * An example element.
 */
@customElement('log-entry-input')
export class LogEntryInput extends LitElement {
  // ------------------------------------------------------
  // START: properties/attributes

  @property({ type: Boolean, attribute: 'not-metric' })
  notMetric : boolean = false;

  @property({ type: String, attribute: 'id' })
  id : string = '';

  @property({ type: Array, attribute: 'options' })
  options : Array<TLogEntryOption> = [];

  @property({ type: Number, attribute: 'time' })
  time : number = 0;

  @property({ type: String, attribute: 'user-name' })
  userName : string = '';

  @property({ type: String, attribute: 'user-id' })
  userID : string = '';

  @property({ type: Number, attribute: 'ramp-rate' })
  rampRate : number = 0;

  @property({ type: Number, attribute: 'start-time' })
  startTime : number = 0;

  @property({ type: Number, attribute: 'start-temp' })
  startTemp : number = 0;

  //  END:  properties/attributes
  // ------------------------------------------------------
  // START: state

  dialogue : HTMLDialogElement | null = null;

  @state()
  _time : number = 0;

  @state()
  _temp : number = 0;

  @state()
  _notes : string = '';

  @state()
  _options : TUserEnteredOptions = {};

  @state()
  _canSubmit : TUserEnteredOptions = {};

  @state()
  _tempError : boolean = false;

  @state()
  _timeError : boolean = false;

  @state()
  _expectedTemp : number = 0;


  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  _getID(suffix: string) : string {
    return `${this.id}--${suffix}`;
  }

  _resetValues() : void {
    this._temp = 0;
    this._notes = '';
    this._tempError = false;
    this._timeError = false;
  }

  _getSubmitClass() : string {
    const dis = (this._temp <= 0 || this._tempError || this._timeError)
      ? ' disabled'
      : '';

    return `submit-btn${dis}`;
  }

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  handleOptionChange(event : InputEvent) : void {
    event.preventDefault();
    console.group('<log-entry-input>.handleOptionChange()');
    console.log('event:', event);
    console.groupEnd();
  }

  toggleDialogue(event : InputEvent) : void {
    event.preventDefault();
    // console.log('event:', event);
    if (this.dialogue === null
      && event.target instanceof HTMLButtonElement) {
      const tmp = (event.target.parentNode as HTMLDivElement).getElementsByTagName('dialog');
      if (tmp.length > 0) {
        this.dialogue = tmp[0]
      }
    }
    if (this.dialogue !== null && this.dialogue.open !== true) {
      this._time = Date.now();
      this._resetValues();
      this.dialogue.showModal();

      if (this.rampRate > 0 && this.startTemp > 0 && this.startTime > 0) {
        this._expectedTemp = calculateExpectedTemp(
          this.startTemp,
          this._time,
          this.startTime,
          this.rampRate,
        );
      }
    }
  }

  handleTimeChange(event : CustomEvent) : void {
    event.preventDefault();
    if (event.detail instanceof InputValueClass) {
      if (event.detail.checkValidity() === true) {
        this._time = forceNum(event.detail.value, this._time);

        this._timeError = false;
      } else {
        this._timeError = true;
      }
    }
  }

  handleTempChange(event : CustomEvent) : void {
    event.preventDefault();
    if (event.detail instanceof InputValueClass) {
      if (event.detail.checkValidity() === true) {
        this._temp = forceNum(event.detail.value, this._temp);

        this._tempError = false;
      } else {
        this._tempError = true;
      }
    }
  }

  handleNotesChange(event : InputEvent) : void {
    event.preventDefault();
    this._notes = (event.target as HTMLTextAreaElement).value.replace(/<.*?>/isg, '').substring(0, 500);
  }

  submitLog() {
    if (this._temp <= 0 || this._temp > 1400) {
      this._tempError = true;
    }
    if (this._time <= 0) {
      this._timeError = true;
    }
    if (this._tempError === false
      && this._timeError === false
      && this.dialogue !== null
      && this.dialogue.open === true
    ) {
      dispatchFLaction(
        this,
        'submit-log-entry',
        {
          firingID: this.id,
          temp: this._temp,
          time: this._time,
          notes: this._notes,
          changes: this._options,
        },
        this.userID,
      );

      this.dialogue.close();
      this._resetValues();
    }
  }

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  connectedCallback(): void {
    super.connectedCallback();
    console.group('<log-entry-input>.connectedCallback()');
    console.log('this:', this);
    console.log('this.notMetric:', this.notMetric);
    console.groupEnd();
  }

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper render methods

  _renderOption({ key, label, options, value } : TLogEntryOption) : TemplateResult {
    return html`
      <log-entry-option
        .key="${this._getID(key)}"
        .label="${label}"
        .options=${options}
        .value=${value}
        @change=${this.handleOptionChange}></log-entry-option>`;
  }

  _renderOtherOptions() : TemplateResult | string {
    if (this.options.length === 0) {
      return '';
    }
    return html`
      <li>
        <details id="${this._getID('details')}">
          <summary>Other changes</summary>
          <ul>
            ${this.options.map(this._renderOption)}
          </ul>
        </details>
      </li>`;
  }

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() {
    const buttonClasses = {
      'submit-btn': true,
      'disabled': (this._temp <= 0 || this._tempError || this._timeError)
    };

    return html`
      <div>
        <button @click=${this.toggleDialogue}>Add a log entry</button>
        <dialog id="${this._getID('dialog')}">
          <form name="${this._getID('form')}">
            <h3>Firing log entry</h3>
            <ul>
              <li>
                <strong class="label">Owner:</strong>
                <span class="input">${this.userName}</span>
                <span class="extra user-id">(ID: <code>${this.userID}</code>)</span>
              </li>
              <temperature-input
                id="${this._getID('temp')}"
                ?not-metric=${this.notMetric}
                placeholder=${this._expectedTemp}
                ?show-error=${ifDefined(this._tempError ? true : undefined)}
                .value="${this._temp}"
                @change=${this.handleTempChange}></temperature-input>
              <time-input
                id="${this._getID('time')}"
                .value="${this._time}"
                @change=${this.handleTimeChange}></time-input>
              ${this._renderOtherOptions()}
              <li>
                <details>
                  <summary>Notes</summary>
                  <label class="label" for="${this._getID('notes')}">Add a notes to this log entry</label>
                  <textarea
                    id="${this._getID('notes')}"
                    maxlength="500"
                    @change=${this.handleNotesChange}></textarea>
                  <small>Markdown can be used</small>
                </details>
              </li>
            </ul>
            <button
              class="${classMap(buttonClasses)}"
              type="button"
              @click=${this.submitLog}>Enter</button>
          </form>
        </dialog>
      </div>
    `;
  }

  static styles = css`
  :host {
    --border-coluor: #ccc;
    --back-drop: rgba(0, 0, 0, 0.75);
  }
  ${dialogStyles}
  ${logEntryInputVars}
  h3 {
    margin-top: 0;
    padding: 0.5rem 1rem;
    border-bottom: 0.05rem dashed var(--border-colour, #ccc);
  }
  ul {
    list-style-type: none;
    padding: 0 1rem;
    margin: 0;
    text-align: left;
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
  }
  ${logEntryInputStyle}
  .user-id { font-size: 0.75rem; }
  code {
    font-size: 0.9rem;
  }
  textarea {
    box-sizing: border-box;
    display: block;
    margin-top: 0.5rem;
    min-height: 5rem;
    width: 100%;
  }
  .submit-btn {
    display: block;
    font-weight: bold;
    width: calc(100% - 2rem);
    margin: 1rem 1rem 0;
  }
  .submit-btn:disabled:hover,
  .submit-btn.disabled:hover {
    cursor: not-allowed;
  }
  details {
    width: 100%;
  }
  details > summary:hover {
    cursor: pointer;
  }
  @media screen and (min-width: 20rem) {
    dialog { max-width: 18.5rem; }
  }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'log-entry-input': LogEntryInput,
  }
};
