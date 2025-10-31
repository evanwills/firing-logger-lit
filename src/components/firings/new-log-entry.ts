import { LitElement, css, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
// import { ifDefined } from 'lit/directives/if-defined.js';
import type { ITempLogEntry, TFiringLogEntryType, TFiringState } from '../../types/firings.d.ts';
import type { FConverter } from '../../types/data-simple.d.ts';
import type { IProgramStep } from '../../types/programs.d.ts';
import type { TOptionValueLabel } from "../../types/renderTypes.d.ts";
import { x2x } from '../../utils/conversions.utils.ts';
import { isTFiringLogEntryType } from "../../types/firing.type-guards.ts";
import '../shared-components/firing-logger-modal.ts';
import '../input-fields/accessible-select-field.ts';
import '../input-fields/accessible-temporal-field.ts';
import '../input-fields/accessible-text-field.ts';
import { getISO8601time } from "../../utils/date-time.utils.ts";

@customElement('new-log-entry')
export class NewLogEntry extends LitElement {
  // ------------------------------------------------------
  // START: properties/attributes

  @property({ type: String, attribute: 'type' })
  type : TFiringLogEntryType | '' = '';

  @property({ type: String, attribute: 'status' })
  status : TFiringState | '' = '';

  @property({ type: Array })
  programSteps : IProgramStep[] = [];

  @property({ type: Array })
  tempLog : ITempLogEntry[] = [];

  @property({ type: Array })
  stateOptions : TOptionValueLabel[] = [];

  /**
   * @property Convert temperature (if needed) from Celcius to Fahrenheit
   */
  @property({ type: Function, attribute: 'converter' })
  converter : FConverter = x2x;

  /**
   * @property Temperature unit indicator to match user's preference
   */
  @property({ type: String, attribute: 'unit' })
  unit : string = 'C';

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
    { value: 'responsbile', label: 'Update who is responsible' },
  ];

  @state()
  _requireNotes : boolean = false;

  @state()
  _now : number = 0;

  @state()
  _time : number = 0;


  @state()
  _humanNow : string = '';

  _updateNow : number = -1;



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
    const { value, validity } = event.detail;
    console.log('value:', value);
    console.log('validity:', validity);

    let tmpRequire = false;

    if (validity.valid === true && isTFiringLogEntryType(value)) {
      this._type = value;
      tmpRequire = (this._type === 'issue' || this._type === 'observation');
    }

    this._requireNotes = tmpRequire;

    console.log('this._type (after):', this._type);
    console.groupEnd();
  }

  handleOpen({ detail }: CustomEvent) : void {
    console.group('<new-log-entry>.handleOpen()');
    console.log('detail:', detail);
    console.log('this._time:', this._time);
    console.log('this._updateNow:', this._updateNow);
    if (detail === true) {
      if (this._time === 0) {
        this._resetNow();
      }
    } else if (this._updateNow >= 0) {
      clearTimeout(this._updateNow);
    }
    console.groupEnd();
  }

  //  END:  event handlers
  // ------------------------------------------------------
  // START: lifecycle methods

  //  END:  lifecycle methods
  // ------------------------------------------------------
  // START: helper render methods

  _renderCustomFields() : TemplateResult | string {
    console.group('<new-log-entry>._renderCustomFields()');
    console.log('this._type:', this._type);
    console.log('this._now:', this._now);
    console.log('this._time:', this._time);
    console.log('this._humanNow:', this._humanNow);
    if (this._type === '') {
      return '';
    }

    let output : TemplateResult | string = '';

    switch (this._type) {
      case 'temp':
        output = html``;
        break;

      case 'firingState':
        output = html``;
        break;

      case 'responsible':
        output = html``;
        break;
    }

    console.groupEnd();
    return html`<li><accessible-temporal-field
        field-id="log-time"
        label="Time"
        type="time"
        .value=${this._humanNow}></accessible-temporal-field></li>
      ${output}
      <li><accessible-text-field
        field-id="log-notes"
        multi-line
        label="Notes"
        ?required=${this._requireNotes}></accessible-text-field></li>`;
  }

  //  END:  helper render methods
  // ------------------------------------------------------
  // START: main render method

  render() : TemplateResult {
    console.group('<new-log-entry>.render()');
    console.log('this._type (before):', this._type);
    this._setType();

    const options = (this._type === '')
      ? [
        { value: '', label: '-- Please choose --' },
        ...this._logTypes,
      ]
      : this._logTypes;

    console.log('this._type (after):', this._type);
    console.log('this._logTypes:', this._logTypes);
    console.log('options:', options);
    console.groupEnd();
    return html`
      <firing-logger-modal
        btn-text="New log entry"
        heading="New firing log entry"
        @open=${this.handleOpen.bind(this)}>
        <ul >
          <li><accessible-select-field
            field-id="log-type"
            label="Log type"
            .options=${options}
            value="${this.type}"
            @change=${this.updateType.bind(this)}></accessible-select-field></li>
          ${this._renderCustomFields()}
        </ul>
      </firing-logger-modal>
    `;
  }

  //  END:  main render method
  // ------------------------------------------------------
  // START: styles

  static styles = css`
    ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
    }
    li {
      padding-block: 0.5rem;
    }
  `;

  //  END:  styles
  // ------------------------------------------------------
}

declare global {
  interface HTMLElementTagNameMap {
    'new-log-entry': NewLogEntry,
  }
};
