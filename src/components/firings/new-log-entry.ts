import { LitElement, css, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
// import { ifDefined } from 'lit/directives/if-defined.js';
import type { ITempLogEntry, TFiringLogEntryType, TFiringState } from '../../types/firings.d.ts';
import type { FConverter } from '../../types/data-simple.d.ts';
import type { IProgramStep } from '../../types/programs.d.ts';
import type { TOptionValueLabel } from '../../types/renderTypes.d.ts';
import { x2x } from '../../utils/conversions.utils.ts';
import { isTFiringLogEntryType } from '../../types/firing.type-guards.ts';
import '../shared-components/firing-logger-modal.ts';
import '../input-fields/accessible-select-field.ts';
import '../input-fields/accessible-temporal-field.ts';
import '../input-fields/accessible-text-field.ts';
import { getISO8601time } from '../../utils/date-time.utils.ts';
import { emptyOrNull } from '../../utils/data.utils.ts';
import { detailsStyle } from '../../assets/css/details.css.ts';
import { buttonStyles } from '../../assets/css/buttons.css.ts';
import { fieldListStyles } from '../../assets/css/input-field.css.ts';
import { FiringLoggerModal } from '../shared-components/firing-logger-modal.ts';

@customElement('new-log-entry')
export class NewLogEntry extends LitElement {
  // ------------------------------------------------------
  // START: properties/attributes

  /**
   * @property Convert temperature (if needed) from Celcius to Fahrenheit
   */
  @property({ type: Function, attribute: 'converter' })
  converter : FConverter = x2x;

  /**
   * @property Convert temperature (if needed) from Celcius to Fahrenheit
   */
  @property({ type: Function, attribute: 'convert-rev' })
  convertRev : FConverter = x2x;

  @property({ type: Array })
  programSteps : IProgramStep[] = [];

  @property({ type: Array })
  stateOptions : TOptionValueLabel[] = [];

  @property({ type: String, attribute: 'status' })
  status : TFiringState | '' = '';

  @property({ type: Array })
  tempLog : ITempLogEntry[] = [];

  @property({ type: String })
  startTime : number = 0;

  @property({ type: String, attribute: 'type' })
  type : TFiringLogEntryType | '' = '';

  /**
   * @property Temperature unit indicator to match user's preference
   */
  @property({ type: String, attribute: 'unit' })
  unit : string = 'C';

  /**
   * @property Temperature unit indicator to match user's preference
   */
  @property({ type: String, attribute: 'user-id' })
  userID : string = '';

  //  END:  properties/attributes
  // ------------------------------------------------------
  // START: state

  @state()
  _type : TFiringLogEntryType | '' = '';

  _logTypes : TOptionValueLabel[] = [
    { value: 'temp', label: 'Record temperature' },
    { value: 'firingState', label: 'Update firing state' },
    { value: 'issue', label: 'Report an issue or problem' },
    { value: 'observation', label: 'Record an observation' },
    { value: 'responsible', label: 'Update who is responsible' },
  ];

  @state()
  _open : boolean = false;

  @state()
  _requireNotes : boolean = false;

  @state()
  _now : number = 0;

  @state()
  _time : number = 0;

  @state()
  _humanNow : string = '';

  @state()
  _requireHelpTxt : string = '';

  _updateNow : number = -1;

  _emptyOption : TOptionValueLabel = { value: '', label: '-- Please choose --' }

  _logEntry : Map<string, string|number|boolean> = new Map();

  _requiredFields : Set<string> = new Set();


  //  END:  state
  // ------------------------------------------------------
  // START: helper methods

  _setType() : void {
    if (this._type === '' && isTFiringLogEntryType(this.type)) {
      this._type = this.type;
    }
  }

  _getNow() {
    let now = 0;
    if (this._now > 0) {
      now = this._now;
    } else if (this._time > 0) {
      now = this._time;
    }

    return (now > 0)
      ? getISO8601time(now, true)
      : '';
  }

  _getOptions() {
    const isActive = new Set(['active', 'complete', 'aborted']).has(this.status);
    const none = new Set((isActive === false)
      ? ['temp', 'responsible']
      : []
    );

    return this._logTypes.filter((option) => !none.has(option.value));
  }

  _resetNow() : void {
    console.group('<new-log-entry>._resetNow()');
    console.log('this._now (before):', this._now);
    const now = new Date();
    this._now = now.getTime();
    this._humanNow = this._getNow();

    this._updateNow = setTimeout(this._resetNow.bind(this), ((60 - now.getSeconds()) * 1000));
    console.log('this._now (after):', this._now);
    console.log('this._humanNow (after):', this._humanNow);
    console.groupEnd();
  }

  _setRequireNotes(message: string = '') : void {
    if (message === '') {
      this._requiredFields.delete('notes');
      this._requireHelpTxt = '';
      this._requireNotes = false;
    } else {
      this._requiredFields.add('notes');
      this._requireHelpTxt = message;
      this._requireNotes = true;
    }
  }

  _closeModal() : void {
    const modal = this.shadowRoot?.querySelector('firing-logger-modal');

    if (modal instanceof FiringLoggerModal && modal.open === true) {
      modal.close();
    }
  }

  //  END:  helper methods
  // ------------------------------------------------------
  // START: event handlers

  updateType( event : CustomEvent) : void {
    console.group('<new-log-entry>.updateType()');
    console.log('event:', event);
    console.log('event.detail:', event.detail);
    console.log('event.detail.value:', event.detail.value);
    console.log('event.detail.validity:', event.detail.validity);
    console.log('this._type (before):', this._type);
    console.log('this._requiredFields (before):', this._requiredFields);
    const { value, validity } = event.detail;
    console.log('value:', value);
    console.log('validity:', validity);

    this._requiredFields.clear();

    if (validity.valid === true && isTFiringLogEntryType(value)) {
      this._type = value;
      const tmpRequire = (this._type === 'issue' || this._type === 'observation');

      if (tmpRequire === true) {
        if (this._type === 'issue') {
          this._setRequireNotes('Please describe the problem or issue.');
        } else if (this._type === 'observation') {
          this._setRequireNotes('Please enter a description of your observation.');
        } else {
          this._setRequireNotes();
        }
      } else if (this._type === 'firingState') {
        this._requiredFields.add('firingState');
      } else if (this._type === 'temp') {
        this._requiredFields.add('tempActual');
      } else if (this._type === 'responsible') {
        this._requiredFields.add('isStart');
        this._requiredFields.add('responsibilityType');
      }
    } else {
      this._setRequireNotes();
      this._type = '';
    }

    console.log('this._type (after):', this._type);
    console.log('this._requiredFields (after):', this._requiredFields);
    console.groupEnd();
  }

  setSpecific({ detail } : CustomEvent) : void {
    console.group('<new-log-entry>.setSpecific()');
    console.log('detail:', detail);
    console.log('this._time:', this._time);
    console.log('this._updateNow:', this._updateNow);
    const key : string = detail._id.substring(4);
    console.log('key:', key);

    if (detail._validity.valid === true) {
      const value = detail._value;

      this._logEntry.set(key, detail._value as string);
      console.log('this._logEntry:', this._logEntry);
      console.log('this._requireNotes (before):', this._requireNotes);
      console.log('this._requireHelpTxt (before):', this._requireHelpTxt);
      console.log('this._requiredFields (before):', this._requiredFields);

      if (key === 'firingState') {
        const prefix = 'Please say why ';
        if (value === 'cancelled') {
          this._setRequireNotes(`${prefix}you are cancelling this firing`);
        } else if (value === 'aborted') {
          this._setRequireNotes(`${prefix}this firing was aborted`);
        } else {
          this._setRequireNotes();
        }
      }
      console.log('this._requireNotes (after):', this._requireNotes);
      console.log('this._requireHelpTxt (after):', this._requireHelpTxt);
      console.log('this._requiredFields (after):', this._requiredFields);
    } else {
      console.warn('current value is invalid');
      this._logEntry.delete(key);
    }

    console.groupEnd();
  }

  handleOpen({ detail }: CustomEvent) : void {
    console.group('<new-log-entry>.handleOpen()');
    console.log('detail:', detail);
    console.log('this._time:', this._time);
    console.log('this._updateNow:', this._updateNow);
    this._open = detail;

    if (detail === true) {
      if (this._time === 0) {
        this._resetNow();
      }
    } else if (this._updateNow >= 0) {
      clearTimeout(this._updateNow);
      this._type = '';
    }
    console.groupEnd();
  }

  handleSubmit() : void {

    this._closeModal();
  }

  handleCancel() : void {
    this._closeModal();
  }

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper render methods

  _renderCustomFields() : TemplateResult  {
    console.group('<new-log-entry>._renderCustomFields()');
    console.log('this._type:', this._type);
    console.log('this._now:', this._now);
    console.log('this._time:', this._time);
    console.log('this._humanNow:', this._humanNow);
    const cancel = html`<button
      class="secondary"
      type="button"
      @click=${this.handleCancel.bind(this)}>Cancel</button>`;

    if (this._type === '') {
      return html`<li class="btn-wrap">${cancel}</li>`;
    }

    let output : TemplateResult | string = '';

    switch (this._type) {
      case 'temp':
        output = html`<li><accessible-number-field
            block-before="22"
            field-id="log-actualTemp"
            label="Temperature"
            unit="${this.unit}"
            step="1"
            @change=${this.setSpecific.bind(this)}></accessible-select-field></li>`;
        break;

      case 'firingState':
        output = html`<li><accessible-select-field
            block-before="22"
            field-id="log-firingState"
            label="Firing"
            .options=${this.stateOptions}
            value="${this.type}"
            required
            show-empty
            @change=${this.setSpecific.bind(this)}></accessible-select-field></li>`;
        break;

      case 'responsible':
        output = html``;
        break;
    }

    console.groupEnd();
    return html`<li><accessible-temporal-field
        block-before="22"
        field-id="log-time"
        label="Time"
        type="time"
        .value=${this._humanNow}
        @change=${this.setSpecific.bind(this)}></accessible-temporal-field></li>
      ${output}
      <li><accessible-text-field
        block-before="22"
        field-id="log-notes"
        help-msg="${this._requireHelpTxt}"
        multi-line
        label="Notes"
        ?required=${this._requireNotes}
        @change=${this.setSpecific.bind(this)}></accessible-text-field></li>
      <li class="btn-wrap"><button
        class="primary"
        type="button"
        @click=${this.handleSubmit.bind(this)}>Save</button> ${cancel}</li>`;
  }

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult {
    console.group('<new-log-entry>.render()');
    console.log('this._type (before):', this._type);
    console.log('this._type (before):', this._type);
    this._setType();

    const options = this._getOptions();

    console.log('this._type (after):', this._type);
    console.log('this._logTypes:', this._logTypes);
    console.log('options:', options);
    console.groupEnd();
    return html`
      <firing-logger-modal
        btn-text="New log entry"
        heading="New firing log entry"
        @open=${this.handleOpen.bind(this)}>
        ${(this._open === true)
          ? html`<ul class="details w-30 btn-container">
              <li><accessible-select-field
                block-before="22"
                field-id="log-type"
                label="Log type"
                .options=${options}
                ?show-empty=${emptyOrNull(this.type)}
                value="${this.type}"
                @change=${this.updateType.bind(this)}></accessible-select-field></li>
              ${this._renderCustomFields()}
            </ul>`
          : ''
        }

      </firing-logger-modal>
    `;
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`
    ${detailsStyle}
    ${buttonStyles}
    ${fieldListStyles}
  `;

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'new-log-entry': NewLogEntry,
  }
};
